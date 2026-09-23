(function () {
  "use strict";

  var PROMPT_KEY = "nanik-hero-prompt";
  var ROTATE_MS = 3200;
  var PH_KEYS = ["hero.chat.ph1", "hero.chat.ph2", "hero.chat.ph3", "hero.chat.ph4"];

  var COPY = {
    en: {
      "hero.chat.send": "Start creating",
      "hero.chat.voice": "Voice",
      "hero.chat.listening": "Listening…",
      "hero.chat.ph1": "A story about my daughter’s teddy bear…",
      "hero.chat.ph2": "Help my son feel brave tonight…",
      "hero.chat.ph3": "A calm bedtime tale for twins…",
      "hero.chat.ph4": "Make our toy dinosaur the hero…",
    },
    hy: {
      "hero.chat.send": "Ստեղծել հեքիաթ",
      "hero.chat.voice": "Ավելացրու նկարը",
      "hero.chat.listening": "Լսում է…",
      "hero.chat.ph1": "Հեքիաթ իմ աղջկա արջուկի մասին…",
      "hero.chat.ph2": "Օգնիր տղայիս այսօր խիզախ լինել…",
      "hero.chat.ph3": "Հանգիստ գիշերային հեքիաթ երկվորյակների համար…",
      "hero.chat.ph4": "Մեր խաղալիք դինոզավրը դարձրու հերոս…",
    },
    ru: {
      "hero.chat.send": "Начать",
      "hero.chat.voice": "Голос",
      "hero.chat.listening": "Слушаю…",
      "hero.chat.ph1": "Сказка про плюшевого мишку дочки…",
      "hero.chat.ph2": "Помоги сыну сегодня быть смелым…",
      "hero.chat.ph3": "Спокойная сказка на ночь для близнецов…",
      "hero.chat.ph4": "Сделай героем нашего игрушечного динозавра…",
    },
  };

  function lang() {
    try {
      var stored = localStorage.getItem("nanik-site-lang");
      if (stored && COPY[stored]) return stored;
    } catch (e) {}
    var html = (document.documentElement.lang || "en").slice(0, 2).toLowerCase();
    return COPY[html] ? html : "en";
  }

  function t(key) {
    var pack = COPY[lang()] || COPY.en;
    return pack[key] || COPY.en[key] || "";
  }

  function placeholders() {
    return PH_KEYS.map(t);
  }

  function init() {
    var form = document.getElementById("hero-chat");
    var input = document.getElementById("hero-chat-input");
    var ph = document.getElementById("hero-chat-ph");
    var voiceBtn = document.getElementById("hero-chat-voice");
    var sendBtn = document.getElementById("hero-chat-send");
    if (!form || !input || !ph) return;

    var idx = 0;
    var timer = 0;
    var rec = null;
    var listening = false;

    function paintLabels() {
      if (voiceBtn) {
        var voiceLabel = listening ? t("hero.chat.listening") : t("hero.chat.voice");
        voiceBtn.setAttribute("aria-label", voiceLabel);
        voiceBtn.setAttribute("title", voiceLabel);
        var voiceText = voiceBtn.querySelector("span");
        if (voiceText) voiceText.textContent = voiceLabel;
      }
      if (sendBtn) {
        sendBtn.setAttribute("aria-label", t("hero.chat.send"));
        sendBtn.setAttribute("title", t("hero.chat.send"));
        var sendText = sendBtn.querySelector("span");
        if (sendText) sendText.textContent = t("hero.chat.send");
      }
    }

    function showPh(text) {
      ph.textContent = text;
      ph.classList.remove("is-out");
    }

    function setFilled() {
      form.classList.toggle("is-filled", !!input.value.trim());
    }

    function stopRotate() {
      if (timer) clearInterval(timer);
      timer = 0;
    }

    function startRotate() {
      stopRotate();
      if (input.value.trim() || listening) return;
      var list = placeholders();
      if (!list.length) return;
      showPh(list[idx % list.length]);
      timer = setInterval(function () {
        if (input.value.trim() || listening) return;
        var next = placeholders();
        idx = (idx + 1) % next.length;
        ph.classList.add("is-out");
        setTimeout(function () {
          if (input.value.trim() || listening) return;
          showPh(next[idx]);
        }, 280);
      }, ROTATE_MS);
    }

    var photoInput = document.getElementById("hero-chat-photo");
    var thumbs = document.getElementById("hero-chat-thumbs");

    function paintThumbs() {
      var draft = window.NANIK_DRAFT;
      var src = draft && draft.getImage ? draft.getImage() : "";
      if (!thumbs) return;
      if (!src) {
        thumbs.hidden = true;
        thumbs.innerHTML = "";
        return;
      }
      thumbs.hidden = false;
      thumbs.innerHTML =
        '<div class="hero-chat-thumb">' +
        '<img src="' + src + '" alt="">' +
        '<button type="button" class="hero-chat-thumb-x" aria-label="Remove">&times;</button>' +
        "</div>";
      var x = thumbs.querySelector(".hero-chat-thumb-x");
      if (x) {
        x.addEventListener("click", function () {
          if (draft) draft.setImage("");
          paintThumbs();
        });
      }
    }

    function savePrompt() {
      var text = (input.value || "").trim();
      if (window.NANIK_DRAFT) window.NANIK_DRAFT.setPrompt(text);
      else {
        try {
          if (text) sessionStorage.setItem(PROMPT_KEY, text);
        } catch (e) {}
        window.NANIK_HERO_PROMPT = text;
      }
    }

    function prefersReduceMotion() {
      return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    function dockChatThen(done) {
      var hero = form.closest(".hero");
      var leadWrap = document.getElementById("hero-lead-wrap");
      if (form.classList.contains("is-docked")) {
        if (done) done();
        return;
      }
      var first = form.getBoundingClientRect();
      if (hero) hero.style.setProperty("--hero-chat-h", Math.round(first.height) + "px");
      if (leadWrap) leadWrap.classList.add("is-out");
      if (hero) hero.classList.add("is-chat-sent");
      form.classList.add("is-docked");
      if (prefersReduceMotion()) {
        if (done) done();
        return;
      }
      var last = form.getBoundingClientRect();
      var dy = first.top - last.top;
      if (Math.abs(dy) < 6) {
        if (done) done();
        return;
      }
      form.style.transition = "none";
      form.style.transform = "translateY(" + dy + "px)";
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          form.style.transition = "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)";
          form.style.transform = "translateY(0)";
        });
      });
      var finished = false;
      function finish() {
        if (finished) return;
        finished = true;
        form.style.transition = "";
        form.style.transform = "";
        if (done) done();
      }
      form.addEventListener("transitionend", function onEnd(e) {
        if (e && e.propertyName && e.propertyName !== "transform") return;
        form.removeEventListener("transitionend", onEnd);
        finish();
      });
      setTimeout(finish, 700);
    }

    function openSignup() {
      savePrompt();
      var draft = window.NANIK_DRAFT;
      var session = draft && draft.readSession ? draft.readSession() : null;
      if (session && session.access_token && draft && draft.goDashboard) {
        draft.goDashboard("create");
        return;
      }
      if (typeof window.NANIK_OPEN_SIGNUP === "function") {
        window.NANIK_OPEN_SIGNUP();
        return;
      }
      var fallback = document.getElementById("site-signup-open");
      if (fallback) fallback.click();
    }

    function submitIdea() {
      stopVoice();
      var hasIdea = !!(input.value || "").trim() || (window.NANIK_DRAFT && window.NANIK_DRAFT.getImage && window.NANIK_DRAFT.getImage());
      if (!hasIdea) {
        openSignup();
        return;
      }
      dockChatThen(openSignup);
    }

    function stopVoice() {
      listening = false;
      form.classList.remove("is-listening");
      if (voiceBtn) {
        voiceBtn.classList.remove("is-on");
        voiceBtn.setAttribute("aria-pressed", "false");
      }
      paintLabels();
      if (rec) {
        try {
          rec.stop();
        } catch (e) {}
      }
      setFilled();
      startRotate();
    }

    function pickPhoto() {
      if (photoInput) photoInput.click();
    }

    function startVoice() {
      var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) {
        pickPhoto();
        return;
      }
      if (listening) {
        stopVoice();
        return;
      }
      rec = new SR();
      rec.lang = lang() === "hy" ? "hy-AM" : lang() === "ru" ? "ru-RU" : "en-US";
      rec.interimResults = true;
      rec.continuous = false;
      rec.onstart = function () {
        listening = true;
        stopRotate();
        form.classList.add("is-listening");
        if (voiceBtn) {
          voiceBtn.classList.add("is-on");
          voiceBtn.setAttribute("aria-pressed", "true");
        }
        paintLabels();
      };
      rec.onresult = function (event) {
        var out = "";
        for (var i = 0; i < event.results.length; i++) {
          out += event.results[i][0].transcript;
        }
        input.value = out.trim();
        setFilled();
      };
      rec.onerror = function () {
        stopVoice();
      };
      rec.onend = function () {
        stopVoice();
      };
      try {
        rec.start();
      } catch (e) {
        stopVoice();
      }
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      submitIdea();
    });
    if (sendBtn) {
      sendBtn.addEventListener("click", function (e) {
        e.preventDefault();
        submitIdea();
      });
    }
    if (voiceBtn) {
      voiceBtn.addEventListener("click", function () {
        pickPhoto();
      });
    }
    if (photoInput) {
      photoInput.addEventListener("change", function () {
        var file = photoInput.files && photoInput.files[0];
        photoInput.value = "";
        if (!file || !window.NANIK_DRAFT) return;
        window.NANIK_DRAFT.compressImage(file)
          .then(function (dataUrl) {
            window.NANIK_DRAFT.setImage(dataUrl);
            paintThumbs();
          })
          .catch(function () {});
      });
    }
    input.addEventListener("input", function () {
      setFilled();
      savePrompt();
      if (input.value.trim()) stopRotate();
      else startRotate();
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        submitIdea();
      }
    });
    window.addEventListener("nanik:langchange", function () {
      paintLabels();
      idx = 0;
      startRotate();
    });

    paintLabels();
    if (window.NANIK_DRAFT) {
      var saved = window.NANIK_DRAFT.getPrompt();
      if (saved && !input.value) input.value = saved;
    }
    setFilled();
    paintThumbs();
    startRotate();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
