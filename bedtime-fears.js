(function () {
  var COPY = {
    en: { cta: "Create story", ctaName: "Create {name}’s story", ctaNameS: "Create {name}’ story", readyName: "{name}’s story is ready to create", readyNameS: "{name}’ story is ready to create", ready: "Your story is ready to create", readyLead: "Sign up to create it and save it to your library." },
    hy: { cta: "Ստեղծել հեքիաթ", ctaName: "Ստեղծել {name}-ի հեքիաթը", readyName: "{name}-ի հեքիաթը պատրաստ է ստեղծման", ready: "Ձեր հեքիաթը պատրաստ է ստեղծման", readyLead: "Գրանցվեք՝ այն ստեղծելու և ձեր գրադարանում պահելու համար։" },
    ru: { cta: "Создать сказку", ctaName: "Создать сказку для {name}", readyName: "Сказка для {name} готова к созданию", ready: "Ваша сказка готова к созданию", readyLead: "Зарегистрируйтесь, чтобы создать её и сохранить в библиотеке." },
  };

  function lang() {
    var code = (document.documentElement.lang || "en").toLowerCase().slice(0, 2);
    return COPY[code] ? code : "en";
  }

  function copy() { return COPY[lang()]; }

  function fill(tpl, vars) {
    return tpl.replace(/\{(\w+)\}/g, function (_, k) { return vars[k] != null ? vars[k] : ""; });
  }

  function init() {
    var form = document.getElementById("bf-form");
    if (!form) return;
    var text = document.getElementById("bf-text");
    var nameInput = document.getElementById("bf-name");
    var submit = document.getElementById("bf-submit");
    var chips = Array.prototype.slice.call(form.querySelectorAll("[data-bf-chip]"));
    var ages = Array.prototype.slice.call(form.querySelectorAll("[data-bf-age]"));
    var selectedAge = "";

    function childName() {
      return String(nameInput.value || "").replace(/\s+/g, " ").trim();
    }

    function paintCta() {
      var c = copy();
      var name = childName();
      if (!name) {
        submit.textContent = c.cta;
        return;
      }
      var tpl = c.ctaNameS && /s$/i.test(name) ? c.ctaNameS : c.ctaName;
      submit.textContent = fill(tpl, { name: name });
    }

    var chipRow = form.querySelector(".bf-chips");
    var pickedBox = form.querySelector("[data-bf-picked]");

    function syncChipAreas() {
      pickedBox.hidden = !pickedBox.children.length;
      chipRow.hidden = !chipRow.children.length;
    }

    function isReady() {
      return !!selectedAge && (pickedBox.children.length > 0 || String(text.value || "").trim().length > 0);
    }

    function syncSubmit() {
      submit.disabled = !isReady();
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var on = chip.getAttribute("aria-pressed") !== "true";
        chip.setAttribute("aria-pressed", on ? "true" : "false");
        if (on) {
          pickedBox.appendChild(chip);
        } else {
          var next = chips.slice(chips.indexOf(chip) + 1).filter(function (c) { return c.parentNode === chipRow; })[0];
          chipRow.insertBefore(chip, next || null);
        }
        syncChipAreas();
        syncSubmit();
      });
    });

    ages.forEach(function (btn) {
      btn.addEventListener("click", function () {
        selectedAge = btn.getAttribute("data-bf-age");
        ages.forEach(function (b) { b.setAttribute("aria-checked", b === btn ? "true" : "false"); });
        syncSubmit();
      });
    });

    var langSelect = document.getElementById("bf-lang");

    function populateLanguages() {
      var list = Array.isArray(window.NANIK_STORY_LANGS) ? window.NANIK_STORY_LANGS.slice() : [];
      if (!list.length) list = [{ code: "en", nativeName: "English", flag: "🇺🇸" }];
      var preferred = ["hy", "en", "ru"];
      list.sort(function (a, b) {
        var ai = preferred.indexOf(a.code), bi = preferred.indexOf(b.code);
        if (ai !== -1 || bi !== -1) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
        return String(a.name || a.nativeName).localeCompare(String(b.name || b.nativeName));
      });
      list.forEach(function (item) {
        var opt = document.createElement("option");
        opt.value = item.code;
        opt.textContent = (item.flag ? item.flag + " " : "") + (item.nativeName || item.name || item.code);
        langSelect.appendChild(opt);
      });
      selectSiteLanguage();
    }

    function selectSiteLanguage() {
      var raw = String(document.documentElement.lang || "en").toLowerCase();
      var code = [raw, raw.split("-")[0]].filter(function (c) {
        return langSelect.querySelector('option[value="' + c + '"]');
      })[0];
      langSelect.value = code || "en";
    }

    populateLanguages();
    window.addEventListener("nanik:langchange", function () {
      if (!langSelect.dataset.touched) selectSiteLanguage();
    });
    langSelect.addEventListener("change", function () { langSelect.dataset.touched = "1"; });

    nameInput.addEventListener("input", paintCta);
    text.addEventListener("input", syncSubmit);
    window.addEventListener("nanik:langchange", paintCta);
    paintCta();
    syncSubmit();

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!isReady()) return;
      var c = copy();
      var name = childName();
      var picked = chips
        .filter(function (chip) { return chip.getAttribute("aria-pressed") === "true"; })
        .map(function (chip) { return chip.textContent.replace(/\s+/g, " ").trim().replace(/^\S+\s/, ""); });
      var free = String(text.value || "").trim();
      var support = [picked.join(", "), free].filter(Boolean).join(". ");

      var draft = window.NANIK_DRAFT;
      if (draft) {
        if (draft.setPrompt) draft.setPrompt("");
        if (draft.setAge && selectedAge) draft.setAge(selectedAge);
        if (draft.setLanguage) draft.setLanguage(langSelect.value);
        if (draft.setQuickStory) {
          draft.setQuickStory({ kind: form.getAttribute("data-bf-kind") || "bedtime", support: support, name: name, age: selectedAge, lang: langSelect.value });
        }
      }
      var readyTpl = name ? (c.readyNameS && /s$/i.test(name) ? c.readyNameS : c.readyName) : c.ready;
      if (window.NANIK_OPEN_SIGNUP) window.NANIK_OPEN_SIGNUP({ title: fill(readyTpl, { name: name }), lead: c.readyLead });
      else location.href = draft && draft.dashboardUrl ? draft.dashboardUrl("create") : "dashboard.html?panel=create";
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
