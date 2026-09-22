/**
 * Dashboard "Add my voice" → Record your sample (app-parity language + sample text).
 */
(function () {
  var SAMPLE_CACHE_KEY = "nanik-dash-voice-sample-cache";
  var MIN_MS = 5000;
  var RECORDER_TIMESLICE_MS = 250;
  var COUNTDOWN_STEP_MS = 900;
  var TRIM_THRESHOLD = 420;
  var TRIM_EDGE_PAD_MS = 18;
  var TRIM_MIN_KEEP_MS = 80;
  var TAIL_TRIM_MS = 90;
  var EDGE_FADE_MS = 10;
  var Langs = null;

  var modalEl = null;
  var phase = "idle"; // idle | countdown | recording | ready | processing
  var speakLang = "";
  var activeSampleText = "";
  var sampleLoadToken = 0;
  var countdownToken = 0;
  var stream = null;
  var mediaRecorder = null;
  var chunks = [];
  var recordedMime = "audio/webm";
  var startedAt = 0;
  var stopRequested = false;
  var pendingBlob = null;
  var pendingDurationMs = 0;
  var pendingPrepared = null;
  var audioCtx = null;
  var analyser = null;
  var dataArray = null;
  var rafId = 0;
  var smoothLevel = 0;

  function api() {
    return window.NANIK_API || {};
  }

  function session() {
    try {
      var raw = localStorage.getItem("nanik-web-auth-session");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function langs() {
    return window.NANIK_VOICE_LANGS || Langs;
  }

  function englishSample() {
    var L = langs();
    return (L && L.ENGLISH_SAMPLE) ||
      "Everyone thought the little dragon was fast asleep in his bed...\nBut look up there!\nHe's flying right over the moon!\nCan you see him waving?";
  }

  function curatedSample(code) {
    var L = langs();
    if (L && typeof L.curatedSample === "function") return L.curatedSample(code);
    return null;
  }

  function langApiCode(code) {
    var L = langs();
    if (L && typeof L.apiCode === "function") return L.apiCode(code);
    if (code === "hy") return "hye";
    if (code === "en") return "eng";
    if (code === "ru") return "rus";
    return code || "eng";
  }

  function loadSampleCache() {
    try {
      var raw = sessionStorage.getItem(SAMPLE_CACHE_KEY);
      var parsed = raw ? JSON.parse(raw) : null;
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function saveSampleCache(map) {
    try {
      sessionStorage.setItem(SAMPLE_CACHE_KEY, JSON.stringify(map));
    } catch (e) {}
  }

  function translateSample(lang) {
    var cfg = api();
    var proxy = cfg.claudeProxy;
    if (!proxy || !lang) return Promise.resolve(englishSample());
    var cache = loadSampleCache();
    if (cache[lang.code]) return Promise.resolve(cache[lang.code]);
    var s = session();
    if (!s || !s.access_token) return Promise.resolve(englishSample());
    return fetch(String(proxy).replace(/\/+$/, "") + "/translate-voice-sample", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: cfg.supabaseAnonKey,
        Authorization: "Bearer " + s.access_token,
      },
      body: JSON.stringify({
        text: englishSample(),
        targetLanguageCode: lang.code,
        targetLanguageName: lang.name,
      }),
    })
      .then(function (res) {
        return res.json().then(function (body) {
          if (!res.ok) throw new Error((body && body.error) || "translate failed");
          return String((body && (body.text || body.translatedText)) || "").trim();
        });
      })
      .then(function (text) {
        if (!text) return englishSample();
        cache[lang.code] = text;
        saveSampleCache(cache);
        return text;
      })
      .catch(function () {
        return englishSample();
      });
  }

  function $(sel) {
    return modalEl ? modalEl.querySelector(sel) : null;
  }

  function setStatus(msg, isError) {
    var el = $("[data-record-status]");
    if (!el) return;
    if (!msg) {
      el.hidden = true;
      el.textContent = "";
      el.classList.remove("is-error");
      return;
    }
    el.hidden = false;
    el.textContent = msg;
    el.classList.toggle("is-error", !!isError);
  }

  function setSampleLevel(level) {
    if (!modalEl) return;
    modalEl.style.setProperty("--voice-level", String(Math.max(0, Math.min(1, level || 0))));
  }

  function stopLevelMeter() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    smoothLevel = 0;
    setSampleLevel(0);
    if (audioCtx) {
      try {
        audioCtx.close();
      } catch (e) {}
      audioCtx = null;
    }
    analyser = null;
    dataArray = null;
  }

  function startLevelMeter(mediaStream) {
    stopLevelMeter();
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx || !mediaStream) return;
    try {
      audioCtx = new Ctx();
      var source = audioCtx.createMediaStreamSource(mediaStream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      dataArray = new Uint8Array(analyser.frequencyBinCount);
      function tick() {
        if (!analyser || !dataArray) return;
        analyser.getByteTimeDomainData(dataArray);
        var sum = 0;
        for (var i = 0; i < dataArray.length; i++) {
          var v = (dataArray[i] - 128) / 128;
          sum += v * v;
        }
        var rms = Math.sqrt(sum / dataArray.length);
        smoothLevel = smoothLevel * 0.82 + Math.min(1, rms * 3.2) * 0.18;
        setSampleLevel(smoothLevel);
        rafId = requestAnimationFrame(tick);
      }
      rafId = requestAnimationFrame(tick);
    } catch (e) {}
  }

  function stopMicTracks() {
    stopLevelMeter();
    if (stream) {
      stream.getTracks().forEach(function (t) {
        try {
          t.stop();
        } catch (e) {}
      });
      stream = null;
    }
  }

  function setDimmed(on) {
    if (!modalEl) return;
    modalEl.classList.toggle("is-dimmed", !!on);
  }

  function setCountdownDigit(n) {
    var el = $("[data-record-countdown]");
    if (!el) return;
    if (n == null) {
      el.hidden = true;
      el.classList.remove("is-on");
      el.textContent = "";
      if (modalEl) modalEl.classList.remove("is-countdown");
      return;
    }
    if (modalEl) modalEl.classList.add("is-countdown");
    el.hidden = false;
    el.textContent = String(n);
    el.classList.remove("is-on");
    // Force reflow so the scale spring restarts each digit.
    void el.offsetWidth;
    el.classList.add("is-on");
  }

  function sleep(ms) {
    return new Promise(function (resolve) {
      window.setTimeout(resolve, ms);
    });
  }

  function readSampleTitle(code) {
    if (code === "hy") return 'Սեղմեք "Ձայնագրել" կոճակը<br>և կարդացեք տեքստը';
    if (code === "ru") return "Нажмите «Записать» и прочитайте текст.";
    return 'Tap on "Record" and read the text.';
  }

  function syncRecordUi() {
    var btn = $("[data-record-btn]");
    var label = $("[data-record-label]");
    var title = $("[data-record-title]") || document.getElementById("dash-record-voice-title");
    var hero = $(".dash-record-hero");
    if (!btn || !label) return;
    var hasLang = !!speakLang && !!activeSampleText;
    var isRecording = phase === "recording";
    var isCountdown = phase === "countdown";
    var isDim = isRecording || isCountdown;
    btn.classList.toggle("is-recording", isCountdown || isRecording);
    btn.hidden = false;
    setDimmed(isDim);
    var tipEl = $("[data-record-tip]");
    if (tipEl) {
      // Stay mounted so the intro tint can fade it; only hide when no sample yet.
      tipEl.hidden = !(speakLang && activeSampleText);
    }
    if (title) title.innerHTML = readSampleTitle(webpageSpeakLang());
    if (hero) hero.classList.toggle("is-live", isRecording);
    if (isCountdown || isRecording) {
      // Keep Stop available for the whole faded countdown → recording stretch.
      btn.disabled = false;
      label.textContent = "Stop recording";
    } else if (phase === "ready") {
      btn.disabled = false;
      label.textContent = "Record";
    } else if (phase === "processing") {
      btn.disabled = true;
      label.textContent = "Preparing…";
    } else {
      btn.disabled = !hasLang;
      label.textContent = "Record";
    }
  }

  function applyLanguage(code) {
    speakLang = code || "";
    var L = langs();
    var lang = L && typeof L.byCode === "function" ? L.byCode(speakLang) : null;
    var token = ++sampleLoadToken;
    activeSampleText = "";
    var sampleEl = $("[data-record-sample]");
    var tipEl = $("[data-record-tip]");
    pendingBlob = null;
    pendingPrepared = null;
    pendingDurationMs = 0;
    phase = "idle";

    if (!speakLang || !lang) {
      if (sampleEl) {
        sampleEl.textContent = "Select a language to see the sample text";
        sampleEl.classList.add("is-placeholder");
        sampleEl.removeAttribute("lang");
      }
      if (tipEl) tipEl.hidden = true;
      syncRecordUi();
      return;
    }

    var local = curatedSample(speakLang);
    if (local) {
      activeSampleText = local;
      if (sampleEl) {
        sampleEl.textContent = local;
        sampleEl.classList.remove("is-placeholder");
        sampleEl.setAttribute("lang", speakLang);
      }
      if (tipEl) tipEl.hidden = false;
      syncRecordUi();
      return;
    }

    if (sampleEl) {
      sampleEl.textContent = "Loading sample in " + lang.name + "…";
      sampleEl.classList.add("is-placeholder");
      sampleEl.setAttribute("lang", speakLang);
    }
    if (tipEl) tipEl.hidden = false;
    syncRecordUi();
    translateSample(lang).then(function (text) {
      if (token !== sampleLoadToken || speakLang !== lang.code) return;
      activeSampleText = text || englishSample();
      if (sampleEl) {
        sampleEl.textContent = activeSampleText;
        sampleEl.classList.remove("is-placeholder");
        sampleEl.setAttribute("lang", speakLang);
      }
      syncRecordUi();
    });
  }

  function mixToMono(decoded) {
    var len = decoded.length;
    var out = new Float32Array(len);
    var ch = decoded.numberOfChannels;
    for (var c = 0; c < ch; c++) {
      var data = decoded.getChannelData(c);
      for (var i = 0; i < len; i++) out[i] += data[i] / ch;
    }
    return out;
  }

  function resampleLinear(input, fromRate, toRate) {
    if (fromRate === toRate) return input;
    var ratio = fromRate / toRate;
    var outLen = Math.max(1, Math.round(input.length / ratio));
    var out = new Float32Array(outLen);
    for (var i = 0; i < outLen; i++) {
      var src = i * ratio;
      var i0 = Math.floor(src);
      var i1 = Math.min(input.length - 1, i0 + 1);
      var t = src - i0;
      out[i] = input[i0] * (1 - t) + input[i1] * t;
    }
    return out;
  }

  function floatToPcm16(floats) {
    var pcm = new Int16Array(floats.length);
    for (var i = 0; i < floats.length; i++) {
      var s = Math.max(-1, Math.min(1, floats[i]));
      pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return pcm;
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
    var start = 0;
    var end = pcm.length - 1;
    while (start < end && Math.abs(pcm[start]) < TRIM_THRESHOLD) start++;
    while (end > start && Math.abs(pcm[end]) < TRIM_THRESHOLD) end--;
    var pad = Math.round((TRIM_EDGE_PAD_MS / 1000) * 24000);
    start = Math.max(0, start - pad);
    end = Math.min(pcm.length - 1, end + pad);
    if (end - start < Math.round((TRIM_MIN_KEEP_MS / 1000) * 24000)) return pcm;
    return pcm.subarray(start, end + 1);
  }

  function trimPcm16TailMs(pcm, sampleRate, ms) {
    var cut = Math.round((ms / 1000) * sampleRate);
    if (cut <= 0 || pcm.length <= cut) return pcm;
    return pcm.subarray(0, pcm.length - cut);
  }

  function applyEdgeFade(pcm, sampleRate) {
    var n = Math.round((EDGE_FADE_MS / 1000) * sampleRate);
    if (n <= 0 || pcm.length < n * 2) return pcm;
    var out = new Int16Array(pcm);
    for (var i = 0; i < n; i++) {
      var g = i / n;
      out[i] = Math.round(out[i] * g);
      out[out.length - 1 - i] = Math.round(out[out.length - 1 - i] * g);
    }
    return out;
  }

  function capPcmSamples(pcm, sampleRate, maxSec) {
    var max = Math.round(maxSec * sampleRate);
    if (pcm.length <= max) return pcm;
    return pcm.subarray(0, max);
  }

  function appendSilence(pcm, sampleRate, ms) {
    var n = Math.round((ms / 1000) * sampleRate);
    if (n <= 0) return pcm;
    var out = new Int16Array(pcm.length + n);
    out.set(pcm, 0);
    return out;
  }

  function wrapPcm16InWav(pcm, sampleRate) {
    var dataSize = pcm.length * 2;
    var buffer = new ArrayBuffer(44 + dataSize);
    var view = new DataView(buffer);
    function writeStr(offset, str) {
      for (var i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    }
    writeStr(0, "RIFF");
    view.setUint32(4, 36 + dataSize, true);
    writeStr(8, "WAVE");
    writeStr(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, "data");
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
    return btoa(parts.join(""));
  }

  function prepareHiggsCloneWav(blob) {
    var h = api().higgs || {};
    var targetRate = h.sampleRate || 24000;
    var speechMaxSec = h.cloneTargetSec || 9;
    var tailSilenceMs = h.cloneTailSilenceMs || 500;
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return Promise.reject(new Error("Audio conversion is not supported in this browser."));
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
            throw new Error("We could not hear a voice in this recording. Please try again.");
          }
          pcm = appendSilence(pcm, targetRate, tailSilenceMs);
          return {
            wavBytes: wrapPcm16InWav(pcm, targetRate),
            mimeType: "audio/wav",
            filename: "reference_clean.wav",
            durationMs: Math.round((pcm.length / targetRate) * 1000),
          };
        });
      });
  }

  function higgsProxyBase() {
    var cfg = api();
    var fromCfg = String(cfg.higgsProxy || "").replace(/\/$/, "");
    if (fromCfg) return fromCfg;
    var base = String(cfg.supabaseUrl || "").replace(/\/$/, "");
    return base ? base + "/functions/v1/higgs-proxy" : "";
  }

  function postClone(prepared, voiceName) {
    var s = session();
    var proxy = higgsProxyBase();
    if (!s || !s.access_token || !proxy) {
      return Promise.reject(new Error("Please sign in to save your voice."));
    }
    var name = String(voiceName || "").trim() || "My voice";
    return fetch(proxy + "/clone", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: api().supabaseAnonKey,
        Authorization: "Bearer " + s.access_token,
      },
      body: JSON.stringify({
        voiceName: name,
        description: "Parent voice for Nanik",
        mimeType: prepared.mimeType,
        filename: prepared.filename,
        audioBase64: uint8ToBase64(prepared.wavBytes),
        transcription: activeSampleText || curatedSample(speakLang) || englishSample(),
        durationMs: Math.max(pendingDurationMs, prepared.durationMs || 0),
        languageCode: langApiCode(speakLang),
        removeBackgroundNoise: false,
      }),
    }).then(function (res) {
      return res.json().then(function (body) {
        if (!res.ok) {
          var err = new Error((body && (body.error || body.message)) || "Clone failed");
          err.code = body && body.code;
          throw err;
        }
        return body;
      });
    });
  }

  function finishRecording(blob) {
    var durationMs = Date.now() - startedAt;
    if (!blob || blob.size < 200 || durationMs < MIN_MS) {
      setStatus("Please record a bit longer (at least 5 seconds).", true);
      phase = "idle";
      syncRecordUi();
      return;
    }
    pendingBlob = blob;
    pendingDurationMs = durationMs;
    setStatus("Preparing your sample…", false);
    phase = "processing";
    syncRecordUi();
    prepareHiggsCloneWav(blob)
      .then(function (prepared) {
        pendingPrepared = prepared;
        phase = "ready";
        setStatus("", false);
        showStep("save");
      })
      .catch(function (err) {
        setStatus((err && err.message) || "Could not process recording.", true);
        phase = "idle";
        syncRecordUi();
      });
  }

  function beginRecording() {
    if (!speakLang || !activeSampleText) {
      setStatus("Select a language to see the sample text", true);
      return;
    }
    if (phase !== "idle" && phase !== "ready") return;
    pendingBlob = null;
    pendingPrepared = null;
    stopRequested = false;
    setStatus("", false);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (mediaStream) {
        stream = mediaStream;
        var token = ++countdownToken;
        phase = "countdown";
        setCountdownDigit(3);
        syncRecordUi();
        return sleep(COUNTDOWN_STEP_MS)
          .then(function () {
            if (token !== countdownToken) return null;
            setCountdownDigit(2);
            return sleep(COUNTDOWN_STEP_MS);
          })
          .then(function () {
            if (token !== countdownToken) return null;
            setCountdownDigit(1);
            return sleep(COUNTDOWN_STEP_MS);
          })
          .then(function () {
            if (token !== countdownToken) return null;
            setCountdownDigit(null);
            chunks = [];
            var mime = "";
            if (window.MediaRecorder) {
              if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) mime = "audio/webm;codecs=opus";
              else if (MediaRecorder.isTypeSupported("audio/webm")) mime = "audio/webm";
              else if (MediaRecorder.isTypeSupported("audio/mp4")) mime = "audio/mp4";
            }
            recordedMime = mime || "audio/webm";
            mediaRecorder = mime
              ? new MediaRecorder(mediaStream, { mimeType: mime })
              : new MediaRecorder(mediaStream);
            mediaRecorder.ondataavailable = function (ev) {
              if (ev.data && ev.data.size) chunks.push(ev.data);
            };
            mediaRecorder.onstop = function () {
              stopMicTracks();
              if (modalEl) {
                modalEl.classList.remove("is-recording");
                setDimmed(false);
              }
              var blob = new Blob(chunks, { type: recordedMime });
              finishRecording(blob);
            };
            phase = "recording";
            startedAt = Date.now();
            if (modalEl) modalEl.classList.add("is-recording");
            startLevelMeter(mediaStream);
            mediaRecorder.start(RECORDER_TIMESLICE_MS);
            syncRecordUi();
          });
      })
      .catch(function () {
        setCountdownDigit(null);
        setDimmed(false);
        setStatus("Microphone permission is required to record.", true);
        phase = "idle";
        syncRecordUi();
      });
  }

  function stopRecording() {
    if (phase === "countdown") {
      countdownToken += 1;
      setCountdownDigit(null);
      stopMicTracks();
      setDimmed(false);
      phase = "idle";
      syncRecordUi();
      return;
    }
    if (phase !== "recording" || !mediaRecorder) return;
    stopRequested = true;
    try {
      if (mediaRecorder.state !== "inactive") mediaRecorder.stop();
    } catch (e) {
      stopMicTracks();
      setDimmed(false);
      if (modalEl) modalEl.classList.remove("is-recording");
      phase = "idle";
      syncRecordUi();
    }
  }

  function submitVoice() {
    if (phase !== "ready" || !pendingPrepared) return;
    var nameInput = $("[data-save-name]");
    var consent = $("[data-save-consent]");
    var name = nameInput ? String(nameInput.value || "").trim() : "";
    if (!name) {
      setSaveStatus("Please name your voice.", true);
      if (nameInput) nameInput.focus();
      return;
    }
    if (!consent || !consent.checked) {
      setSaveStatus("Please confirm you can use this recording.", true);
      return;
    }
    phase = "processing";
    syncSaveUi();
    setSaveStatus("Creating your voice clone…", false);
    postClone(pendingPrepared, name)
      .then(function () {
        setSaveStatus("Voice saved.", false);
        close();
        if (typeof window.__nanikRefreshVoices === "function") {
          window.__nanikRefreshVoices();
        }
      })
      .catch(function (err) {
        var msg = (err && err.message) || "Could not save this voice.";
        if (err && err.code === "VOICE_LIMIT_REACHED") {
          close();
          if (typeof window.__nanikAssertVoiceCloneSlot === "function") {
            // Re-run the gate so freemium opens the paywall; Plus sees the full-slots alert.
            window.__nanikAssertVoiceCloneSlot();
          } else if (typeof window.openWebPaywall === "function") {
            window.openWebPaywall({ title: "Unlock more voices" });
          } else {
            setSaveStatus(
              "You’ve reached your voice limit. Upgrade to Nanik Plus for more voices.",
              true
            );
            phase = "ready";
            syncSaveUi();
          }
          return;
        }
        setSaveStatus(msg, true);
        phase = "ready";
        syncSaveUi();
      });
  }

  function onRecordClick() {
    if (phase === "recording" || phase === "countdown") stopRecording();
    else if (phase === "ready") showStep("save");
    else if (phase !== "processing") beginRecording();
  }

  function setSaveStatus(msg, isError) {
    var el = $("[data-save-status]");
    if (!el) return;
    if (!msg) {
      el.hidden = true;
      el.textContent = "";
      el.classList.remove("is-error");
      return;
    }
    el.hidden = false;
    el.textContent = msg;
    el.classList.toggle("is-error", !!isError);
  }

  function saveCopy(code) {
    if (code === "hy") {
      return {
        title: "Անվանեք ձեր ձայնը",
        placeholder: "Օրինակ՝ Մայր, Հայր",
        consent: "Հաստատում եմ, որ ես եմ ձայնագրել այս ձայնը, կամ ունեմ իրավունք կամ թույլտվություն օգտագործելու այն։",
        save: "Պահել ձայնը",
        again: "Ձայնագրել նորից",
      };
    }
    if (code === "ru") {
      return {
        title: "Назовите свой голос",
        placeholder: "например, Мама, Папа",
        consent: "Я подтверждаю, что записал(а) этот голос, или что у меня есть право либо разрешение на его использование.",
        save: "Сохранить голос",
        again: "Записать снова",
      };
    }
    return {
      title: "Name your voice",
      placeholder: "e.g. Mother, Father",
      consent: "I confirm that I recorded this voice, or that I have the right or permission to use it.",
      save: "Save voice",
      again: "Record again",
    };
  }

  function paintSaveStep() {
    var copy = saveCopy(webpageSpeakLang());
    var title = $("[data-save-title]");
    var input = $("[data-save-name]");
    var consentText = $("[data-save-consent-text]");
    var saveBtn = $("[data-save-submit]");
    var again = $("[data-save-again]");
    var consent = $("[data-save-consent]");
    if (title) title.textContent = copy.title;
    if (input) {
      input.placeholder = copy.placeholder;
      if (!input.value) input.value = "";
    }
    if (consentText) consentText.textContent = copy.consent;
    if (saveBtn) saveBtn.textContent = copy.save;
    if (again) again.textContent = copy.again;
    if (consent) consent.checked = false;
    setSaveStatus("", false);
    syncSaveUi();
    window.setTimeout(function () {
      if (input) input.focus();
    }, 200);
  }

  function syncSaveUi() {
    var input = $("[data-save-name]");
    var consent = $("[data-save-consent]");
    var saveBtn = $("[data-save-submit]");
    var again = $("[data-save-again]");
    if (!saveBtn) return;
    var name = input ? String(input.value || "").trim() : "";
    var ok = !!pendingPrepared && !!name && consent && consent.checked && phase === "ready";
    saveBtn.disabled = !ok || phase === "processing";
    if (phase === "processing") saveBtn.textContent = "Saving…";
    else {
      var copy = saveCopy(webpageSpeakLang());
      saveBtn.textContent = copy.save;
    }
    if (again) again.disabled = phase === "processing";
  }

  function ensureModal() {
    if (modalEl && modalEl.getAttribute("data-record-ui") !== "save-step-v1") {
      try {
        modalEl.remove();
      } catch (e) {}
      modalEl = null;
    }
    if (modalEl) return modalEl;
    modalEl = document.createElement("div");
    modalEl.className = "dash-record-voice";
    modalEl.hidden = true;
    modalEl.setAttribute("data-record-ui", "save-step-v1");
    modalEl.setAttribute("role", "dialog");
    modalEl.setAttribute("aria-modal", "true");
    modalEl.setAttribute("aria-labelledby", "dash-record-voice-title");
    modalEl.innerHTML =
      '<div class="dash-record-voice-backdrop" data-record-close></div>' +
      '<div class="dash-record-voice-sheet">' +
      '<div class="dash-record-tint" aria-hidden="true"></div>' +
      '<div class="dash-record-step dash-record-intro dash-record-quiet" data-step="quiet">' +
      '<button type="button" class="dash-record-voice-close dash-record-intro-close" data-record-close aria-label="Close">&times;</button>' +
      '<div class="dash-record-intro-hero">' +
      '<img src="images/onboarding-quiet-place-hero.png" alt="" width="320" height="320">' +
      "</div>" +
      '<div class="dash-record-intro-copy">' +
      '<h2 class="dash-record-intro-title" data-quiet-title>Find a quiet place<br>to record</h2>' +
      '<p class="dash-record-intro-body" data-quiet-body>Once you are settled, move to the next screen to read a quick sentence in your natural voice.</p>' +
      "</div>" +
      '<div class="dash-record-intro-footer">' +
      '<button type="button" class="dash-record-intro-next" data-quiet-next>Next</button>' +
      "</div></div>" +
      '<div class="dash-record-step dash-record-intro dash-record-speak" data-step="speak" hidden>' +
      '<button type="button" class="dash-record-voice-close dash-record-intro-close" data-record-close aria-label="Close">&times;</button>' +
      '<div class="dash-record-intro-hero">' +
      '<img src="images/onboarding-speak-language-hero.png" alt="" width="320" height="320">' +
      "</div>" +
      '<div class="dash-record-intro-copy">' +
      '<h2 class="dash-record-intro-title" data-speak-title>Select language<br>you will speak</h2>' +
      '<p class="dash-record-intro-body" data-speak-body>The magic is that one sample allows you to narrate stories in any language you can imagine.</p>' +
      "</div>" +
      '<div class="dash-record-intro-footer">' +
      '<div class="dash-record-speak-picker">' +
      '<div class="dash-record-speak-face" data-record-lang-face hidden aria-hidden="true">' +
      '<span class="dash-record-speak-flag" data-record-lang-flag></span>' +
      '<span class="dash-record-speak-primary" data-record-lang-primary></span>' +
      '<span class="dash-record-speak-sep"> · </span>' +
      '<span class="dash-record-speak-native" data-record-lang-native></span>' +
      "</div>" +
      '<select id="dash-record-lang" class="dash-record-speak-lang" data-record-lang aria-label="Select language"></select>' +
      "</div>" +
      '<button type="button" class="dash-record-intro-next" data-speak-next>Next</button>' +
      "</div></div>" +
      '<div class="dash-record-step dash-record-record" data-step="record" hidden>' +
      '<button type="button" class="dash-record-voice-close dash-record-record-close" data-record-close aria-label="Close">&times;</button>' +
      '<div class="dash-record-voice-body">' +
      '<div class="dash-record-hero" aria-hidden="true">' +
      '<span class="dash-record-hero-ring" data-ring="0"></span>' +
      '<span class="dash-record-hero-ring" data-ring="1"></span>' +
      '<span class="dash-record-hero-ring" data-ring="2"></span>' +
      '<span class="dash-record-hero-ring" data-ring="3"></span>' +
      '<img class="dash-record-hero-mic" src="images/start-recording-mic.png" alt="">' +
      "</div>" +
      '<h2 class="dash-record-read-title" id="dash-record-voice-title" data-record-title>Tap on "Record" and read the text.</h2>' +
      '<div class="dash-record-sample-glow">' +
      '<div class="dash-record-sample-outline" aria-hidden="true"></div>' +
      '<div class="dash-record-sample-panel">' +
      '<p class="dash-record-sample-text is-placeholder" data-record-sample>Select a language to see the sample text</p>' +
      '<div class="dash-record-countdown" data-record-countdown hidden aria-live="polite"></div>' +
      "</div></div>" +
      '<div class="dash-record-dock">' +
      '<div class="dash-record-tip" data-record-tip hidden>' +
      '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/></svg>' +
      "<span>Tap \"Record\" and read the sample text naturally in a quiet place. Once you read the entire text, hit Stop</span>" +
      "</div>" +
      '<div class="dash-record-controls">' +
      '<button type="button" class="dash-record-btn" data-record-btn disabled>' +
      '<span class="dash-record-dot" aria-hidden="true"></span>' +
      '<span class="dash-record-stop" aria-hidden="true"></span>' +
      '<span data-record-label>Record</span>' +
      "</button>" +
      '<p class="dash-record-status" data-record-status hidden></p>' +
      "</div></div></div></div>" +
      '<div class="dash-record-step dash-record-intro dash-record-save" data-step="save" hidden>' +
      '<button type="button" class="dash-record-voice-close dash-record-intro-close" data-record-close aria-label="Close">&times;</button>' +
      '<div class="dash-record-intro-hero dash-record-save-hero">' +
      '<img src="images/onboarding-name-voice-hero.png" alt="" width="320" height="320">' +
      "</div>" +
      '<div class="dash-record-save-form">' +
      '<label class="dash-record-save-label" for="dash-record-save-name" data-save-title>Name your voice</label>' +
      '<input id="dash-record-save-name" class="dash-record-save-input" type="text" maxlength="48" autocomplete="off" data-save-name placeholder="e.g. Mother, Father">' +
      '<label class="dash-record-save-consent">' +
      '<input type="checkbox" data-save-consent>' +
      '<span data-save-consent-text>I confirm that I recorded this voice, or that I have the right or permission to use it.</span>' +
      "</label>" +
      '<p class="dash-record-status" data-save-status hidden></p>' +
      "</div>" +
      '<div class="dash-record-intro-footer">' +
      '<button type="button" class="dash-record-intro-next" data-save-submit disabled>Save voice</button>' +
      '<button type="button" class="dash-record-save-again" data-save-again>Record again</button>' +
      "</div></div></div>";
    document.body.appendChild(modalEl);

    modalEl.querySelectorAll("[data-record-close]").forEach(function (el) {
      el.addEventListener("click", close);
    });
    var quietNext = $("[data-quiet-next]");
    if (quietNext) {
      quietNext.addEventListener("click", function () {
        showStep("speak");
      });
    }
    var speakNext = $("[data-speak-next]");
    if (speakNext) {
      speakNext.addEventListener("click", function () {
        var select = $("[data-record-lang]");
        var code = select && select.value ? select.value : "";
        if (!code) {
          if (select) select.focus();
          return;
        }
        applyLanguage(code);
        showStep("record");
      });
    }
    var select = $("[data-record-lang]");
    if (select) {
      select.addEventListener("change", function () {
        paintSpeakLangFace();
        syncSpeakNext();
      });
    }
    var btn = $("[data-record-btn]");
    if (btn) btn.addEventListener("click", onRecordClick);
    var saveBtn = $("[data-save-submit]");
    if (saveBtn) saveBtn.addEventListener("click", submitVoice);
    var againBtn = $("[data-save-again]");
    if (againBtn) {
      againBtn.addEventListener("click", function () {
        if (phase === "processing") return;
        pendingBlob = null;
        pendingPrepared = null;
        pendingDurationMs = 0;
        phase = "idle";
        setSaveStatus("", false);
        setStatus("", false);
        showStep("record");
        syncRecordUi();
      });
    }
    var nameInput = $("[data-save-name]");
    if (nameInput) {
      nameInput.addEventListener("input", syncSaveUi);
      nameInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          submitVoice();
        }
      });
    }
    var consent = $("[data-save-consent]");
    if (consent) consent.addEventListener("change", syncSaveUi);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modalEl && !modalEl.hidden) close();
    });
    return modalEl;
  }

  function quietPlaceCopy(code) {
    if (code === "hy") {
      return {
        title: "Գտեք անաղմուկ վայր<br>ձայնագրելու համար",
        body: "Առավելագույն որակի համար կարդացեք տեքստը հնարավորինս բնական ձայնով՝ անաղմուկ վայրից։",
        next: "Հաջորդ",
      };
    }
    if (code === "ru") {
      return {
        title: "Найдите тихое место<br>для записи",
        body: "Когда будете готовы, перейдите на следующий экран и прочитайте короткое предложение своим естественным голосом.",
        next: "Далее",
      };
    }
    return {
      title: "Find a quiet place<br>to record",
      body: "Once you are settled, move to the next screen to read a quick sentence in your natural voice.",
      next: "Next",
    };
  }

  function speakLanguageCopy(code) {
    if (code === "hy") {
      return {
        title: "Ընտրեք լեզուն,<br>որով կխոսեք",
        body: "Ընտրեք 100+ լեզուներից։ Ի դեպ Ձեր ձայնը կարող եք օգտագործել այլ լեզվով հեքիաթներ պատմելու համար։",
        next: "Հաջորդ",
        placeholder: "Ընտրեք լեզուն",
      };
    }
    if (code === "ru") {
      return {
        title: "Выберите язык,<br>на котором будете говорить",
        body: "Волшебство в том, что одного образца достаточно, чтобы рассказывать сказки на любом языке, который вы можете представить.",
        next: "Далее",
        placeholder: "Выберите язык",
      };
    }
    return {
      title: "Select language<br>you will speak",
      body: "The magic is that one sample allows you to narrate stories in any language you can imagine.",
      next: "Next",
      placeholder: "Select language",
    };
  }

  function paintQuietPlace() {
    var copy = quietPlaceCopy(webpageSpeakLang());
    var title = $("[data-quiet-title]");
    var body = $("[data-quiet-body]");
    var next = $("[data-quiet-next]");
    if (title) title.innerHTML = copy.title;
    if (body) body.textContent = copy.body;
    if (next) next.textContent = copy.next;
  }

  function paintSpeakLangFace() {
    var select = $("[data-record-lang]");
    var face = $("[data-record-lang-face]");
    if (!select || !face) return;
    var code = select.value || "";
    var L = langs();
    var lang = code && L && typeof L.byCode === "function" ? L.byCode(code) : null;
    if (!lang) {
      face.hidden = true;
      select.classList.remove("has-value");
      return;
    }
    var flag = $("[data-record-lang-flag]");
    var primary = $("[data-record-lang-primary]");
    var native = $("[data-record-lang-native]");
    if (flag) flag.textContent = lang.flag || "";
    if (primary) primary.textContent = lang.name || "";
    if (native) native.textContent = lang.native || lang.name || "";
    face.hidden = false;
    select.classList.add("has-value");
  }

  function paintSpeakLanguage() {
    var pageLang = webpageSpeakLang();
    var copy = speakLanguageCopy(pageLang);
    var title = $("[data-speak-title]");
    var body = $("[data-speak-body]");
    var next = $("[data-speak-next]");
    var select = $("[data-record-lang]");
    var L = langs();
    if (title) title.innerHTML = copy.title;
    if (body) body.textContent = copy.body;
    if (next) next.textContent = copy.next;
    if (L && typeof L.fillSelect === "function" && select) {
      L.fillSelect(select, { placeholder: copy.placeholder, selected: pageLang });
      select.value = pageLang;
    }
    paintSpeakLangFace();
    syncSpeakNext();
  }

  function syncSpeakNext() {
    var select = $("[data-record-lang]");
    var next = $("[data-speak-next]");
    if (!next) return;
    next.disabled = !(select && select.value);
  }

  function showStep(name) {
    if (!modalEl) return;
    var quiet = modalEl.querySelector('[data-step="quiet"]');
    var speak = modalEl.querySelector('[data-step="speak"]');
    var record = modalEl.querySelector('[data-step="record"]');
    var save = modalEl.querySelector('[data-step="save"]');
    if (quiet) quiet.hidden = name !== "quiet";
    if (speak) speak.hidden = name !== "speak";
    if (record) record.hidden = name !== "record";
    if (save) save.hidden = name !== "save";
    modalEl.classList.toggle("is-quiet-step", name === "quiet");
    modalEl.classList.toggle("is-speak-step", name === "speak");
    modalEl.classList.toggle("is-record-step", name === "record");
    modalEl.classList.toggle("is-save-step", name === "save");
    modalEl.classList.remove("is-dimmed", "is-countdown", "is-recording");
    setDimmed(false);
    setCountdownDigit(null);
    if (name === "speak") {
      paintSpeakLanguage();
    }
    if (name === "record") {
      var select = $("[data-record-lang]");
      var code = (select && select.value) || webpageSpeakLang() || speakLang;
      if (code) applyLanguage(code);
      syncRecordUi();
    }
    if (name === "save") {
      paintSaveStep();
    }
  }

  function reset() {
    phase = "idle";
    speakLang = "";
    activeSampleText = "";
    pendingBlob = null;
    pendingPrepared = null;
    pendingDurationMs = 0;
    stopRequested = false;
    countdownToken += 1;
    stopMicTracks();
    setCountdownDigit(null);
    setDimmed(false);
    if (modalEl) {
      modalEl.classList.remove(
        "is-recording",
        "is-countdown",
        "is-dimmed",
        "is-quiet-step",
        "is-speak-step",
        "is-record-step",
        "is-save-step"
      );
    }
    setStatus("", false);
    setSaveStatus("", false);
    var select = $("[data-record-lang]");
    if (select) select.value = "";
    var nameInput = $("[data-save-name]");
    if (nameInput) nameInput.value = "";
    var consent = $("[data-save-consent]");
    if (consent) consent.checked = false;
    applyLanguage("");
  }

  function webpageSpeakLang() {
    var L = langs();
    function valid(code) {
      var c = String(code || "").trim().toLowerCase();
      if (!c) return "";
      if (L && typeof L.byCode === "function" && L.byCode(c)) return c;
      return "";
    }
    try {
      var stored = valid(localStorage.getItem("nanik-site-lang"));
      if (stored) return stored;
    } catch (e) {}
    var html = valid((document.documentElement.lang || "").slice(0, 2));
    if (html) return html;
    return valid("en") || "en";
  }

  function open() {
    var s = session();
    if (!s || !s.access_token) {
      window.location.href = "signin.html?next=" + encodeURIComponent("dashboard.html");
      return;
    }
    var gate = window.__nanikAssertVoiceCloneSlot;
    if (typeof gate === "function") {
      Promise.resolve(gate()).then(function (ok) {
        if (ok === false) return;
        openModal();
      });
      return;
    }
    openModal();
  }

  function openModal() {
    ensureModal();
    reset();
    paintQuietPlace();
    showStep("quiet");
    modalEl.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function close() {
    if (!modalEl) return;
    countdownToken += 1;
    if (phase === "recording") {
      try {
        if (mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop();
      } catch (e) {}
    }
    stopMicTracks();
    setCountdownDigit(null);
    setDimmed(false);
    modalEl.hidden = true;
    modalEl.classList.remove("is-recording", "is-countdown", "is-dimmed");
    document.body.style.overflow = "";
    phase = "idle";
  }

  window.NanikRecordVoice = {
    open: open,
    close: close,
  };
})();
