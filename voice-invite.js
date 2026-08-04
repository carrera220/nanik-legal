/**
 * Voice-clone invite landing: record UI matches the Nanik app (purple screen,
 * tip + sample glow + Start/Stop). Clone is attributed via inviteToken.
 */
(function () {
  var MAX_MS = (window.NANIK_API && window.NANIK_API.maxRecordMs) || 10000;
  var MIN_MS = (window.NANIK_API && window.NANIK_API.minRecordMs) || 5000;
  var SESSION_KEY = 'nanik-invite-supabase-session';
  var CONSENT_VERSION = 'voice_invite_v1';
  var TRIM_THRESHOLD = 420;
  var TRIM_EDGE_PAD_MS = 18;
  var TRIM_MIN_KEEP_MS = 80;
  var TAIL_TRIM_MS = 90;
  var EDGE_FADE_MS = 10;

  var SAMPLES = {
    hy: {
      code: 'hye',
      label: 'Armenian',
      sample:
        'Այնքան լավ եղանակ է այսօր՝ արևոտ ու ջինջ...Չգիտեմ նույնիսկ՝ տանը մնամ, թե՞ դուրս գամ մի քիչ քայլելու։ Դու ի՞նչ կասես։\n- Իհարկե կմիանամ, - ասաց փոքրիկը։\n- Դե, գնացինք։'
    },
    en: {
      code: 'eng',
      label: 'English',
      sample:
        "Everyone thought the little dragon was fast asleep in his bed... but look up there! He's flying right over the moon! Can you see him waving?"
    },
    ru: {
      code: 'rus',
      label: 'Russian',
      sample:
        'Все думали, что маленький дракон крепко спит в своей кроватке… а посмотрите наверх! Он летит прямо над луной! Видишь, как он машет?'
    }
  };

  var params = new URLSearchParams(window.location.search);
  var inviteToken = (params.get('t') || '').trim();

  var loading = document.getElementById('invite-loading');
  var errorEl = document.getElementById('invite-error');
  var errorBody = document.getElementById('invite-error-body');
  var shell = document.getElementById('invite-shell');
  var uiRoot = document.getElementById('voice-invite-ui');
  var stepRecord = document.getElementById('invite-step-record');
  var stepSave = document.getElementById('invite-step-save');
  var requesterLine = document.getElementById('invite-requester-line');
  var consentText = document.getElementById('voice-invite-consent-text');
  var consentLabel = document.getElementById('voice-invite-consent');
  var consentCheck = document.getElementById('voice-invite-consent-check');
  var recordBtn = document.getElementById('voice-invite-record');
  var saveBtn = document.getElementById('voice-invite-save');
  var backBtn = document.getElementById('voice-invite-back');
  var nameInput = document.getElementById('voice-invite-name');
  var langSelect = document.getElementById('voice-invite-lang');
  var sampleEl = document.getElementById('voice-invite-sample');
  var statusEl = document.getElementById('voice-invite-status');
  var saveStatusEl = document.getElementById('voice-invite-save-status');
  var successEl = document.getElementById('invite-success');
  var successBody = document.getElementById('invite-success-body');
  var labelEl = document.getElementById('voice-invite-record-label');
  var tipEl = document.getElementById('voice-invite-tip');
  var presetButtons = document.querySelectorAll('.invite-preset');

  if (!recordBtn || !saveBtn || !inviteToken) {
    if (!inviteToken && errorEl) {
      if (loading) loading.hidden = true;
      errorEl.hidden = false;
      if (errorBody) errorBody.textContent = 'This invite link is missing a token. Ask them to send a new link.';
    }
    return;
  }

  var phase = 'idle'; // idle | recording | save | processing
  var startedAt = 0;
  var requesterName = 'Someone';
  var speakLang = '';
  var stream = null;
  var audioCtx = null;
  var analyser = null;
  var dataArray = null;
  var rafId = 0;
  var smoothLevel = 0;
  var mediaRecorder = null;
  var chunks = [];
  var recordedMime = 'audio/webm';
  var pendingBlob = null;
  var pendingDurationMs = 0;
  var pendingPrepared = null;

  function api() {
    return window.NANIK_API || null;
  }

  function higgsCfg() {
    var cfg = api();
    return (cfg && cfg.higgs) || {};
  }

  function pickRecorderMime() {
    if (!window.MediaRecorder) return '';
    var candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];
    for (var i = 0; i < candidates.length; i++) {
      if (MediaRecorder.isTypeSupported(candidates[i])) return candidates[i];
    }
    return '';
  }

  function floatToPcm16(floats) {
    var out = new Int16Array(floats.length);
    for (var i = 0; i < floats.length; i++) {
      var s = Math.max(-1, Math.min(1, floats[i]));
      out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return out;
  }

  function mixToMono(buffer) {
    if (buffer.numberOfChannels === 1) return buffer.getChannelData(0).slice(0);
    var left = buffer.getChannelData(0);
    var right = buffer.getChannelData(1);
    var out = new Float32Array(left.length);
    for (var i = 0; i < left.length; i++) out[i] = (left[i] + right[i]) * 0.5;
    return out;
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

  function peakAbs(pcm) {
    var peak = 0;
    for (var i = 0; i < pcm.length; i++) {
      var a = Math.abs(pcm[i]);
      if (a > peak) peak = a;
    }
    return peak;
  }

  function trimPcm16Silence(pcm) {
    if (!pcm.length) return pcm;
    var start = 0;
    while (start < pcm.length && Math.abs(pcm[start]) < TRIM_THRESHOLD) start++;
    var end = pcm.length - 1;
    while (end > start && Math.abs(pcm[end]) < TRIM_THRESHOLD) end--;
    var pad = Math.round((TRIM_EDGE_PAD_MS / 1000) * 24000);
    start = Math.max(0, start - pad);
    end = Math.min(pcm.length - 1, end + pad);
    if (end - start < (TRIM_MIN_KEEP_MS / 1000) * 24000) return pcm;
    return pcm.subarray(start, end + 1);
  }

  function trimPcm16TailMs(pcm, rate, ms) {
    var cut = Math.round((ms / 1000) * rate);
    if (cut <= 0 || pcm.length <= cut) return pcm;
    return pcm.subarray(0, pcm.length - cut);
  }

  function applyEdgeFade(pcm, rate) {
    var n = Math.round((EDGE_FADE_MS / 1000) * rate);
    if (n <= 0 || pcm.length < n * 2) return pcm;
    var out = new Int16Array(pcm.length);
    out.set(pcm);
    for (var i = 0; i < n; i++) {
      var g = i / n;
      out[i] = Math.round(out[i] * g);
      out[out.length - 1 - i] = Math.round(out[out.length - 1 - i] * g);
    }
    return out;
  }

  function capPcmSamples(pcm, rate, maxSec) {
    var max = Math.round(maxSec * rate);
    return pcm.length > max ? pcm.subarray(0, max) : pcm;
  }

  function appendSilence(pcm, rate, ms) {
    var n = Math.round((ms / 1000) * rate);
    if (n <= 0) return pcm;
    var out = new Int16Array(pcm.length + n);
    out.set(pcm);
    return out;
  }

  function wrapPcm16InWav(pcm, sampleRate) {
    var dataSize = pcm.length * 2;
    var buffer = new ArrayBuffer(44 + dataSize);
    var view = new DataView(buffer);
    function writeStr(offset, str) {
      for (var i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    }
    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, 'data');
    view.setUint32(40, dataSize, true);
    var offset = 44;
    for (var i = 0; i < pcm.length; i++, offset += 2) view.setInt16(offset, pcm[i], true);
    return new Uint8Array(buffer);
  }

  function uint8ToBase64(bytes) {
    var chunk = 0x8000;
    var parts = [];
    for (var i = 0; i < bytes.length; i += chunk) {
      parts.push(String.fromCharCode.apply(null, bytes.subarray(i, i + chunk)));
    }
    return btoa(parts.join(''));
  }

  function prepareHiggsCloneWav(blob) {
    var h = higgsCfg();
    var targetRate = h.sampleRate || 24000;
    var speechMaxSec = h.cloneTargetSec || 9;
    var tailSilenceMs = h.cloneTailSilenceMs || 500;
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return Promise.reject(new Error('Audio conversion is not supported in this browser.'));
    var decodeCtx = new Ctx();
    return blob
      .arrayBuffer()
      .then(function (arrayBuffer) {
        return decodeCtx.decodeAudioData(arrayBuffer.slice(0));
      })
      .then(function (decoded) {
        return decodeCtx.close().catch(function () {}).then(function () {
          var mono = mixToMono(decoded);
          var floats = resampleLinear(mono, decoded.sampleRate, targetRate);
          var pcm = floatToPcm16(floats);
          pcm = trimPcm16Silence(pcm);
          pcm = trimPcm16TailMs(pcm, targetRate, TAIL_TRIM_MS);
          pcm = applyEdgeFade(pcm, targetRate);
          pcm = capPcmSamples(pcm, targetRate, speechMaxSec);
          if (peakAbs(pcm) < 500) {
            var silent = new Error('We could not hear a voice in this recording. Please try again.');
            silent.code = 'VOICE_SAMPLE_SILENT';
            throw silent;
          }
          pcm = appendSilence(pcm, targetRate, tailSilenceMs);
          return {
            wavBytes: wrapPcm16InWav(pcm, targetRate),
            mimeType: 'audio/wav',
            filename: 'reference_clean.wav',
            durationMs: Math.round((pcm.length / targetRate) * 1000)
          };
        });
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

  function isJwtExpired(token) {
    try {
      var part = String(token || '').split('.')[1] || '';
      var b64 = part.replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      var payload = JSON.parse(atob(b64));
      if (!payload || !payload.exp) return true;
      return payload.exp * 1000 < Date.now() + 30000;
    } catch (e) {
      return true;
    }
  }

  function signUpAnonymous() {
    var cfg = api();
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
        if (!res.ok) throw new Error(data.error_description || data.msg || data.error || 'Sign-in failed');
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

  function ensureAuth() {
    var cfg = api();
    if (!cfg || !cfg.supabaseUrl || !cfg.supabaseAnonKey) {
      return Promise.reject(new Error('API config missing'));
    }
    var existing = loadSession();
    if (existing && existing.accessToken && !isJwtExpired(existing.accessToken)) {
      return Promise.resolve(existing);
    }
    return signUpAnonymous();
  }

  function postHiggs(path, body, accessToken, timeoutMs) {
    var cfg = api();
    var ms = timeoutMs || 55000;
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
    })
      .then(function (res) {
        return res.text().then(function (raw) {
          var data = {};
          if (raw) {
            try {
              data = JSON.parse(raw);
            } catch (e) {
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
      })
      .then(
        function (data) {
          clearTimeout(timer);
          return data;
        },
        function (err) {
          clearTimeout(timer);
          if (err && err.name === 'AbortError') {
            throw new Error('Creating your voice took too long. Please try again.');
          }
          throw err;
        }
      );
  }

  function stopMicTracks() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    if (stream) {
      stream.getTracks().forEach(function (track) {
        track.stop();
      });
      stream = null;
    }
    if (audioCtx) {
      audioCtx.close().catch(function () {});
      audioCtx = null;
    }
    analyser = null;
    dataArray = null;
    smoothLevel = 0;
    setSampleLevel(0);
    mediaRecorder = null;
    chunks = [];
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
    setSampleLevel(smoothLevel);
    rafId = requestAnimationFrame(tick);
  }

  function startMicAndRecorder() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return Promise.reject(new Error('Microphone is not supported in this browser.'));
    }
    if (!window.MediaRecorder) {
      return Promise.reject(new Error('Recording is not supported in this browser.'));
    }
    return navigator.mediaDevices
      .getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        video: false
      })
      .then(function (mediaStream) {
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
        resolve(chunks.length ? new Blob(chunks, { type: recordedMime || 'audio/webm' }) : null);
      }, 2500);
      mediaRecorder.onstop = function () {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve(new Blob(chunks, { type: recordedMime || 'audio/webm' }));
      };
      try {
        mediaRecorder.requestData();
      } catch (e) {}
      try {
        mediaRecorder.stop();
      } catch (e) {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve(chunks.length ? new Blob(chunks, { type: recordedMime || 'audio/webm' }) : null);
        }
      }
    });
  }


  function setStatus(text, show) {
    if (!statusEl) return;
    statusEl.hidden = !show;
    statusEl.textContent = text || '';
  }

  function setSaveStatus(text, show) {
    if (!saveStatusEl) return;
    saveStatusEl.hidden = !show;
    saveStatusEl.textContent = text || '';
  }

  function setLabel(text) {
    if (labelEl) labelEl.textContent = text;
  }

  function setSampleLevel(level) {
    if (!uiRoot) return;
    var t = Math.max(0, Math.min(1, level * 1.35));
    uiRoot.style.setProperty('--voice-level', t.toFixed(3));
  }

  function showError(message) {
    if (loading) loading.hidden = true;
    if (shell) shell.hidden = true;
    if (successEl) successEl.hidden = true;
    if (errorEl) errorEl.hidden = false;
    if (message && errorBody) errorBody.textContent = message;
  }

  function showSuccess() {
    if (loading) loading.hidden = true;
    if (shell) shell.hidden = true;
    if (errorEl) errorEl.hidden = true;
    if (successEl) successEl.hidden = false;
    if (successBody) {
      successBody.textContent =
        'Your voice is now available for ' + requesterName + ' to use in Nanik for bedtime stories.';
    }
  }

  function hasConsented() {
    return Boolean(consentCheck && consentCheck.checked);
  }

  function hasLanguage() {
    return Boolean(speakLang && SAMPLES[speakLang]);
  }

  function trimmedName() {
    return nameInput ? String(nameInput.value || '').trim() : '';
  }

  function setStepVisible(el, visible) {
    if (!el) return;
    el.hidden = !visible;
    if (visible) el.classList.remove('invite-step-hidden');
    else el.classList.add('invite-step-hidden');
  }

  function showRecordStep() {
    setStepVisible(stepRecord, true);
    setStepVisible(stepSave, false);
    phase = 'idle';
    syncRecordUi();
  }

  function showSaveStep() {
    setStepVisible(stepRecord, false);
    setStepVisible(stepSave, true);
    phase = 'save';
    if (consentCheck) consentCheck.checked = false;
    syncSaveUi();
    if (nameInput) setTimeout(function () { nameInput.focus(); }, 50);
  }

  function syncRecordUi() {
    if (langSelect) langSelect.disabled = phase === 'recording';
    if (phase === 'idle') {
      recordBtn.disabled = !hasLanguage();
    }
  }

  function syncSaveUi() {
    if (consentLabel && consentCheck) {
      consentLabel.classList.toggle('is-checked', consentCheck.checked);
      var busy = phase === 'processing';
      consentLabel.classList.toggle('is-disabled', busy);
      consentCheck.disabled = busy;
    }
    if (nameInput) nameInput.disabled = phase === 'processing';
    if (saveBtn) {
      saveBtn.disabled = !(hasConsented() && trimmedName()) || phase === 'processing';
    }
    for (var i = 0; i < presetButtons.length; i++) {
      var btn = presetButtons[i];
      var preset = btn.getAttribute('data-preset') || '';
      btn.classList.toggle('is-active', trimmedName() === preset);
      btn.disabled = phase === 'processing';
    }
  }

  function applyLanguage(code) {
    speakLang = code || '';
    var entry = SAMPLES[speakLang];
    if (sampleEl) {
      if (entry) {
        sampleEl.textContent = entry.sample;
        sampleEl.classList.remove('is-placeholder');
        sampleEl.setAttribute('lang', speakLang);
      } else {
        sampleEl.textContent = 'Choose the language you will speak, then read the sample aloud.';
        sampleEl.classList.add('is-placeholder');
        sampleEl.removeAttribute('lang');
      }
    }
    if (tipEl) tipEl.hidden = !entry;
    syncRecordUi();
  }

  function resetUi() {
    phase = 'idle';
    startedAt = 0;
    pendingBlob = null;
    pendingDurationMs = 0;
    pendingPrepared = null;
    if (uiRoot) uiRoot.classList.remove('is-recording', 'is-processing');
    stopMicTracks();
    setSampleLevel(0);
    setStatus('', false);
    setSaveStatus('', false);
    setLabel('Start recording');
    showRecordStep();
  }

  function beginRecording() {
    if (!hasLanguage()) {
      setStatus('Choose the language you will speak.', true);
      return;
    }
    if (phase !== 'idle') return;
    recordBtn.disabled = true;
    setStatus('', false);
    startMicAndRecorder()
      .then(function () {
        phase = 'recording';
        startedAt = Date.now();
        recordBtn.disabled = false;
        if (uiRoot) {
          uiRoot.classList.add('is-recording');
          uiRoot.classList.remove('is-processing');
        }
        setLabel('Stop recording');
        syncRecordUi();
      })
      .catch(function (err) {
        phase = 'idle';
        syncRecordUi();
        alert(err && err.message ? err.message : 'Microphone access is needed. Please allow the mic and try again.');
      });
  }

  function finishRecordingToSave() {
    if (phase !== 'recording') return;
    var elapsed = Date.now() - startedAt;
    recordBtn.disabled = true;
    setLabel('Preparing…');
    setStatus('Preparing your recording…', true);

    stopRecorder()
      .then(function (blob) {
        stopMicTracks();
        if (uiRoot) uiRoot.classList.remove('is-recording');
        if (!blob || blob.size < 1000) throw new Error('Recording was too short. Please try again.');
        if (elapsed < MIN_MS) throw new Error('Please read a bit longer (at least 5 seconds).');
        pendingBlob = blob;
        // Cap reported duration for clone API; recording ends only when user taps Stop.
        pendingDurationMs = Math.min(elapsed, MAX_MS);
        return prepareHiggsCloneWav(blob).then(function (prepared) {
          pendingPrepared = prepared;
          setStatus('', false);
          setLabel('Start recording');
          showSaveStep();
        });
      })
      .catch(function (err) {
        console.error('[voice-invite]', err);
        alert(err && err.message ? err.message : 'Something went wrong. Please try again.');
        resetUi();
      });
  }

  function submitSharedVoice() {
    if (phase !== 'save') return;
    if (!hasConsented()) {
      setSaveStatus('Please confirm the consent checkbox.', true);
      return;
    }
    var voiceName = trimmedName();
    if (!voiceName) {
      setSaveStatus('Please enter a voice name.', true);
      return;
    }
    if (!pendingPrepared) {
      setSaveStatus('Recording missing. Please record again.', true);
      return;
    }

    phase = 'processing';
    syncSaveUi();
    setSaveStatus('Creating your voice clone…', true);
    if (uiRoot) uiRoot.classList.add('is-processing');

    var entry = SAMPLES[speakLang];
    var transcript = entry ? entry.sample : '';
    var languageCode = entry ? entry.code : 'eng';

    ensureAuth()
      .then(function (session) {
        return postHiggs(
          '/clone',
          {
            voiceName: voiceName,
            description: 'Shared voice for Nanik app',
            mimeType: pendingPrepared.mimeType,
            filename: pendingPrepared.filename,
            audioBase64: uint8ToBase64(pendingPrepared.wavBytes),
            transcription: transcript,
            durationMs: Math.max(pendingDurationMs, pendingPrepared.durationMs),
            languageCode: languageCode,
            removeBackgroundNoise: false,
            inviteToken: inviteToken,
            consentTextVersion: CONSENT_VERSION
          },
          session.accessToken,
          45000
        );
      })
      .then(function (res) {
        if (!res || !res.voiceId) throw new Error('Clone failed.');
        showSuccess();
      })
      .catch(function (err) {
        console.error('[voice-invite]', err);
        var msg = (err && err.message) || 'Something went wrong. Please try again.';
        if (err && err.code === 'INVITE_ALREADY_CLAIMED') msg = 'This invite was already used.';
        else if (err && err.code === 'INVITE_EXPIRED') msg = 'This invite has expired. Ask them to send a new link.';
        else if (err && err.code === 'VOICE_LIMIT_REACHED') msg = 'They already have the maximum number of voices on their plan.';
        else if (err && err.code === 'INVITE_SELF_CLAIM') msg = 'Open this link on someone else’s device to record for them.';
        alert(msg);
        phase = 'save';
        if (uiRoot) uiRoot.classList.remove('is-processing');
        setSaveStatus('', false);
        syncSaveUi();
      });
  }

  recordBtn.addEventListener('click', function (e) {
    e.preventDefault();
    if (phase === 'recording') finishRecordingToSave();
    else beginRecording();
  });

  saveBtn.addEventListener('click', function (e) {
    e.preventDefault();
    submitSharedVoice();
  });

  if (backBtn) {
    backBtn.addEventListener('click', function () {
      if (phase === 'processing') return;
      resetUi();
    });
  }

  if (consentCheck) consentCheck.addEventListener('change', syncSaveUi);
  if (nameInput) nameInput.addEventListener('input', syncSaveUi);

  for (var p = 0; p < presetButtons.length; p++) {
    presetButtons[p].addEventListener('click', function (ev) {
      var preset = ev.currentTarget.getAttribute('data-preset') || '';
      if (nameInput) nameInput.value = preset;
      syncSaveUi();
    });
  }

  if (langSelect) {
    langSelect.addEventListener('change', function () {
      applyLanguage(langSelect.value);
    });
  }

  // Load invite metadata
  var cfg = api();
  var inviteApi = (cfg && cfg.supabaseUrl)
    ? cfg.supabaseUrl.replace(/\/+$/, '') + '/functions/v1/voice-clone-invite'
    : 'https://zljowsxavbpqfdskekwd.supabase.co/functions/v1/voice-clone-invite';
  var anon = (cfg && cfg.supabaseAnonKey) || '';

  fetch(inviteApi + '?t=' + encodeURIComponent(inviteToken) + '&format=json', {
    headers: {
      Accept: 'application/json',
      apikey: anon,
      Authorization: 'Bearer ' + anon
    }
  })
    .then(function (res) {
      return res.json().then(function (body) {
        return { ok: res.ok, body: body };
      });
    })
    .then(function (result) {
      if (!result.ok || !result.body || !result.body.open) {
        showError((result.body && result.body.error) || 'This invite is no longer available. Ask them to send a new link.');
        return;
      }
      requesterName = (result.body.requesterDisplayName || 'Someone').trim() || 'Someone';
      if (requesterLine) requesterLine.textContent = requesterName + ' invited you to record your voice';
      if (consentText) {
        consentText.textContent =
          'I confirm this is my voice, and I allow ' +
          requesterName +
          ' to use this voice clone in Nanik to narrate bedtime stories. I also allow Nanik to send this recording to third-party voice cloning services.';
      }
      document.title = requesterName + ' invited you — Nanik';
      var deep = 'teler://voice-invite/' + encodeURIComponent(inviteToken);
      var meta = document.querySelector('meta[name="apple-itunes-app"]');
      if (meta) meta.setAttribute('content', 'app-id=6762894314, app-argument=' + deep);

      if (loading) loading.hidden = true;
      if (shell) shell.hidden = false;
      applyLanguage(langSelect ? langSelect.value : '');
      showRecordStep();
    })
    .catch(function () {
      showError('Could not load this invite. Check your connection and try again.');
    });
})();
