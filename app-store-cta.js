/**
 * App Store CTA helper for Meta in-app browsers (Instagram / Facebook).
 * https App Store links often stall in those WKWebViews; open via itms-apps
 * on user gesture, with short fallbacks to Safari escape and https.
 */
(function () {
  "use strict";

  var HTTPS_APP_STORE = "https://apps.apple.com/app/id6762894314";
  var ITMS_APP_STORE = "itms-apps://apps.apple.com/app/id6762894314";
  var SAFARI_ESCAPE = "x-safari-https://apps.apple.com/app/id6762894314";
  var FALLBACK_MS = 900;
  var SAFARI_FALLBACK_MS = 1400;

  function ua() {
    return navigator.userAgent || "";
  }

  function isMetaInAppBrowser() {
    var s = ua();
    return /Instagram|FBAN|FBAV|FB_IAB/i.test(s);
  }

  function isIOS() {
    var s = ua();
    return /iPhone|iPad|iPod/i.test(s) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  }

  function isAppStoreAnchor(el) {
    if (!el || el.tagName !== "A") return false;
    var href = el.getAttribute("href") || "";
    return href.indexOf("apps.apple.com") !== -1;
  }

  function findAppStoreAnchor(target) {
    var node = target;
    while (node && node !== document) {
      if (isAppStoreAnchor(node)) return node;
      node = node.parentNode;
    }
    return null;
  }

  function leavePageSoon(startHref) {
    try {
      return document.hidden || location.href !== startHref;
    } catch (e) {
      return document.hidden;
    }
  }

  function openAppStoreFromMeta(event, anchor) {
    event.preventDefault();
    event.stopPropagation();

    var httpsUrl = anchor.getAttribute("href") || HTTPS_APP_STORE;
    var startHref = location.href;
    var settled = false;

    function settle() {
      settled = true;
    }

    // Primary: native App Store scheme (works best from Meta IAB on iOS).
    try {
      location.href = ITMS_APP_STORE;
    } catch (e) {
      /* continue to fallbacks */
    }

    window.setTimeout(function () {
      if (settled || leavePageSoon(startHref)) return;

      // Secondary: request opening in Safari when still stuck in the IAB.
      try {
        location.href = SAFARI_ESCAPE;
      } catch (e2) {
        /* continue */
      }

      window.setTimeout(function () {
        if (settled || leavePageSoon(startHref)) return;
        settle();
        try {
          location.href = httpsUrl;
        } catch (e3) {
          window.location.assign(httpsUrl);
        }
      }, SAFARI_FALLBACK_MS - FALLBACK_MS);
    }, FALLBACK_MS);

    document.addEventListener(
      "visibilitychange",
      function onVis() {
        if (document.hidden) {
          settle();
          document.removeEventListener("visibilitychange", onVis);
        }
      },
      false
    );
  }

  function onClick(event) {
    if (event.defaultPrevented) return;
    if (event.button != null && event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    var anchor = findAppStoreAnchor(event.target);
    if (!anchor) return;

    if (!isMetaInAppBrowser()) return;
    // Meta IAB App Store breakage is primarily an iOS WKWebView issue.
    if (!isIOS()) return;

    openAppStoreFromMeta(event, anchor);
  }

  document.addEventListener("click", onClick, true);
})();
