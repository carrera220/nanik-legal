/**
 * Detect UI language from country / timezone / browser.
 * Only auto-applies when the visitor has not chosen a language yet.
 */
(function (global) {
  var STORAGE_KEY = "nanik-site-lang";
  var GEO_URL = "https://get.geojs.io/v1/ip/country.json";

  /** ISO country → site language (marketing + app). */
  var COUNTRY_LANG = {
    AM: "hy",
    RU: "ru",
    BY: "ru",
    KZ: "ru",
    KG: "ru",
    TJ: "ru",
    UZ: "ru",
    UA: "uk",
    DE: "de",
    AT: "de",
    CH: "de",
    LI: "de",
    FR: "fr",
    BE: "fr",
    LU: "fr",
    MC: "fr",
    ES: "es",
    MX: "es",
    AR: "es",
    CO: "es",
    CL: "es",
    PE: "es",
    EC: "es",
    UY: "es",
    PY: "es",
    BO: "es",
    VE: "es",
    CR: "es",
    PA: "es",
    GT: "es",
    HN: "es",
    SV: "es",
    NI: "es",
    DO: "es",
    CU: "es",
    PR: "es",
    IT: "it",
    SM: "it",
    VA: "it",
    PT: "pt",
    BR: "pt",
    AO: "pt",
    MZ: "pt",
    NL: "nl",
    PL: "pl",
    CZ: "cs",
    SK: "cs",
    RO: "ro",
    MD: "ro",
    GR: "el",
    CY: "el",
    HU: "hu",
    SE: "sv",
    NO: "no",
    DK: "da",
    FI: "fi",
    GB: "en",
    US: "en",
    AU: "en",
    CA: "en",
    IE: "en",
    NZ: "en",
    ZA: "en",
  };

  var TZ_LANG = {
    "Asia/Yerevan": "hy",
    "Europe/Moscow": "ru",
    "Europe/Minsk": "ru",
    "Europe/Kaliningrad": "ru",
    "Europe/Samara": "ru",
    "Asia/Yekaterinburg": "ru",
    "Asia/Novosibirsk": "ru",
    "Asia/Krasnoyarsk": "ru",
    "Asia/Irkutsk": "ru",
    "Asia/Yakutsk": "ru",
    "Asia/Vladivostok": "ru",
    "Asia/Almaty": "ru",
    "Asia/Aqtobe": "ru",
    "Asia/Atyrau": "ru",
    "Asia/Qyzylorda": "ru",
    "Asia/Oral": "ru",
    "Asia/Bishkek": "ru",
    "Asia/Tashkent": "ru",
    "Asia/Samarkand": "ru",
    "Asia/Dushanbe": "ru",
    "Europe/Kyiv": "uk",
    "Europe/Kiev": "uk",
    "Europe/Berlin": "de",
    "Europe/Vienna": "de",
    "Europe/Zurich": "de",
    "Europe/Paris": "fr",
    "Europe/Brussels": "fr",
    "Europe/Madrid": "es",
    "America/Mexico_City": "es",
    "America/Buenos_Aires": "es",
    "America/Argentina/Buenos_Aires": "es",
    "America/Bogota": "es",
    "America/Santiago": "es",
    "America/Lima": "es",
    "Europe/Rome": "it",
    "Europe/Lisbon": "pt",
    "America/Sao_Paulo": "pt",
    "Europe/Amsterdam": "nl",
    "Europe/Warsaw": "pl",
    "Europe/Prague": "cs",
    "Europe/Bucharest": "ro",
    "Europe/Chisinau": "ro",
    "Europe/Athens": "el",
    "Europe/Budapest": "hu",
    "Europe/Stockholm": "sv",
    "Europe/Oslo": "no",
    "Europe/Copenhagen": "da",
    "Europe/Helsinki": "fi",
    "Europe/London": "en",
    "America/New_York": "en",
    "America/Chicago": "en",
    "America/Denver": "en",
    "America/Los_Angeles": "en",
    "America/Toronto": "en",
    "Australia/Sydney": "en",
  };

  function normalizeLang(code) {
    if (!code) return null;
    code = String(code).toLowerCase().replace("_", "-").split("-")[0];
    if (code === "nb" || code === "nn") return "no";
    return code || null;
  }

  function readSavedLang() {
    try {
      return normalizeLang(localStorage.getItem(STORAGE_KEY));
    } catch (e) {
      return null;
    }
  }

  function writeSavedLang(code) {
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch (e) {}
  }

  function hasSavedLang() {
    return !!readSavedLang();
  }

  function pickAllowed(code, allowed) {
    code = normalizeLang(code);
    if (!code) return null;
    if (!allowed || !allowed.length) return code;
    for (var i = 0; i < allowed.length; i++) {
      if (allowed[i] === code) return code;
    }
    return null;
  }

  function langFromCountry(country, allowed) {
    var cc = String(country || "").toUpperCase();
    return pickAllowed(COUNTRY_LANG[cc], allowed);
  }

  function langFromTimezone(allowed) {
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return pickAllowed(TZ_LANG[tz], allowed);
    } catch (e) {
      return null;
    }
  }

  function langFromNavigator(allowed) {
    var langs = navigator.languages || [navigator.language];
    for (var i = 0; i < langs.length; i++) {
      var hit = pickAllowed(langs[i], allowed);
      if (hit) return hit;
    }
    return null;
  }

  function detectSync(allowed) {
    return (
      langFromTimezone(allowed) ||
      langFromNavigator(allowed) ||
      (allowed && allowed.length ? allowed[0] : "en") ||
      "en"
    );
  }

  function applyLang(code, allowed) {
    var next = pickAllowed(code, allowed) || detectSync(allowed);
    writeSavedLang(next);
    try {
      document.documentElement.lang = next;
    } catch (e) {}
    try {
      global.dispatchEvent(new CustomEvent("nanik:langchange", { detail: { lang: next, source: "geo" } }));
    } catch (e) {}
    return next;
  }

  /**
   * Sync bootstrap for first paint. No-ops if the visitor already chose a language.
   * Returns { lang, shouldRefine }.
   */
  function bootstrap(allowed) {
    if (hasSavedLang()) {
      var saved = readSavedLang();
      var picked = pickAllowed(saved, allowed) || saved;
      try {
        document.documentElement.lang = picked;
      } catch (e) {}
      return { lang: picked, shouldRefine: false };
    }
    return { lang: applyLang(detectSync(allowed), allowed), shouldRefine: true };
  }

  /**
   * Refine with IP country — only for first-time visitors (no prior saved language).
   */
  function refineFromCountry(allowed, onChange) {
    var ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    var timer = setTimeout(function () {
      if (ctrl) ctrl.abort();
    }, 2000);

    return fetch(GEO_URL, {
      credentials: "omit",
      signal: ctrl ? ctrl.signal : undefined,
    })
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .then(function (data) {
        clearTimeout(timer);
        if (!data) return readSavedLang();
        var country = data.country || data.country_code || "";
        var fromCountry = langFromCountry(country, allowed);
        if (!fromCountry) return readSavedLang();
        var current = readSavedLang();
        if (current === fromCountry) return current;
        var next = applyLang(fromCountry, allowed);
        if (typeof onChange === "function") onChange(next, current);
        return next;
      })
      .catch(function () {
        clearTimeout(timer);
        return readSavedLang();
      });
  }

  function markUserChoice() {
    /* Reserved for callers that set language from UI; saved lang already blocks geo. */
  }

  global.NanikGeoLang = {
    STORAGE_KEY: STORAGE_KEY,
    COUNTRY_LANG: COUNTRY_LANG,
    normalizeLang: normalizeLang,
    readSavedLang: readSavedLang,
    writeSavedLang: writeSavedLang,
    hasSavedLang: hasSavedLang,
    langFromCountry: langFromCountry,
    detectSync: detectSync,
    bootstrap: bootstrap,
    refineFromCountry: refineFromCountry,
    applyLang: applyLang,
    markUserChoice: markUserChoice,
  };
})(typeof window !== "undefined" ? window : this);
