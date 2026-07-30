/**
 * Redirect English homepage visitors in Armenia to the Armenian homepage.
 * Respects an explicit language choice (localStorage / ?lang=).
 * Loaded synchronously in index.html <head> to avoid a flash of English.
 */
(function () {
  var STORAGE_KEY = 'nanik-site-lang';
  var HY_PATH = '/hy.html';

  function currentFile() {
    var path = (location.pathname || '/').replace(/\/+$/, '');
    var file = path.split('/').pop();
    return file || 'index.html';
  }

  function isEnglishHome() {
    var file = currentFile();
    return file === 'index.html' || file === '';
  }

  if (!isEnglishHome()) return;

  function normalizeLang(code) {
    if (!code) return null;
    code = String(code).toLowerCase().replace('_', '-').split('-')[0];
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

  function goHy() {
    writeSavedLang('hy');
    var target = HY_PATH + (location.search || '') + (location.hash || '');
    // Avoid appending another ?lang= if we already have one.
    location.replace(target);
  }

  // Explicit override via URL (?lang=en|hy) — used by the English link on hy.html.
  try {
    var params = new URLSearchParams(location.search || '');
    var forced = normalizeLang(params.get('lang'));
    if (forced === 'en' || forced === 'hy') {
      writeSavedLang(forced);
      // Clean the query so bookmarks stay tidy.
      try {
        params.delete('lang');
        var clean = params.toString();
        var next =
          location.pathname +
          (clean ? '?' + clean : '') +
          (location.hash || '');
        history.replaceState(null, '', next);
      } catch (e) {}
      if (forced === 'hy') {
        goHy();
        return;
      }
      return;
    }
  } catch (e) {}

  var saved = readSavedLang();
  if (saved === 'hy') {
    goHy();
    return;
  }
  // User previously chose a non-Armenian UI language — do not override.
  if (saved && saved !== 'hy') return;

  function likelyArmeniaSync() {
    try {
      if (Intl.DateTimeFormat().resolvedOptions().timeZone === 'Asia/Yerevan') {
        return true;
      }
    } catch (e) {}
    var langs = navigator.languages || [navigator.language];
    for (var i = 0; i < langs.length; i++) {
      if (normalizeLang(langs[i]) === 'hy') return true;
    }
    return false;
  }

  if (likelyArmeniaSync()) {
    goHy();
    return;
  }

  // Async IP fallback for visitors whose timezone/language are not Armenian
  // but whose network location is Armenia (e.g. English browser in Yerevan).
  var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
  var timer = setTimeout(function () {
    if (ctrl) ctrl.abort();
  }, 1800);

  fetch('https://get.geojs.io/v1/ip/country.json', {
    credentials: 'omit',
    signal: ctrl ? ctrl.signal : undefined,
  })
    .then(function (r) {
      return r.ok ? r.json() : null;
    })
    .then(function (data) {
      clearTimeout(timer);
      if (!data) return;
      var code = String(data.country || data.country_code || '').toUpperCase();
      if (code === 'AM') goHy();
    })
    .catch(function () {
      clearTimeout(timer);
    });
})();
