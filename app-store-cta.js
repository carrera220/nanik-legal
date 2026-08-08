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

  function onClick(event) {
    if (event.defaultPrevented) return;
    if (event.button != null && event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    var anchor = findAppStoreAnchor(event.target);
    if (!anchor) return;

    openFromMeta(event, anchor, detect());
  }

  var det = detect();
  if (!det.isMeta || !det.isIOS) return;

  function boot() {
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
