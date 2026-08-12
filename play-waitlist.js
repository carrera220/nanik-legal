(function () {
  "use strict";

  var COPY = {
    en: {
      title: "Coming soon on Google Play",
      body: "Leave your email and we’ll notify you when Nanik is available on Play Market.",
      email: "Email",
      submit: "Notify me",
      thanks: "You’re on the list. We’ll email you when it’s ready.",
      error: "Please enter a valid email.",
      fail: "Could not save your email. Please try again.",
      close: "Close",
    },
    hy: {
      title: "Շուտով Play Market-ում",
      body: "Թող քո էլ․ հասցեն, և կտեղեկացնենք, երբ Nanik-ը հասանելի լինի Play Market-ում։",
      email: "Էլ․ հասցե",
      submit: "Տեղեկացրու ինձ",
      thanks: "Դու ցուցակում ես։ Կգրենք, երբ պատրաստ լինի։",
      error: "Խնդրում ենք մուտքագրել վավեր էլ․ հասցե։",
      fail: "Չհաջողվեց պահել հասցեն։ Փորձիր նորից։",
      close: "Փակել",
    },
    ru: {
      title: "Скоро в Google Play",
      body: "Оставьте email — напишем, когда Nanik появится в Play Market.",
      email: "Email",
      submit: "Сообщить мне",
      thanks: "Вы в списке. Напишем, когда приложение будет готово.",
      error: "Введите корректный email.",
      fail: "Не удалось сохранить email. Попробуйте ещё раз.",
      close: "Закрыть",
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

  function t() {
    return COPY[lang()] || COPY.en;
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
  }

  function saveLocal(email) {
    try {
      var key = "nanik-play-waitlist";
      var list = JSON.parse(localStorage.getItem(key) || "[]");
      if (list.indexOf(email) === -1) list.push(email);
      localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {}
  }

  function submitEmail(email) {
    var cfg = window.NANIK_API || {};
    var base = (cfg.supabaseUrl || "https://zljowsxavbpqfdskekwd.supabase.co").replace(/\/$/, "");
    var anon =
      cfg.supabaseAnonKey ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpsam93c3hhdmJwcWZkc2tla3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MjM2NjgsImV4cCI6MjA5MjE5OTY2OH0.sGswPfq4uBKgYsp2b5JNU-mETXqLCGpooVbLmUlgXi4";
    var payload = {
      email: email,
      source: location.pathname || "/",
      user_agent: navigator.userAgent || "",
    };

    function postSupabase() {
      if (!anon) return Promise.reject(new Error("no supabase"));
      return fetch(base + "/rest/v1/play_waitlist", {
        method: "POST",
        headers: {
          apikey: anon,
          Authorization: "Bearer " + anon,
          "Content-Type": "application/json",
          Prefer: "return=minimal,resolution=ignore-duplicates",
        },
        body: JSON.stringify(payload),
      }).then(function (res) {
        if (res.ok || res.status === 409) return;
        throw new Error("supabase " + res.status);
      });
    }

    return postSupabase().catch(function () {
      return fetch("https://formsubmit.co/ajax/info@nanik.app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email,
          _subject: "Nanik Play Market waitlist",
          source: payload.source,
        }),
      }).then(function (res) {
        if (!res.ok) throw new Error("formsubmit");
      });
    });
  }

  function ensureModal() {
    var existing = document.getElementById("play-waitlist-modal");
    if (existing) return existing;

    var dialog = document.createElement("dialog");
    dialog.id = "play-waitlist-modal";
    dialog.className = "play-waitlist-modal";
    dialog.setAttribute("aria-labelledby", "play-waitlist-title");
    dialog.innerHTML =
      '<div class="play-waitlist-backdrop" data-close-play-waitlist></div>' +
      '<div class="play-waitlist-sheet" role="document">' +
      '<button type="button" class="play-waitlist-close" data-close-play-waitlist aria-label="Close">&times;</button>' +
      '<h2 id="play-waitlist-title"></h2>' +
      '<p class="play-waitlist-body"></p>' +
      '<form class="play-waitlist-form" novalidate>' +
      '<label class="play-waitlist-label"><span class="play-waitlist-label-text"></span>' +
      '<input class="play-waitlist-input" type="email" name="email" autocomplete="email" required></label>' +
      '<p class="play-waitlist-status" hidden></p>' +
      '<button type="submit" class="btn play-waitlist-submit"></button>' +
      "</form></div>";
    document.body.appendChild(dialog);
    return dialog;
  }

  function paint(dialog) {
    var c = t();
    dialog.querySelector("#play-waitlist-title").textContent = c.title;
    dialog.querySelector(".play-waitlist-body").textContent = c.body;
    dialog.querySelector(".play-waitlist-label-text").textContent = c.email;
    dialog.querySelector(".play-waitlist-input").placeholder = "you@email.com";
    dialog.querySelector(".play-waitlist-submit").textContent = c.submit;
    dialog.querySelector(".play-waitlist-close").setAttribute("aria-label", c.close);
  }

  function openModal() {
    var dialog = ensureModal();
    paint(dialog);
    var form = dialog.querySelector("form");
    var status = dialog.querySelector(".play-waitlist-status");
    var input = dialog.querySelector(".play-waitlist-input");
    var submit = dialog.querySelector(".play-waitlist-submit");
    form.hidden = false;
    status.hidden = true;
    status.textContent = "";
    input.value = "";
    submit.disabled = false;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    document.body.classList.add("play-waitlist-open");
    setTimeout(function () {
      input.focus();
    }, 50);
  }

  function closeModal() {
    var dialog = document.getElementById("play-waitlist-modal");
    if (!dialog) return;
    if (typeof dialog.close === "function" && dialog.open) dialog.close();
    else dialog.removeAttribute("open");
    document.body.classList.remove("play-waitlist-open");
  }

  function bind() {
    var dialog = ensureModal();
    paint(dialog);

    document.addEventListener("click", function (e) {
      var open = e.target.closest && e.target.closest("[data-open-play-waitlist]");
      if (open) {
        e.preventDefault();
        e.stopPropagation();
        openModal();
        return;
      }
      if (e.target.closest && e.target.closest("[data-close-play-waitlist]")) {
        e.preventDefault();
        closeModal();
      }
    });

    dialog.addEventListener("cancel", function (e) {
      e.preventDefault();
      closeModal();
    });

    dialog.querySelector("form").addEventListener("submit", function (e) {
      e.preventDefault();
      var c = t();
      var input = dialog.querySelector(".play-waitlist-input");
      var status = dialog.querySelector(".play-waitlist-status");
      var submit = dialog.querySelector(".play-waitlist-submit");
      var email = String(input.value || "").trim().toLowerCase();
      if (!validEmail(email)) {
        status.hidden = false;
        status.textContent = c.error;
        status.classList.add("is-error");
        input.focus();
        return;
      }
      submit.disabled = true;
      status.hidden = true;
      submitEmail(email)
        .then(function () {
          saveLocal(email);
          dialog.querySelector("form").hidden = true;
          status.hidden = false;
          status.classList.remove("is-error");
          status.textContent = c.thanks;
        })
        .catch(function () {
          submit.disabled = false;
          status.hidden = false;
          status.classList.add("is-error");
          status.textContent = c.fail;
        });
    });

    window.addEventListener("nanik:langchange", function () {
      paint(dialog);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})();
