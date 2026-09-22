/**
 * Story voiceover TTS — same Higgs chunk + PCM merge pipeline as the Nanik app /
 * voice-magic demo (prepareTtsChunkText → sequential /tts → concatPcm16 → WAV).
 */
(function (global) {
  "use strict";

  function api() {
    return global.NANIK_API || {};
  }

  function higgsCfg() {
    return api().higgs || {};
  }

  function higgsProxyBase() {
    var fromCfg = String(api().higgsProxy || "").replace(/\/$/, "");
    if (fromCfg) return fromCfg;
    var base = String(api().supabaseUrl || "").replace(/\/$/, "");
    return base ? base + "/functions/v1/higgs-proxy" : "";
  }

  function sleep(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function countNarrationWords(text) {
    var tokens = String(text || "")
      .replace(/<\|[^|]+:[^|]+\|>/g, "")
      .trim()
      .match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu);
    return tokens ? tokens.length : 0;
  }

  function estimateHiggsTokens(text) {
    var trimmed = String(text || "").trim();
    if (!trimmed) return 0;
    return Math.ceil(trimmed.length / 3.5);
  }

  function stripInlineHiggsPauseTags(text) {
    return String(text || "")
      .replace(/<\|[^|]+\|>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function ensureHiggsChunkEndsWithPeriod(text) {
    var trimmed = stripInlineHiggsPauseTags(String(text || "").trim());
    if (!trimmed) return trimmed;
    if (trimmed.endsWith(".")) return trimmed;
    var body = trimmed.replace(/[.:։!?,…]+["'»»\)]*$/u, ".");
    return body.endsWith(".") ? body : body + ".";
  }

  /** Match server prepareTtsChunkText('higgs') / voice-magic prepareHiggsChunkText. */
  function prepareHiggsChunkText(text) {
    var body = String(text || "")
      .replace(/[\u00AB\u00BB]/g, "")
      .replace(/\s*\[SCENE_BREAKS?\]\s*/gi, " ")
      .replace(/[ \t]+/g, " ")
      .trim();
    if (!body) return body;
    body = stripInlineHiggsPauseTags(body);
    var out = "";
    var i = 0;
    while (i < body.length) {
      if (body.indexOf("<|", i) === i) {
        var tagEnd = body.indexOf("|>", i);
        if (tagEnd !== -1) {
          i = tagEnd + 2;
          continue;
        }
      }
      var ch = body.charAt(i);
      if (ch === "-" || ch === "–" || ch === "—") {
        i += 1;
        continue;
      }
      out += ch === ":" || ch === "։" ? "." : ch;
      i += 1;
    }
    return ensureHiggsChunkEndsWithPeriod(out.replace(/\s+/g, " ").trim());
  }

  function splitAtTtsSentenceBoundaries(text) {
    var normalized = String(text || "").replace(/\s+/g, " ").trim();
    if (!normalized) return [];
    var segments = [];
    var current = "";
    var i = 0;
    var boundary = { ":": 1, ".": 1, "։": 1 };
    while (i < normalized.length) {
      if (normalized.indexOf("<|", i) === i) {
        var tagEnd = normalized.indexOf("|>", i);
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
        current = "";
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
      sentencesMax: Number(h.chunkSentencesMax) || 16,
    };
  }

  function fitsChunkLimits(text, limits) {
    var trimmed = String(text || "").trim();
    if (!trimmed) return false;
    if (trimmed.length > limits.maxChars) return false;
    if (countNarrationWords(trimmed) > limits.maxWords) return false;
    if (estimateHiggsTokens(trimmed) > limits.maxTokens) return false;
    return true;
  }

  function canMergeChunks(a, b, limits) {
    var merged = (a + " " + b).trim();
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
        out[i] = (out[i] + " " + out[i + 1]).trim();
        out.splice(i + 1, 1);
        continue;
      }
      if (i > 0 && canMergeChunks(out[i - 1], out[i], limits)) {
        out[i - 1] = (out[i - 1] + " " + out[i]).trim();
        out.splice(i, 1);
        continue;
      }
      i += 1;
    }
    return out;
  }

  function computeNarrationChunks(text) {
    var limits = chunkLimits();
    var scenes = String(text || "")
      .split(/\s*\[SCENE_BREAKS?\]\s*/gi)
      .map(function (s) {
        return s.trim();
      })
      .filter(Boolean);
    if (!scenes.length) {
      var single = String(text || "").trim();
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
        var candidate = (batch.join(" ") + " " + sentence).trim();
        var over =
          countNarrationWords(candidate) > limits.maxWords ||
          candidate.length > limits.maxChars ||
          estimateHiggsTokens(candidate) > limits.maxTokens;
        if (over || batch.length >= limits.sentencesMax) {
          packs.push(batch.join(" ").trim());
          batch = [sentence];
        } else {
          batch.push(sentence);
        }
      }
      if (batch.length) packs.push(batch.join(" ").trim());
    }
    return coalesceUndersizedChunks(packs.filter(Boolean), limits);
  }

  function decodeBase64Bytes(b64) {
    var raw = atob(String(b64 || ""));
    var bytes = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
    return bytes;
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

  function wrapPcm16InWav(pcm16, sampleRate) {
    var dataBytes = pcm16.length * 2;
    var buffer = new ArrayBuffer(44 + dataBytes);
    var view = new DataView(buffer);
    function writeStr(offset, str) {
      for (var i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    }
    writeStr(0, "RIFF");
    view.setUint32(4, 36 + dataBytes, true);
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
    view.setUint32(40, dataBytes, true);
    var out = new Uint8Array(buffer);
    out.set(new Uint8Array(pcm16.buffer, pcm16.byteOffset, dataBytes), 44);
    return out;
  }

  function samplingParams() {
    var h = higgsCfg();
    return {
      modelId: h.modelId || "higgs-tts-3",
      responseFormat: h.responseFormat || "pcm",
      temperature: Number.isFinite(Number(h.temperature)) ? Number(h.temperature) : 0.9,
      maxNewTokens: Number.isFinite(Number(h.maxNewTokens)) ? Number(h.maxNewTokens) : 2047,
      topK: Number.isFinite(Number(h.topK)) ? Number(h.topK) : 0,
      topP: Number.isFinite(Number(h.topP)) ? Number(h.topP) : 0.95,
      speakingRate: Number.isFinite(Number(h.speakingRate)) ? Number(h.speakingRate) : 1,
      sampleRate: Number(h.sampleRate) || 24000,
      interChunkMs: Number(h.interChunkMs) || 1200,
      interChunkRateLimitMs: Number(h.interChunkRateLimitMs) || 5000,
    };
  }

  function isTransientTtsError(err) {
    if (!err) return false;
    if (err.name === "AbortError") return true;
    var status = Number(err.status) || 0;
    if (status === 502 || status === 503 || status === 504 || status === 429) return true;
    var msg = String(err.message || "").toLowerCase();
    return /timed out|timeout|failed to generate|rate.?limit|bad gateway|temporarily unavailable/i.test(
      msg
    );
  }

  function postTts(payload, accessToken, anonKey, timeoutMs) {
    var proxy = higgsProxyBase();
    if (!proxy) return Promise.reject(new Error("TTS proxy is not configured."));
    if (!accessToken) return Promise.reject(new Error("Sign in to generate a voiceover."));
    var ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    var timer = 0;
    if (ctrl) {
      timer = setTimeout(function () {
        try {
          ctrl.abort();
        } catch (e) {}
      }, timeoutMs || 150000);
    }
    return fetch(proxy + "/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey || "",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify(payload),
      signal: ctrl ? ctrl.signal : undefined,
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
            var err = new Error(
              (data && (data.error || data.message)) || "tts " + res.status
            );
            err.status = res.status;
            err.code = data && data.code;
            throw err;
          }
          return data;
        });
      })
      .finally(function () {
        if (timer) clearTimeout(timer);
      });
  }

  function chunkProgressPercent(completed, total) {
    if (total <= 0) return 0;
    var ratio = Math.min(1, Math.max(0, completed / total));
    if (ratio <= 0) return 0;
    if (ratio >= 1) return 98;
    return Math.min(97, Math.max(1, Math.round(ratio * 100)));
  }

  /**
   * @param {object} opts
   * @param {string} opts.text
   * @param {string} opts.voiceId
   * @param {string} opts.languageCode
   * @param {string} opts.accessToken
   * @param {string} [opts.anonKey]
   * @param {function} [opts.onProgress] — ({ completed, total, percent })
   * @param {AbortSignal} [opts.signal]
   * @returns {Promise<{ url: string, blob: Blob, mimeType: string, chunks: number }>}
   */
  function synthesizeStoryVoiceover(opts) {
    opts = opts || {};
    var text = String(opts.text || "").trim();
    var voiceId = String(opts.voiceId || "").trim();
    if (!text) return Promise.reject(new Error("Missing story text."));
    if (!voiceId) return Promise.reject(new Error("Missing voice."));

    var sampling = samplingParams();
    var chunks = computeNarrationChunks(text);
    if (!chunks.length) return Promise.reject(new Error("Could not split story for voiceover."));

    var pcmParts = [];
    var index = 0;
    var rateLimitedRecently = false;
    var report = typeof opts.onProgress === "function" ? opts.onProgress : function () {};

    report({ completed: 0, total: chunks.length, percent: 0 });

    function synthesizeOne(chunkText) {
      var prepared = prepareHiggsChunkText(chunkText);
      var payload = {
        text: prepared,
        voiceId: voiceId,
        modelId: sampling.modelId,
        responseFormat: sampling.responseFormat,
        temperature: sampling.temperature,
        maxNewTokens: sampling.maxNewTokens,
        topK: sampling.topK,
        topP: sampling.topP,
        languageCode: opts.languageCode || "en",
        speakingRate: sampling.speakingRate,
      };
      var attempts = 0;
      function attempt() {
        if (opts.signal && opts.signal.aborted) {
          return Promise.reject(new Error("Voiceover cancelled."));
        }
        attempts += 1;
        return postTts(payload, opts.accessToken, opts.anonKey, 150000).catch(function (err) {
          if (isTransientTtsError(err) && attempts < 4) {
            if (Number(err.status) === 429 || /rate.?limit/i.test(String(err.message || ""))) {
              rateLimitedRecently = true;
            }
            var wait = rateLimitedRecently
              ? sampling.interChunkRateLimitMs * Math.min(attempts, 2)
              : 1200 * attempts;
            return sleep(wait).then(attempt);
          }
          throw err;
        });
      }
      return attempt();
    }

    function next() {
      if (index >= chunks.length) {
        var merged = concatPcm16(pcmParts);
        var wav = wrapPcm16InWav(merged, sampling.sampleRate);
        var blob = new Blob([wav], { type: "audio/wav" });
        var url = URL.createObjectURL(blob);
        report({ completed: chunks.length, total: chunks.length, percent: 100 });
        return {
          url: url,
          blob: blob,
          mimeType: "audio/wav",
          chunks: chunks.length,
        };
      }
      var chunkText = chunks[index];
      return synthesizeOne(chunkText).then(function (res) {
        if (!res || !res.audioBase64) throw new Error("TTS returned empty audio.");
        var bytes = decodeBase64Bytes(res.audioBase64);
        var mime = String(res.mimeType || "").toLowerCase();
        var fmt = String(sampling.responseFormat || "pcm").toLowerCase();
        if (fmt === "pcm" || mime.indexOf("pcm") >= 0 || (!mime && fmt === "pcm")) {
          pcmParts.push(bytesToPcm16Le(bytes));
        } else if (mime.indexOf("wav") >= 0) {
          // Skip RIFF header if present (44 bytes) — rare override path.
          var pcmStart = bytes.byteLength > 44 ? 44 : 0;
          pcmParts.push(bytesToPcm16Le(bytes.subarray(pcmStart)));
        } else {
          throw new Error("Unexpected TTS audio format; expected PCM.");
        }
        index += 1;
        report({
          completed: index,
          total: chunks.length,
          percent: chunkProgressPercent(index, chunks.length),
        });
        if (index >= chunks.length) return next();
        var delay = rateLimitedRecently ? sampling.interChunkRateLimitMs : sampling.interChunkMs;
        rateLimitedRecently = false;
        return sleep(delay).then(next);
      });
    }

    return Promise.resolve().then(next);
  }

  global.NanikTts = {
    computeNarrationChunks: computeNarrationChunks,
    prepareHiggsChunkText: prepareHiggsChunkText,
    synthesizeStoryVoiceover: synthesizeStoryVoiceover,
    chunkProgressPercent: chunkProgressPercent,
  };
})(typeof window !== "undefined" ? window : globalThis);
