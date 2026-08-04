(function () {
  var MAX_MS = (window.NANIK_API && window.NANIK_API.maxRecordMs) || 10000;
  var MIN_MS = (window.NANIK_API && window.NANIK_API.minRecordMs) || 5000;
  var RING_R = 54;
  var RING_C = 2 * Math.PI * RING_R;
  var SESSION_KEY = 'nanik-marketing-supabase-session';
  var CLONE_USED_KEY = 'nanik-marketing-voice-cloned';

  function resetVoiceDemoStorage() {
    try { localStorage.removeItem(CLONE_USED_KEY); } catch (e) {}
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) {}
  }

  try {
    var resetParams = new URLSearchParams(location.search || '');
    if (resetParams.get('reset-voice') === '1') {
      resetVoiceDemoStorage();
      resetParams.delete('reset-voice');
      var clean = location.pathname + (resetParams.toString() ? '?' + resetParams.toString() : '') + location.hash;
      if (history.replaceState) history.replaceState(null, '', clean);
    }
  } catch (e) {}

  // Match app defaults (higgsNarration + narrationPcmMerge)
  var TRIM_THRESHOLD = 420;
  var TRIM_EDGE_PAD_MS = 18;
  var TRIM_MIN_KEEP_MS = 80;
  var TAIL_TRIM_MS = 90;
  var EDGE_FADE_MS = 10;

  var modal = document.getElementById('voice-magic-modal');
  var openBtn = document.getElementById('open-voice-magic') || document.querySelector('[data-open-voice-magic]');
  var recordBtn = document.getElementById('voice-magic-record');
  var consentLabel = document.getElementById('voice-magic-consent');
  var consentCheck = document.getElementById('voice-magic-consent-check');
  var orb = document.getElementById('voice-magic-orb');
  var countdownEl = document.getElementById('voice-magic-countdown');
  var statusEl = document.getElementById('voice-magic-status');
  var sampleEl = modal ? modal.querySelector('.voice-magic-sample') : null;
  var progressFill = modal ? modal.querySelector('.voice-magic-progress-fill') : null;
  var leadEl = document.getElementById('hero-lead');
  var leadWrap = document.getElementById('hero-lead-wrap');
  var narrationBar = document.getElementById('hero-narration-bar');
  var narrationToggle = document.getElementById('hero-narration-toggle');
  var narrationProgress = document.getElementById('hero-narration-progress');
  var flowEl = document.getElementById('voice-magic-flow');
  var lockedEl = document.getElementById('voice-magic-locked');
  if (!modal || !recordBtn) return;
  if (!openBtn && !document.querySelector('[data-open-voice-magic]')) return;

  var phase = 'idle'; // idle | recording | processing | ready | hero
  var startedAt = 0;
  var labelEl = recordBtn.querySelector('span:last-child');
  var startText = labelEl ? labelEl.textContent : 'Start recording';
  var stopText = startText.indexOf('Սկսել') !== -1 ? 'Կանգնեցնել' : 'Stop recording';
  var hearText = startText.indexOf('Սկսել') !== -1 ? 'Լսիր հեքիաթը իմ ձայնով' : 'Hear the tale in my voice';
  var magicCtaLabel = openBtn
    ? openBtn.querySelector('[data-i18n="index.magic.cta"], span:last-child')
    : null;
  var magicCtaDefault = magicCtaLabel ? magicCtaLabel.textContent : 'Hear the magic';
  var magicCtaWait = magicCtaDefault.indexOf('Լսիր') !== -1 ? 'Մի պահ սպասիր…' : 'Wait for a sec.';

  var stream = null;
  var audioCtx = null;
  var analyser = null;
  var dataArray = null;
  var rafId = 0;
  var smoothLevel = 0;
  var mediaRecorder = null;
  var chunks = [];
  var recordedMime = 'audio/webm';
  var previewUrl = null;
  var previewAudio = null;
  var voiceId = null;
  var leadPlainText = '';
  var wordSpans = [];
  var wordTimings = [];
  var syncRaf = 0;
  var activeWordIndex = -1;

  if (progressFill) {
    progressFill.style.strokeDasharray = String(RING_C);
    progressFill.style.strokeDashoffset = String(RING_C);
  }

  function api() {
    return window.NANIK_API || null;
  }

  function higgsCfg() {
    var cfg = api();
    return (cfg && cfg.higgs) || {};
  }

  function setStatus(text, show) {
    if (!statusEl) return;
    statusEl.hidden = !show;
    statusEl.textContent = text || '';
  }

  function setLabel(text, i18nKey) {
    if (!labelEl) return;
    if (i18nKey) labelEl.setAttribute('data-i18n', i18nKey);
    labelEl.textContent = text;
  }

  function setOrbLevel(level) {
    if (!orb) return;
    var t = Math.max(0, Math.min(1, level));
    orb.style.setProperty('--voice-level', t.toFixed(3));
    orb.style.setProperty('--voice-scale-outer', (1 + t * 0.55).toFixed(3));
    orb.style.setProperty('--voice-scale-mid', (1 + t * 0.38).toFixed(3));
    orb.style.setProperty('--voice-scale-inner', (1 + t * 0.22).toFixed(3));
    orb.style.setProperty('--voice-glow', (0.25 + t * 0.75).toFixed(3));
  }

  function pickRecorderMime() {
    if (!window.MediaRecorder) return '';
    var candidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/ogg;codecs=opus'
    ];
    for (var i = 0; i < candidates.length; i++) {
      if (MediaRecorder.isTypeSupported(candidates[i])) return candidates[i];
    }
    return '';
  }

  function uint8ToBase64(bytes) {
    var chunk = 0x8000;
    var binary = '';
    for (var i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, Math.min(i + chunk, bytes.length)));
    }
    return btoa(binary);
  }

  function mixToMono(audioBuffer) {
    var length = audioBuffer.length;
    var channels = audioBuffer.numberOfChannels;
    if (channels === 1) return new Float32Array(audioBuffer.getChannelData(0));
    var out = new Float32Array(length);
    for (var c = 0; c < channels; c++) {
      var data = audioBuffer.getChannelData(c);
      for (var i = 0; i < length; i++) out[i] += data[i] / channels;
    }
    return out;
  }

  function floatToPcm16(float32) {
    var out = new Int16Array(float32.length);
    for (var i = 0; i < float32.length; i++) {
      var s = Math.max(-1, Math.min(1, float32[i]));
      out[i] = s < 0 ? (s * 0x8000) | 0 : (s * 0x7fff) | 0;
    }
    return out;
  }

  function trimPcm16Silence(pcm) {
    if (pcm.length < 2) return pcm;
    var start = 0;
    while (start < pcm.length && Math.abs(pcm[start]) <= TRIM_THRESHOLD) start += 1;
    var end = pcm.length - 1;
    while (end > start && Math.abs(pcm[end]) <= TRIM_THRESHOLD) end -= 1;
    var pad = Math.max(0, Math.floor((24000 * TRIM_EDGE_PAD_MS) / 1000));
    start = Math.max(0, start - pad);
    end = Math.min(pcm.length - 1, end + pad);
    var kept = end - start + 1;
    var minKeep = Math.max(1, Math.floor((24000 * TRIM_MIN_KEEP_MS) / 1000));
    if (kept < minKeep) return pcm;
    return pcm.subarray(start, end + 1);
  }

  function trimPcm16TailMs(pcm, sampleRate, tailMs) {
    if (pcm.length < 2 || sampleRate <= 0 || tailMs <= 0) return pcm;
    var trimSamples = Math.floor((sampleRate * tailMs) / 1000);
    var minKeep = Math.max(1, Math.floor((sampleRate * TRIM_MIN_KEEP_MS) / 1000));
    if (pcm.length - trimSamples < minKeep) return pcm;
    return pcm.subarray(0, pcm.length - trimSamples);
  }

  function applyEdgeFade(pcm, sampleRate) {
    if (pcm.length < 2 || sampleRate <= 0) return pcm;
    var fadeSamples = Math.min(
      Math.floor((sampleRate * EDGE_FADE_MS) / 1000),
      Math.floor(pcm.length / 2)
    );
    if (fadeSamples <= 0) return pcm;
    var out = new Int16Array(pcm);
    for (var i = 0; i < fadeSamples; i++) {
      var gain = 0.5 * (1 - Math.cos((Math.PI * i) / fadeSamples));
      out[i] = Math.round(out[i] * gain);
      out[pcm.length - 1 - i] = Math.round(out[pcm.length - 1 - i] * gain);
    }
    return out;
  }

  function appendSilence(pcm, sampleRate, silenceMs) {
    var pad = Math.max(0, Math.floor((sampleRate * silenceMs) / 1000));
    if (pad <= 0) return pcm;
    var out = new Int16Array(pcm.length + pad);
    out.set(pcm, 0);
    return out;
  }

  function capPcmSamples(pcm, sampleRate, maxSec) {
    var maxSamples = Math.max(1, Math.floor(sampleRate * maxSec));
    if (pcm.length <= maxSamples) return pcm;
    return pcm.subarray(0, maxSamples);
  }

  function wrapPcm16InWav(pcm, sampleRate) {
    var dataBytes = pcm.length * 2;
    var buffer = new ArrayBuffer(44 + dataBytes);
    var view = new DataView(buffer);
    function writeStr(offset, str) {
      for (var i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    }
    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + dataBytes, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, 'data');
    view.setUint32(40, dataBytes, true);
    var out = new Uint8Array(buffer);
    out.set(new Uint8Array(pcm.buffer, pcm.byteOffset, dataBytes), 44);
    return out;
  }

  function peakAbs(pcm) {
    var peak = 0;
    for (var i = 0; i < pcm.length; i++) {
      var v = Math.abs(pcm[i]);
      if (v > peak) peak = v;
    }
    return peak;
  }

  function bytesToPcm16Le(bytes) {
    var even = bytes.byteLength - (bytes.byteLength % 2);
    return new Int16Array(bytes.buffer, bytes.byteOffset, even / 2);
  }

  function concatPcm16(parts) {
    var total = 0;
    for (var i = 0; i < parts.length; i++) total += parts[i].length;
    var out = new Int16Array(total);
    var offset = 0;
    for (var j = 0; j < parts.length; j++) {
      out.set(parts[j], offset);
      offset += parts[j].length;
    }
    return out;
  }

  function countNarrationWords(text) {
    var tokens = String(text || '')
      .replace(/<\|[^|]+:[^|]+\|>/g, '')
      .trim()
      .match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu);
    return tokens ? tokens.length : 0;
  }

  function estimateHiggsTokens(text) {
    var trimmed = String(text || '').trim();
    if (!trimmed) return 0;
    return Math.ceil(trimmed.length / 3.5);
  }

  function stripInlineHiggsPauseTags(text) {
    return String(text || '')
      .replace(/<\|[^|]+\|>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function ensureHiggsChunkEndsWithPeriod(text) {
    var trimmed = stripInlineHiggsPauseTags(String(text || '').trim());
    if (!trimmed) return trimmed;
    if (trimmed.endsWith('.')) return trimmed;
    var body = trimmed.replace(/[.:։!?,…]+["'»»\)]*$/u, '.');
    return body.endsWith('.') ? body : body + '.';
  }

  /** Match app finalizeHiggsChunkText / server prepareTtsChunkText('higgs'). */
  function prepareHiggsChunkText(text) {
    var body = String(text || '')
      .replace(/\s*\[SCENE_BREAKS?\]\s*/gi, ' ')
      .replace(/[ \t]+/g, ' ')
      .trim();
    if (!body) return body;
    body = stripInlineHiggsPauseTags(body);
    var out = '';
    var i = 0;
    while (i < body.length) {
      if (body.indexOf('<|', i) === i) {
        var tagEnd = body.indexOf('|>', i);
        if (tagEnd !== -1) {
          i = tagEnd + 2;
          continue;
        }
      }
      var ch = body.charAt(i);
      if (ch === '-' || ch === '–' || ch === '—') {
        i += 1;
        continue;
      }
      out += (ch === ':' || ch === '։') ? '.' : ch;
      i += 1;
    }
    return ensureHiggsChunkEndsWithPeriod(out.replace(/\s+/g, ' ').trim());
  }

  function splitAtTtsSentenceBoundaries(text) {
    var normalized = String(text || '').replace(/\s+/g, ' ').trim();
    if (!normalized) return [];
    var segments = [];
    var current = '';
    var i = 0;
    var boundary = { ':': 1, '.': 1, '։': 1 };
    while (i < normalized.length) {
      if (normalized.indexOf('<|', i) === i) {
        var tagEnd = normalized.indexOf('|>', i);
        if (tagEnd !== -1) {
          current += normalized.slice(i, tagEnd + 2);
          i = tagEnd + 2;
          continue;
        }
      }
      var ch = normalized.charAt(i);
      current += ch;
      if (boundary[ch]) {
        var piece = current.trim();
        if (piece) segments.push(piece);
        current = '';
      }
      i += 1;
    }
    var tail = current.trim();
    if (tail) segments.push(tail);
    return segments.length ? segments : [normalized];
  }

  function chunkLimits() {
    var h = higgsCfg();
    return {
      maxWords: Number(h.chunkMaxWords) || 60,
      coalesceMinWords: Number(h.chunkCoalesceMinWords) || 40,
      maxChars: Number(h.chunkMaxChars) || 1800,
      maxTokens: Number(h.chunkMaxTokens) || 2047,
      sentencesMax: Number(h.chunkSentencesMax) || 16
    };
  }

  function fitsChunkLimits(text, limits) {
    var trimmed = String(text || '').trim();
    if (!trimmed) return false;
    if (trimmed.length > limits.maxChars) return false;
    if (countNarrationWords(trimmed) > limits.maxWords) return false;
    if (estimateHiggsTokens(trimmed) > limits.maxTokens) return false;
    return true;
  }

  function canMergeChunks(a, b, limits) {
    var merged = (a + ' ' + b).trim();
    if (splitAtTtsSentenceBoundaries(merged).length > limits.sentencesMax) return false;
    return fitsChunkLimits(merged, limits);
  }

  function coalesceUndersizedChunks(chunks, limits) {
    if (chunks.length < 2) return chunks;
    var out = chunks.slice();
    var i = 0;
    while (i < out.length) {
      if (countNarrationWords(out[i]) >= limits.coalesceMinWords) {
        i += 1;
        continue;
      }
      if (i + 1 < out.length && canMergeChunks(out[i], out[i + 1], limits)) {
        out[i] = (out[i] + ' ' + out[i + 1]).trim();
        out.splice(i + 1, 1);
        continue;
      }
      if (i > 0 && canMergeChunks(out[i - 1], out[i], limits)) {
        out[i - 1] = (out[i - 1] + ' ' + out[i]).trim();
        out.splice(i, 1);
        continue;
      }
      i += 1;
    }
    return out;
  }

  /** App-style packs: full sentences up to ~60 words / 1800 chars. */
  function computeNarrationChunks(text) {
    var limits = chunkLimits();
    var scenes = String(text || '')
      .split(/\s*\[SCENE_BREAKS?\]\s*/gi)
      .map(function (s) { return s.trim(); })
      .filter(Boolean);
    if (!scenes.length) {
      var single = String(text || '').trim();
      return single ? [single] : [];
    }
    var packs = [];
    for (var s = 0; s < scenes.length; s++) {
      var sentences = splitAtTtsSentenceBoundaries(scenes[s]);
      var batch = [];
      for (var i = 0; i < sentences.length; i++) {
        var sentence = sentences[i];
        if (!batch.length) {
          batch.push(sentence);
          continue;
        }
        var candidate = (batch.join(' ') + ' ' + sentence).trim();
        var over =
          countNarrationWords(candidate) > limits.maxWords
          || candidate.length > limits.maxChars
          || estimateHiggsTokens(candidate) > limits.maxTokens;
        if (over || batch.length >= limits.sentencesMax) {
          packs.push(batch.join(' ').trim());
          batch = [sentence];
        } else {
          batch.push(sentence);
        }
      }
      if (batch.length) packs.push(batch.join(' ').trim());
    }
    return coalesceUndersizedChunks(packs.filter(Boolean), limits);
  }

  function resampleLinear(input, fromRate, toRate) {
    if (fromRate === toRate) return input;
    if (!input.length) return input;
    var outLen = Math.max(1, Math.round((input.length * toRate) / fromRate));
    var out = new Float32Array(outLen);
    var ratio = fromRate / toRate;
    for (var i = 0; i < outLen; i++) {
      var srcPos = i * ratio;
      var idx = Math.floor(srcPos);
      var frac = srcPos - idx;
      var s0 = input[Math.min(idx, input.length - 1)];
      var s1 = input[Math.min(idx + 1, input.length - 1)];
      out[i] = s0 + (s1 - s0) * frac;
    }
    return out;
  }

  /**
   * Match app prepareHiggsCloneReferenceWav:
   * decode → mono → 24 kHz → silence trim → 90 ms tail trim → edge fade → 500 ms pad → WAV
   */
  function prepareHiggsCloneWav(blob) {
    var h = higgsCfg();
    var targetRate = h.sampleRate || 24000;
    var speechMaxSec = h.cloneTargetSec || 9;
    var tailSilenceMs = h.cloneTailSilenceMs || 500;
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) {
      return Promise.reject(new Error('Audio conversion is not supported in this browser.'));
    }

    var decodeCtx = new Ctx();
    var closed = false;
    function closeDecode() {
      if (closed) return Promise.resolve();
      closed = true;
      return decodeCtx.close().catch(function () {});
    }

    return Promise.race([
      blob.arrayBuffer().then(function (arrayBuffer) {
        return decodeCtx.decodeAudioData(arrayBuffer.slice(0));
      }).then(function (decoded) {
        return closeDecode().then(function () {
          var mono = mixToMono(decoded);
          var floats = resampleLinear(mono, decoded.sampleRate, targetRate);
          var pcm = floatToPcm16(floats);
          pcm = trimPcm16Silence(pcm);
          pcm = trimPcm16TailMs(pcm, targetRate, TAIL_TRIM_MS);
          pcm = applyEdgeFade(pcm, targetRate);
          pcm = capPcmSamples(pcm, targetRate, speechMaxSec);
          if (peakAbs(pcm) < 500) {
            var silent = new Error('We could not hear a voice in this recording. Please try recording again.');
            silent.code = 'VOICE_SAMPLE_SILENT';
            throw silent;
          }
          pcm = appendSilence(pcm, targetRate, tailSilenceMs);
          var wavBytes = wrapPcm16InWav(pcm, targetRate);
          return {
            wavBytes: wavBytes,
            mimeType: 'audio/wav',
            filename: 'reference_clean.wav',
            durationMs: Math.round((pcm.length / targetRate) * 1000)
          };
        });
      }),
      new Promise(function (_, reject) {
        setTimeout(function () {
          closeDecode();
          reject(new Error('Preparing the recording timed out. Please try again.'));
        }, 20000);
      })
    ]).catch(function (err) {
      closeDecode();
      if (err && (err.code === 'VOICE_SAMPLE_SILENT' || err.code === 'INVALID_AUDIO')) throw err;
      if (err && /timed out/i.test(err.message || '')) throw err;
      var bad = new Error('The recording could not be converted. Please try again in Chrome or Safari.');
      bad.code = 'INVALID_AUDIO';
      throw bad;
    });
  }

  function updateCountdown() {
    if (phase !== 'recording') return;
    var elapsed = Date.now() - startedAt;
    var remaining = Math.max(0, Math.ceil((MAX_MS - elapsed) / 1000));
    var progress = Math.min(1, Math.max(0, elapsed / MAX_MS));
    if (countdownEl) countdownEl.textContent = String(remaining);
    if (progressFill) progressFill.style.strokeDashoffset = String(RING_C * (1 - progress));
    if (elapsed >= MAX_MS) stopRecordingAndClone();
  }

  function tick() {
    if (!analyser || !dataArray) return;
    analyser.getByteTimeDomainData(dataArray);
    var sum = 0;
    for (var i = 0; i < dataArray.length; i++) {
      var v = (dataArray[i] - 128) / 128;
      sum += v * v;
    }
    var rms = Math.sqrt(sum / dataArray.length);
    var level = Math.min(1, Math.pow(rms * 3.2, 0.75));
    smoothLevel += (level - smoothLevel) * 0.28;
    setOrbLevel(smoothLevel);
    updateCountdown();
    rafId = requestAnimationFrame(tick);
  }

  function stopMicTracks() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    if (stream) {
      stream.getTracks().forEach(function (track) { track.stop(); });
      stream = null;
    }
    if (audioCtx) {
      audioCtx.close().catch(function () {});
      audioCtx = null;
    }
    analyser = null;
    dataArray = null;
    smoothLevel = 0;
    setOrbLevel(0);
    mediaRecorder = null;
    chunks = [];
  }

  function startMicAndRecorder() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return Promise.reject(new Error('Mic unsupported'));
    }
    if (!window.MediaRecorder) {
      return Promise.reject(new Error('Recording unsupported'));
    }
    return navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      },
      video: false
    }).then(function (mediaStream) {
      stream = mediaStream;
      var Ctx = window.AudioContext || window.webkitAudioContext;
      audioCtx = new Ctx();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      var source = audioCtx.createMediaStreamSource(mediaStream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.75;
      source.connect(analyser);
      dataArray = new Uint8Array(analyser.fftSize);

      var mime = pickRecorderMime();
      recordedMime = mime || 'audio/webm';
      chunks = [];
      mediaRecorder = mime
        ? new MediaRecorder(mediaStream, { mimeType: mime })
        : new MediaRecorder(mediaStream);
      recordedMime = mediaRecorder.mimeType || recordedMime;
      mediaRecorder.ondataavailable = function (e) {
        if (e.data && e.data.size) chunks.push(e.data);
      };
      mediaRecorder.start(200);
      tick();
    });
  }

  function stopRecorder() {
    return new Promise(function (resolve) {
      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        resolve(chunks.length ? new Blob(chunks, { type: recordedMime || 'audio/webm' }) : null);
        return;
      }
      var settled = false;
      var timer = setTimeout(function () {
        if (settled) return;
        settled = true;
        var blob = chunks.length ? new Blob(chunks, { type: recordedMime || 'audio/webm' }) : null;
        resolve(blob);
      }, 2500);
      mediaRecorder.onstop = function () {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve(new Blob(chunks, { type: recordedMime || 'audio/webm' }));
      };
      try { mediaRecorder.requestData(); } catch (e) {}
      try { mediaRecorder.stop(); } catch (e) {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve(chunks.length ? new Blob(chunks, { type: recordedMime || 'audio/webm' }) : null);
        }
      }
    });
  }

  function loadSession() {
    try {
      var raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (parsed && parsed.accessToken) return parsed;
    } catch (e) {}
    return null;
  }

  function saveSession(session) {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (e) {}
  }

  function b64urlJson(part) {
    try {
      var b64 = part.replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      return JSON.parse(atob(b64));
    } catch (e) {
      return null;
    }
  }

  function isJwtExpired(token) {
    var payload = b64urlJson(String(token || '').split('.')[1] || '');
    if (!payload || !payload.exp) return true;
    return payload.exp * 1000 < Date.now() + 30000;
  }

  function setMagicCta(mode) {
    if (!magicCtaLabel || !openBtn) return;
    if (mode === 'wait') {
      magicCtaLabel.removeAttribute('data-i18n');
      magicCtaLabel.textContent = magicCtaWait;
      openBtn.disabled = true;
      openBtn.classList.add('is-waiting');
      openBtn.setAttribute('aria-busy', 'true');
    } else {
      magicCtaLabel.setAttribute('data-i18n', 'index.magic.cta');
      magicCtaLabel.textContent = magicCtaDefault;
      openBtn.disabled = false;
      openBtn.classList.remove('is-waiting');
      openBtn.removeAttribute('aria-busy');
    }
  }

  function ensureAuth() {
    var cfg = api();
    if (!cfg || !cfg.supabaseUrl || !cfg.supabaseAnonKey) {
      return Promise.reject(new Error('API config missing'));
    }
    var existing = loadSession();
    if (existing && existing.accessToken && !isJwtExpired(existing.accessToken)) {
      return Promise.resolve(existing);
    }
    if (existing && existing.refreshToken) {
      return fetch(cfg.supabaseUrl.replace(/\/$/, '') + '/auth/v1/token?grant_type=refresh_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: cfg.supabaseAnonKey,
          Authorization: 'Bearer ' + cfg.supabaseAnonKey
        },
        body: JSON.stringify({ refresh_token: existing.refreshToken })
      }).then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok) {
            clearSession();
            return null;
          }
          var accessToken = data.access_token;
          var refreshToken = data.refresh_token || existing.refreshToken;
          if (!accessToken) {
            clearSession();
            return null;
          }
          var session = { accessToken: accessToken, refreshToken: refreshToken || '' };
          saveSession(session);
          return session;
        });
      }).then(function (session) {
        if (session) return session;
        return signUpAnonymous();
      });
    }
    return signUpAnonymous();
  }

  function signUpAnonymous() {
    var cfg = api();
    // Same as app signInAnonymously (supabaseSession.ts)
    return fetch(cfg.supabaseUrl.replace(/\/$/, '') + '/auth/v1/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: cfg.supabaseAnonKey,
        Authorization: 'Bearer ' + cfg.supabaseAnonKey
      },
      body: JSON.stringify({ data: {} })
    }).then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok) {
          throw new Error(data.error_description || data.msg || data.error || 'Sign-in failed');
        }
        var nested = data.session && typeof data.session === 'object' ? data.session : data;
        var accessToken = nested.access_token || nested.accessToken;
        var refreshToken = nested.refresh_token || nested.refreshToken;
        if (!accessToken) throw new Error('Missing session token');
        var session = { accessToken: accessToken, refreshToken: refreshToken || '' };
        saveSession(session);
        return session;
      });
    });
  }

  function clearSession() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) {}
  }

  function ensureAuthFresh() {
    clearSession();
    return signUpAnonymous();
  }

  function postHiggs(path, body, accessToken, timeoutMs) {
    var cfg = api();
    var ms = timeoutMs || (path.indexOf('/tts') >= 0 ? 150000 : 55000);
    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = setTimeout(function () {
      if (controller) controller.abort();
    }, ms);
    return fetch(cfg.higgsProxy.replace(/\/$/, '') + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: cfg.supabaseAnonKey,
        Authorization: 'Bearer ' + accessToken
      },
      body: JSON.stringify(body),
      signal: controller ? controller.signal : undefined
    }).then(function (res) {
      return res.text().then(function (raw) {
        var data = {};
        if (raw) {
          try { data = JSON.parse(raw); } catch (e) {
            data = { error: raw.slice(0, 240) };
          }
        }
        if (!res.ok) {
          var msg = (data && (data.error || data.message || data.msg)) || ('Request failed (' + res.status + ')');
          var err = new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
          err.code = data && data.code;
          err.status = res.status;
          throw err;
        }
        return data;
      });
    }).then(function (data) {
      clearTimeout(timer);
      return data;
    }, function (err) {
      clearTimeout(timer);
      if (err && err.name === 'AbortError') {
        throw new Error(path.indexOf('/tts') >= 0
          ? 'Preparing your tale took too long. Please try again.'
          : 'Creating your voice took too long. Please try again.');
      }
      throw err;
    });
  }

  function getLeadText() {
    if (leadPlainText) return leadPlainText;
    if (leadEl) return (leadEl.textContent || '').trim();
    var cfg = api();
    return (cfg && cfg.previewText) || '';
  }

  function pageLanguageCode() {
    var lang = (document.documentElement.lang || 'en').toLowerCase();
    if (lang.indexOf('hy') === 0) return 'hye';
    if (lang.indexOf('ru') === 0) return 'rus';
    return 'eng';
  }

  function stopSyncLoop() {
    if (syncRaf) cancelAnimationFrame(syncRaf);
    syncRaf = 0;
  }

  function setNarrationPlayingUi(playing) {
    if (!narrationToggle) return;
    narrationToggle.setAttribute('aria-pressed', playing ? 'true' : 'false');
    narrationToggle.setAttribute('aria-label', playing ? 'Pause' : 'Play');
    var playIcon = narrationToggle.querySelector('.icon-play');
    var pauseIcon = narrationToggle.querySelector('.icon-pause');
    if (playIcon) playIcon.hidden = !!playing;
    if (pauseIcon) pauseIcon.hidden = !playing;
  }

  function restoreLeadText() {
    stopSyncLoop();
    activeWordIndex = -1;
    wordSpans = [];
    wordTimings = [];
    if (leadEl && leadPlainText) {
      leadEl.textContent = leadPlainText;
      leadEl.setAttribute('data-i18n', 'index.lead');
    }
    if (leadWrap) leadWrap.classList.remove('is-karaoke');
    if (narrationProgress) narrationProgress.style.width = '0%';
    setNarrationPlayingUi(false);
  }

  function buildKaraoke(text) {
    if (!leadEl) return;
    leadPlainText = text;
    leadEl.removeAttribute('data-i18n');
    var parts = text.split(/(\s+)/);
    leadEl.innerHTML = '';
    wordSpans = [];
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        leadEl.appendChild(document.createTextNode(part));
        continue;
      }
      var span = document.createElement('span');
      span.className = 'kw';
      span.textContent = part;
      leadEl.appendChild(span);
      wordSpans.push(span);
    }
    if (leadWrap) leadWrap.classList.add('is-karaoke');
  }

  function wordWeight(text) {
    var raw = String(text || '').replace(/[^\w\u0400-\u04FF\u0530-\u058F]+/g, '');
    return Math.max(1, raw.length || 1);
  }

  function buildWordTimings(duration) {
    var n = wordSpans.length;
    wordTimings = [];
    if (!n || !(duration > 0)) return;
    var weights = [];
    var total = 0;
    for (var i = 0; i < n; i++) {
      var w = wordWeight(wordSpans[i].textContent);
      weights.push(w);
      total += w;
    }
    var leadIn = Math.min(0.18, duration * 0.04);
    var trail = Math.min(0.22, duration * 0.05);
    var usable = Math.max(0.2, duration - leadIn - trail);
    var t = leadIn;
    for (var j = 0; j < n; j++) {
      var dur = (weights[j] / total) * usable;
      wordTimings.push({ start: t, end: t + dur });
      t += dur;
    }
  }

  function highlightWord(index) {
    if (index === activeWordIndex) return;
    activeWordIndex = index;
    for (var i = 0; i < wordSpans.length; i++) {
      wordSpans[i].classList.toggle('is-active', i === index);
      wordSpans[i].classList.toggle('is-past', i < index);
    }
  }

  function syncKaraoke() {
    if (!previewAudio) return;
    var t = previewAudio.currentTime || 0;
    var d = previewAudio.duration;
    if (narrationProgress && d > 0 && isFinite(d)) {
      narrationProgress.style.width = Math.min(100, (t / d) * 100).toFixed(2) + '%';
    }
    if (!wordTimings.length && d > 0 && isFinite(d)) {
      buildWordTimings(d);
    }
    if (wordTimings.length) {
      var idx = -1;
      for (var i = 0; i < wordTimings.length; i++) {
        if (t >= wordTimings[i].start) idx = i;
        else break;
      }
      highlightWord(idx);
    }
    if (!previewAudio.paused && !previewAudio.ended) {
      syncRaf = requestAnimationFrame(syncKaraoke);
    }
  }

  function pauseHeroPlayback() {
    stopSyncLoop();
    if (previewAudio) previewAudio.pause();
    setNarrationPlayingUi(false);
  }

  function armHeroPlaybackUi() {
    phase = 'hero';
    document.body.classList.add('hero-narrating');
    if (narrationBar) narrationBar.hidden = false;
    setNarrationPlayingUi(false);
    setMagicCta('default');
  }

  /** @param {{ fromUserGesture?: boolean }} [opts] */
  function playHeroPlayback(opts) {
    if (!previewAudio) return;
    var fromUserGesture = !!(opts && opts.fromUserGesture);
    phase = 'hero';
    document.body.classList.add('hero-narrating');
    if (narrationBar) narrationBar.hidden = false;
    setNarrationPlayingUi(true);
    previewAudio.play().then(function () {
      stopSyncLoop();
      syncRaf = requestAnimationFrame(syncKaraoke);
    }).catch(function (err) {
      // After async TTS, Safari almost always rejects autoplay (stale gesture).
      // Audio is ready — arm Play and never show a false "could not play" alert.
      setNarrationPlayingUi(false);
      armHeroPlaybackUi();
      if (fromUserGesture) {
        console.warn('[voice-magic] play() failed after user tap', err && err.name, err && err.message);
      } else {
        console.warn('[voice-magic] autoplay deferred — tap Play', err && err.name, err && err.message);
      }
    });
  }

  function toggleHeroPlayback() {
    if (!previewAudio) return;
    if (previewAudio.paused) playHeroPlayback({ fromUserGesture: true });
    else pauseHeroPlayback();
  }

  function dismissModalOnly() {
    if (modal.open && typeof modal.close === 'function') modal.close();
    else modal.removeAttribute('open');
    document.body.classList.remove('voice-magic-open');
  }

  function launchHeroNarration() {
    var text = getLeadText();
    if (!text || !previewAudio) return;
    dismissModalOnly();
    modal.classList.remove('is-ready', 'is-playing', 'is-processing', 'is-recording');
    buildKaraoke(text);
    previewAudio.currentTime = 0;
    wordTimings = [];
    if (previewAudio.readyState >= 1 && isFinite(previewAudio.duration) && previewAudio.duration > 0) {
      buildWordTimings(previewAudio.duration);
    } else {
      previewAudio.addEventListener('loadedmetadata', function onMeta() {
        previewAudio.removeEventListener('loadedmetadata', onMeta);
        if (isFinite(previewAudio.duration) && previewAudio.duration > 0) {
          buildWordTimings(previewAudio.duration);
        }
      });
    }
    playHeroPlayback();
  }

  function hasUsedCloneDemo() {
    try {
      return localStorage.getItem(CLONE_USED_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function markCloneDemoUsed() {
    try {
      localStorage.setItem(CLONE_USED_KEY, '1');
    } catch (e) {}
  }

  function hasConsented() {
    return Boolean(consentCheck && consentCheck.checked);
  }

  function syncConsentUi() {
    if (!consentLabel || !consentCheck) return;
    var checked = consentCheck.checked;
    consentLabel.classList.toggle('is-checked', checked);
    var busy = phase === 'recording' || phase === 'processing';
    consentLabel.classList.toggle('is-disabled', busy);
    consentCheck.disabled = busy;
    if (phase === 'idle' || phase === 'ready' || phase === 'hero') {
      recordBtn.disabled = !checked;
    }
  }

  function resetConsent() {
    if (!consentCheck) return;
    consentCheck.checked = false;
    syncConsentUi();
  }

  function showLockedModal() {
    modal.classList.add('is-locked');
    if (flowEl) flowEl.hidden = true;
    if (lockedEl) lockedEl.hidden = false;
    if (recordBtn) recordBtn.disabled = true;
  }

  function showRecordModal() {
    modal.classList.remove('is-locked');
    if (flowEl) flowEl.hidden = false;
    if (lockedEl) lockedEl.hidden = true;
    resetConsent();
  }

  function openModal() {
    if (phase === 'processing') return;
    if (openBtn && openBtn.disabled && openBtn.classList.contains('is-waiting')) return;
    if (previewAudio && !previewAudio.paused) pauseHeroPlayback();
    if (typeof modal.showModal === 'function') modal.showModal();
    else modal.setAttribute('open', '');
    document.body.classList.add('voice-magic-open');
    if (phase === 'hero') {
      phase = 'idle';
    }
    if (hasUsedCloneDemo()) {
      showLockedModal();
      return;
    }
    showRecordModal();
    resetUi(false);
  }

  function closeModal() {
    dismissModalOnly();
    if (phase === 'recording') {
      abortCapture();
      resetUi(false);
      setMagicCta('default');
    }
    // phase === 'processing': keep background clone/TTS running
  }

  function abortCapture() {
    try {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
    } catch (e) {}
    stopMicTracks();
  }

  function resetUi(clearPreview) {
    phase = 'idle';
    startedAt = 0;
    modal.classList.remove('is-recording', 'is-processing', 'is-ready', 'is-playing');
    stopMicTracks();
    if (countdownEl) {
      countdownEl.hidden = true;
      countdownEl.textContent = '10';
    }
    if (progressFill) progressFill.style.strokeDashoffset = String(RING_C);
    setStatus('', false);
    setLabel(startText, 'index.magic.start');
    recordBtn.classList.remove('is-hear');
    syncConsentUi();
    if (clearPreview) {
      voiceId = null;
      stopSyncLoop();
      if (previewAudio) {
        previewAudio.pause();
        previewAudio = null;
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        previewUrl = null;
      }
      restoreLeadText();
      leadPlainText = '';
      if (narrationBar) narrationBar.hidden = true;
      document.body.classList.remove('hero-narrating');
    }
  }

  function beginRecording() {
    if (hasUsedCloneDemo()) {
      showLockedModal();
      return;
    }
    if (!hasConsented()) {
      syncConsentUi();
      setStatus('Please confirm the consent checkbox before recording.', true);
      return;
    }
    if (phase !== 'idle' && phase !== 'ready' && phase !== 'hero') return;
    if (previewAudio) {
      previewAudio.pause();
      previewAudio.currentTime = 0;
    }
    stopSyncLoop();
    setNarrationPlayingUi(false);
    recordBtn.disabled = true;
    setStatus('', false);
    startMicAndRecorder().then(function () {
      phase = 'recording';
      startedAt = Date.now();
      recordBtn.disabled = false;
      syncConsentUi();
      modal.classList.add('is-recording');
      modal.classList.remove('is-ready', 'is-processing', 'is-playing');
      recordBtn.classList.remove('is-hear');
      if (countdownEl) {
        countdownEl.hidden = false;
        countdownEl.textContent = '10';
      }
      setLabel(stopText, 'index.magic.stop');
      updateCountdown();
    }).catch(function (err) {
      phase = 'idle';
      syncConsentUi();
      alert(err && err.message ? err.message : 'Microphone access is needed. Please allow the mic and try again.');
    });
  }

  function failProcessing(err) {
    console.error('[voice-magic]', err);
    setMagicCta('default');
    phase = 'idle';
    alert(err && err.message ? err.message : 'Something went wrong. Please try again.');
    resetUi(false);
  }

  function finishWithAudio(ttsRes, taleText) {
    if (!ttsRes || !ttsRes.audioBase64) throw new Error('Could not generate the tale in your voice. Please try again.');
    var bytes = atob(ttsRes.audioBase64);
    var arr = new Uint8Array(bytes.length);
    for (var i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    var mime = ttsRes.mimeType || 'audio/wav';
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = URL.createObjectURL(new Blob([arr], { type: mime }));
    previewAudio = new Audio(previewUrl);
    previewAudio.addEventListener('ended', function () {
      stopSyncLoop();
      setNarrationPlayingUi(false);
      highlightWord(wordSpans.length);
      if (narrationProgress) narrationProgress.style.width = '100%';
      phase = 'hero';
      setMagicCta('default');
    });
    setMagicCta('default');
    launchHeroNarration();
  }

  function sleep(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  function isTransientTtsError(err) {
    if (!err) return false;
    if (err.name === 'AbortError') return true;
    var status = Number(err.status) || 0;
    if (status === 502 || status === 503 || status === 504 || status === 429) return true;
    var code = String(err.code || '');
    if (
      code === 'GATEWAY_TIMEOUT' ||
      code === 'IDLE_TIMEOUT' ||
      code === 'RATE_LIMITED' ||
      code === 'TTS_FAILED' ||
      code === 'BOSON_DNS_UNAVAILABLE'
    ) {
      return true;
    }
    var msg = String(err.message || '').toLowerCase();
    return /timed out|timeout|failed to generate|rate.?limit|bad gateway|temporarily unavailable/i.test(msg);
  }

  function appHiggsSampling() {
    var h = higgsCfg();
    var temperature = Number(h.temperature);
    var topK = Number(h.topK);
    var topP = Number(h.topP);
    var maxNewTokens = Number(h.maxNewTokens);
    // Fallbacks must match src/constants/higgsNarration.ts (not older lab presets).
    if (!Number.isFinite(temperature)) temperature = 0.9;
    if (!Number.isFinite(topK)) topK = 0;
    if (!Number.isFinite(topP)) topP = 0.95;
    if (!Number.isFinite(maxNewTokens)) maxNewTokens = 2047;
    return {
      modelId: h.modelId || 'higgs-tts-3',
      responseFormat: h.responseFormat || 'pcm',
      temperature: temperature,
      maxNewTokens: maxNewTokens,
      topK: topK,
      topP: topP,
      speakingRate: Number.isFinite(Number(h.speakingRate)) ? Number(h.speakingRate) : 1.0,
      sampleRate: Number(h.sampleRate) || 24000,
      interChunkMs: Number(h.interChunkMs) || 1200,
      interChunkRateLimitMs: Number(h.interChunkRateLimitMs) || 5000
    };
  }

  function decodeTtsAudioBytes(audioBase64, responseFormat) {
    var raw = atob(audioBase64);
    var bytes = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
    var fmt = String(responseFormat || 'pcm').toLowerCase();
    if (fmt === 'pcm') {
      return { pcm: bytesToPcm16Le(bytes), mimeType: 'audio/wav' };
    }
    // mp3/wav passthrough — uncommon for app parity; keep for emergency overrides.
    return { bytes: bytes, mimeType: fmt === 'wav' ? 'audio/wav' : 'audio/mpeg' };
  }

  function runHiggsPipeline(blob, durationMs, transcript, taleText) {
    // Match app: cloneVoice → prepareHiggsCloneReferenceWav → POST /clone → sequential /tts (voiceId + pcm)
    return prepareHiggsCloneWav(blob).then(function (prepared) {
      var cloneSession = null;
      var audioBase64 = uint8ToBase64(prepared.wavBytes);
      var sampling = appHiggsSampling();
      var narrationChunks = computeNarrationChunks(taleText);
      if (!narrationChunks.length) throw new Error('Missing landing story text.');

      function runClone(session) {
        cloneSession = session;
        return postHiggs('/clone', {
          voiceName: 'Marketing demo',
          description: 'Parent voice for Nanik app',
          mimeType: prepared.mimeType,
          filename: prepared.filename,
          audioBase64: audioBase64,
          transcription: transcript,
          durationMs: Math.max(durationMs, prepared.durationMs),
          languageCode: pageLanguageCode(),
          removeBackgroundNoise: false
        }, session.accessToken, 45000);
      }

      function ttsPayloadForChunk(chunkText, clonedVoiceId, useInlineRef) {
        var preparedText = prepareHiggsChunkText(chunkText);
        var payload = {
          text: preparedText,
          modelId: sampling.modelId,
          responseFormat: sampling.responseFormat,
          temperature: sampling.temperature,
          maxNewTokens: sampling.maxNewTokens,
          topK: sampling.topK,
          topP: sampling.topP,
          languageCode: pageLanguageCode(),
          speakingRate: sampling.speakingRate
        };
        if (useInlineRef) {
          payload.refAudio = 'data:audio/wav;base64,' + audioBase64;
          payload.refText = transcript;
        } else {
          payload.voiceId = clonedVoiceId;
        }
        return payload;
      }

      function postTtsOnce(accessToken, chunkText, clonedVoiceId, useInlineRef) {
        return postHiggs('/tts', ttsPayloadForChunk(chunkText, clonedVoiceId, useInlineRef), accessToken, 150000);
      }

      function synthesizeChunk(accessToken, chunkText, clonedVoiceId) {
        var attempts = 0;
        var rateLimitedRecently = false;
        function attempt(useInlineRef) {
          attempts += 1;
          return postTtsOnce(accessToken, chunkText, clonedVoiceId, useInlineRef).catch(function (err) {
            if (!useInlineRef && attempts === 1 && isTransientTtsError(err)) {
              // App path is voiceId; only fall back to inline ref once if the clone voice fails.
              return sleep(600).then(function () { return attempt(true); });
            }
            if (isTransientTtsError(err) && attempts < 4) {
              if (Number(err.status) === 429 || /rate.?limit/i.test(String(err.message || ''))) {
                rateLimitedRecently = true;
              }
              var wait = rateLimitedRecently
                ? sampling.interChunkRateLimitMs * Math.min(attempts, 2)
                : 1200 * attempts;
              return sleep(wait).then(function () { return attempt(false); });
            }
            var friendly = new Error('Could not generate the tale in your voice. Please try again.');
            friendly.cause = err;
            friendly.code = err && err.code;
            friendly.status = err && err.status;
            throw friendly;
          });
        }
        return attempt(false).then(function (res) {
          return { res: res, rateLimitedRecently: rateLimitedRecently };
        });
      }

      function runNarration(accessToken, clonedVoiceId) {
        var pcmParts = [];
        var passthroughParts = [];
        var mimeType = 'audio/wav';
        var rateLimitedRecently = false;
        var index = 0;

        function next() {
          if (index >= narrationChunks.length) {
            if (passthroughParts.length) {
              // Non-pcm override path
              var total = 0;
              for (var i = 0; i < passthroughParts.length; i++) total += passthroughParts[i].length;
              var merged = new Uint8Array(total);
              var offset = 0;
              for (var j = 0; j < passthroughParts.length; j++) {
                merged.set(passthroughParts[j], offset);
                offset += passthroughParts[j].length;
              }
              return {
                audioBase64: uint8ToBase64(merged),
                mimeType: mimeType
              };
            }
            var wavBytes = wrapPcm16InWav(concatPcm16(pcmParts), sampling.sampleRate);
            return {
              audioBase64: uint8ToBase64(wavBytes),
              mimeType: 'audio/wav'
            };
          }

          var chunkText = narrationChunks[index];
          return synthesizeChunk(accessToken, chunkText, clonedVoiceId).then(function (result) {
            rateLimitedRecently = rateLimitedRecently || result.rateLimitedRecently;
            var decoded = decodeTtsAudioBytes(result.res.audioBase64, sampling.responseFormat);
            if (decoded.pcm) {
              pcmParts.push(decoded.pcm);
              mimeType = 'audio/wav';
            } else {
              passthroughParts.push(decoded.bytes);
              mimeType = decoded.mimeType;
            }
            index += 1;
            if (index >= narrationChunks.length) return next();
            var delay = rateLimitedRecently ? sampling.interChunkRateLimitMs : sampling.interChunkMs;
            rateLimitedRecently = false;
            return sleep(delay).then(next);
          });
        }

        return Promise.resolve().then(next);
      }

      // Fresh guest each demo run — same anonymous signup as the app, avoids freemium voice-slot lock.
      return ensureAuthFresh().then(function (session) {
        return runClone(session).catch(function (err) {
          if (err && (err.code === 'VOICE_LIMIT_REACHED' || err.status === 402 || err.code === 'UNAUTHORIZED' || err.status === 401)) {
            return ensureAuthFresh().then(runClone);
          }
          throw err;
        });
      }).then(function (cloneRes) {
        if (!cloneRes || !cloneRes.voiceId) throw new Error('Clone failed.');
        voiceId = cloneRes.voiceId;
        var accessToken = (cloneSession && cloneSession.accessToken) || (loadSession() || {}).accessToken;
        if (!accessToken) {
          return ensureAuth().then(function (session) {
            return runNarration(session.accessToken, voiceId);
          });
        }
        return runNarration(accessToken, voiceId);
      }).then(function (ttsRes) {
        finishWithAudio(ttsRes, taleText);
        // Only lock the demo after the tale actually plays — a TTS failure must allow retry.
        markCloneDemoUsed();
      });
    });
  }

  function stopRecordingAndClone() {
    if (hasUsedCloneDemo()) {
      abortCapture();
      resetUi(false);
      setMagicCta('default');
      if (typeof modal.showModal === 'function') modal.showModal();
      else modal.setAttribute('open', '');
      document.body.classList.add('voice-magic-open');
      showLockedModal();
      return;
    }
    if (phase !== 'recording') return;
    var durationMs = Date.now() - startedAt;
    phase = 'processing';
    modal.classList.remove('is-recording');
    modal.classList.add('is-processing');
    recordBtn.disabled = true;
    syncConsentUi();
    if (countdownEl) countdownEl.hidden = true;

    stopRecorder().then(function (blob) {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      if (stream) {
        stream.getTracks().forEach(function (track) { track.stop(); });
        stream = null;
      }
      if (audioCtx) {
        audioCtx.close().catch(function () {});
        audioCtx = null;
      }
      analyser = null;
      dataArray = null;
      setOrbLevel(0);

      // Close popup immediately; show waiting state on hero CTA (app-like background clone).
      dismissModalOnly();
      modal.classList.remove('is-processing', 'is-recording', 'is-ready', 'is-playing');
      setMagicCta('wait');

      if (!blob || blob.size < 1000) {
        throw new Error('Recording failed. Please try again.');
      }
      if (durationMs < MIN_MS) {
        throw new Error('Keep reading for at least 5 seconds.');
      }

      var transcript = (sampleEl && sampleEl.textContent || '').trim()
        .replace(/<\|[^|]+:[^|]+\|>/g, '')
        .slice(0, 1000);
      if (!transcript) throw new Error('Missing sample text.');

      if (leadEl && leadWrap && !leadWrap.classList.contains('is-karaoke')) {
        leadPlainText = (leadEl.textContent || '').trim();
      }
      var taleText = leadPlainText || getLeadText();
      if (!taleText) throw new Error('Missing landing story text.');

      // Let the browser paint "Wait for a sec." before heavy WAV work / upload.
      return new Promise(function (resolve) {
        setTimeout(resolve, 40);
      }).then(function () {
        return runHiggsPipeline(blob, durationMs, transcript, taleText);
      });
    }).catch(failProcessing);
  }

  function onRecordClick() {
    if (phase === 'idle') {
      beginRecording();
      return;
    }
    if (phase === 'recording') {
      stopRecordingAndClone();
    }
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest && e.target.closest('#open-voice-magic, [data-open-voice-magic]');
    if (!trigger) return;
    e.preventDefault();
    openModal();
  });

  modal.querySelectorAll('[data-voice-magic-close]').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });

  modal.addEventListener('cancel', function (e) {
    e.preventDefault();
    closeModal();
  });

  recordBtn.addEventListener('click', onRecordClick);

  if (consentCheck) {
    consentCheck.addEventListener('change', function () {
      syncConsentUi();
      if (hasConsented()) setStatus('', false);
    });
    syncConsentUi();
  }

  if (narrationToggle) {
    narrationToggle.addEventListener('click', function () {
      toggleHeroPlayback();
    });
  }

  if (narrationBar) {
    narrationBar.addEventListener('click', function (e) {
      if (!previewAudio) return;
      var track = narrationBar.querySelector('.hero-narration-track');
      if (!track) return;
      if (e.target === narrationToggle || (narrationToggle && narrationToggle.contains(e.target))) return;
      if (e.target !== track && !track.contains(e.target)) return;
      var rect = track.getBoundingClientRect();
      if (!(rect.width > 0) || !(previewAudio.duration > 0)) return;
      var ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      previewAudio.currentTime = ratio * previewAudio.duration;
      stopSyncLoop();
      syncKaraoke();
      if (!previewAudio.paused) syncRaf = requestAnimationFrame(syncKaraoke);
    });
  }
})();
