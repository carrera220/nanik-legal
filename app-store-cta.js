/**
 * App Store CTAs inside Meta in-app browsers (Instagram / Facebook) on iOS.
 *
 * Instagram's WKWebView often swallows https://apps.apple.com and itms-apps
 * taps (no error — nothing happens). On Instagram/Threads we hand off via
 * Instagram's own external-browser scheme so Safari opens the App Store URL.
 * Facebook falls back to x-safari-https. A short tip covers the case where
 * Meta blocks schemes entirely (··· → Open in browser).
 */
(function () {
  "use strict";

  var HTTPS_APP_STORE = "https://apps.apple.com/app/id6762894314";
  var ITMS_APP_STORE = "itms-apps://apps.apple.com/app/id6762894314";

  function ua() {
    return navigator.userAgent || "";
  }

  function detect() {
    var s = ua();
    var isInstagram = /Instagram|Threads/i.test(s);
    var isFacebook = /FBAN|FBAV|FB_IAB|Messenger/i.test(s);
    var isIOS =
      /iPhone|iPad|iPod/i.test(s) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    return {
      isInstagram: isInstagram,
      isFacebook: isFacebook,
      isMeta: isInstagram || isFacebook,
      isIOS: isIOS,
    };
  }

  function httpsStoreUrl(anchor) {
    var stored = anchor && anchor.getAttribute("data-store-url");
    if (stored) return stored;
    var href = (anchor && anchor.getAttribute("href")) || "";
    if (href.indexOf("apps.apple.com") !== -1 && href.indexOf("http") === 0) {
      return href;
    }
    return HTTPS_APP_STORE;
  }

  function escapeUrl(httpsUrl, det) {
    if (det.isInstagram) {
      return "instagram://extbrowser/?url=" + encodeURIComponent(httpsUrl);
    }
    // x-safari-https://apps.apple.com/...
    return "x-safari-" + httpsUrl;
  }

  function isAppStoreAnchor(el) {
    if (!el || el.tagName !== "A") return false;
    var href = el.getAttribute("href") || "";
    var stored = el.getAttribute("data-store-url") || "";
    return (
      href.indexOf("apps.apple.com") !== -1 ||
      stored.indexOf("apps.apple.com") !== -1 ||
      href.indexOf("instagram://extbrowser") === 0 ||
      href.indexOf("x-safari-https://apps.apple.com") === 0 ||
      href.indexOf("itms-apps://") === 0
    );
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

  function tryNavigate(url) {
    try {
      location.href = url;
      return;
    } catch (e) {}
    try {
      window.location.assign(url);
    } catch (e2) {}
  }

  function openFromMeta(event, anchor, det) {
    event.preventDefault();
    event.stopPropagation();

    var httpsUrl = httpsStoreUrl(anchor);
    var primary = escapeUrl(httpsUrl, det);
    var startHref = location.href;
    var settled = false;

    function settle() {
      settled = true;
    }

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

    // 1) Instagram/Threads: app-owned extbrowser → Safari → App Store.
    //    Facebook: x-safari-https.
    tryNavigate(primary);

    // 2) Native App Store scheme if still stuck.
    window.setTimeout(function () {
      if (settled || leavePageSoon(startHref)) return;
      tryNavigate(ITMS_APP_STORE);

      // 3) Last resort: https (may still no-op in IG, but tip is visible).
      window.setTimeout(function () {
        if (settled || leavePageSoon(startHref)) return;
        settle();
        tryNavigate(httpsUrl);
        emphasizeTip();
      }, 700);
    }, 600);
  }

  function pageLang() {
    var lang = (document.documentElement && document.documentElement.lang) || "";
    lang = String(lang).toLowerCase();
    if (lang.indexOf("hy") === 0) return "hy";
    var path = location.pathname || "";
    if (/(^|\/)hy(\.html)?$/.test(path) || path.indexOf("/hy/") !== -1) return "hy";
    return "en";
  }

  function tipText() {
    if (pageLang() === "hy") {
      return "Instagram-ում չի՞ բացվում։ Վերևի ··· ընտրիր Open in browser, հետո Download";
    }
    return "Stuck in Instagram? Tap ··· → Open in browser, then Download";
  }

  function emphasizeTip() {
    var tip = document.getElementById("app-store-iab-tip");
    if (!tip) return;
    tip.classList.add("is-urgent");
    try {
      tip.scrollIntoView({ block: "nearest", behavior: "smooth" });
    } catch (e) {}
  }

  function showTip() {
    if (document.getElementById("app-store-iab-tip")) return;
    var host =
      document.querySelector(".hero-cta") ||
      document.querySelector(".languages-hero-cta") ||
      document.querySelector(".download-app-cta");
    if (!host || !host.parentNode) return;

    var tip = document.createElement("p");
    tip.id = "app-store-iab-tip";
    tip.className = "app-store-iab-tip";
    tip.setAttribute("role", "note");
    tip.textContent = tipText();
    host.insertAdjacentElement("afterend", tip);
  }

  function rewriteAnchors(det) {
    var nodes = document.querySelectorAll('a[href*="apps.apple.com"]');
    for (var i = 0; i < nodes.length; i++) {
      var a = nodes[i];
      var httpsUrl = a.getAttribute("href") || HTTPS_APP_STORE;
      if (!a.getAttribute("data-store-url")) {
        a.setAttribute("data-store-url", httpsUrl);
      }
      // Prefer a native scheme href so the user gesture is a real navigation.
      a.setAttribute("href", escapeUrl(httpsUrl, det));
    }
  }

  var MIXPANEL_TOKEN = "84b6cdfa06c491b53b344e7bbc9f22a1";
  var MIXPANEL_URL = "https://api-eu.mixpanel.com/track?ip=1&verbose=1";
  var DISTINCT_KEY = "nanik.mixpanel.distinct_id";

  function distinctId() {
    try {
      var existing = localStorage.getItem(DISTINCT_KEY);
      if (existing && existing.trim()) return existing.trim();
      var next =
        "nanik_web_" +
        Date.now().toString(36) +
        "_" +
        Math.random().toString(36).slice(2, 10);
      localStorage.setItem(DISTINCT_KEY, next);
      return next;
    } catch (e) {
      return "nanik_web_ephemeral_" + Date.now().toString(36);
    }
  }

  function pageName() {
    var path = (location.pathname || "/").replace(/\/+$/, "") || "/";
    if (path === "/" || path === "/index.html") return "Home";
    if (path === "/hy.html" || path === "/hy") return "Home hy";
    if (path.indexOf("/stories") !== -1) return "Stories";
    if (path.indexOf("/languages") !== -1) return "Languages";
    if (path.indexOf("/pricing") !== -1) return "Pricing";
    if (path.indexOf("/support") !== -1) return "Support";
    if (path.indexOf("/invite") !== -1) return "Invite";
    if (path.indexOf("/privacy") !== -1) return "Privacy";
    if (path.indexOf("/terms") !== -1) return "Terms";
    return path;
  }

  function clickSource(anchor) {
    if (!anchor || !anchor.closest) return pageName();
    if (anchor.closest("#voice-magic-modal") || anchor.classList.contains("voice-magic-app-btn")) {
      return "Voice magic";
    }
    if (anchor.closest("#download-app-modal")) return "Stories";
    if (anchor.closest("footer") || anchor.closest(".store-cta--footer")) return "Footer";
    if (anchor.closest(".languages-hero-cta")) return "Languages";
    if (anchor.closest(".hero-cta") || anchor.closest(".download-cta")) return "Hero";
    return pageName();
  }

  function encodeMixpanelData(payload) {
    var json = JSON.stringify(payload);
    try {
      return btoa(unescape(encodeURIComponent(json)));
    } catch (e) {
      return btoa(json);
    }
  }

  function trackAppStoreClick(anchor) {
    var properties = {
      token: MIXPANEL_TOKEN,
      distinct_id: distinctId(),
      time: Math.floor(Date.now() / 1000),
      mp_lib: "nanik_web",
      channel: "website",
      source: clickSource(anchor),
      page: pageName(),
    };
    var payload = [{ event: "Download from App Store", properties: properties }];
    var url = MIXPANEL_URL + "&data=" + encodeURIComponent(encodeMixpanelData(payload));
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(url)) return;
    } catch (e) {}
    try {
      var img = new Image();
      img.src = url;
    } catch (e2) {}
  }

  function onClick(event) {
    if (event.button != null && event.button !== 0) return;

    var anchor = findAppStoreAnchor(event.target);
    if (!anchor) return;

    trackAppStoreClick(anchor);

    var det = detect();
    if (!det.isMeta || !det.isIOS) return;
    if (event.defaultPrevented) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    openFromMeta(event, anchor, det);
  }

  var det = detect();

  function boot() {
    if (!det.isMeta || !det.isIOS) return;
    rewriteAnchors(det);
    showTip();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  document.addEventListener("click", onClick, true);
})();
