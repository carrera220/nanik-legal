(function (root) {
  "use strict";

  var MIXPANEL_TOKEN = "84b6cdfa06c491b53b344e7bbc9f22a1";
  var MIXPANEL_URL = "https://api-eu.mixpanel.com/track?ip=1&verbose=1";
  var DISTINCT_KEY = "nanik.mixpanel.distinct_id";
  var ATTR_KEY = "nanik.attribution";

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

  function encodeMixpanelData(payload) {
    var json = JSON.stringify(payload);
    try {
      return btoa(unescape(encodeURIComponent(json)));
    } catch (e) {
      return btoa(json);
    }
  }

  function queryParam(name) {
    try {
      return new URLSearchParams(location.search || "").get(name) || "";
    } catch (e) {
      return "";
    }
  }

  function referrerHost() {
    try {
      var ref = document.referrer || "";
      if (!ref) return "";
      return new URL(ref).hostname.replace(/^www\./, "").toLowerCase();
    } catch (e) {
      return "";
    }
  }

  function isSameSite(host) {
    if (!host) return false;
    return host === "nanik.app" || host === "www.nanik.app" || host.indexOf("nanik-legal") !== -1;
  }

  function isChatGpt(source, host) {
    var s = String(source || "").toLowerCase();
    var h = String(host || "").toLowerCase();
    return (
      s === "chatgpt.com" ||
      s.indexOf("chatgpt") !== -1 ||
      h === "chatgpt.com" ||
      h === "chat.openai.com" ||
      h.indexOf("chatgpt") !== -1
    );
  }

  function readStoredAttr() {
    try {
      var raw = localStorage.getItem(ATTR_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function writeStoredAttr(attr) {
    try {
      localStorage.setItem(ATTR_KEY, JSON.stringify(attr));
    } catch (e) {}
  }

  function currentAttribution() {
    var utmSource = queryParam("utm_source").trim();
    var utmMedium = queryParam("utm_medium").trim();
    var utmCampaign = queryParam("utm_campaign").trim();
    var utmContent = queryParam("utm_content").trim();
    var utmTerm = queryParam("utm_term").trim();
    var host = referrerHost();
    var chatgpt = isChatGpt(utmSource, host);
    if (chatgpt && !utmSource) utmSource = "chatgpt.com";
    if (chatgpt && !utmMedium) utmMedium = "referral";
    return {
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_content: utmContent,
      utm_term: utmTerm,
      referrer: document.referrer || "",
      referrer_host: host,
      chatgpt_referral: chatgpt,
    };
  }

  function captureAttribution() {
    var current = currentAttribution();
    var stored = readStoredAttr();
    var hasSignal =
      current.utm_source ||
      current.utm_campaign ||
      current.chatgpt_referral ||
      (current.referrer_host && !isSameSite(current.referrer_host));
    if (hasSignal && !stored) {
      stored = Object.assign({ first_touch_at: new Date().toISOString() }, current);
      writeStoredAttr(stored);
    }
    return { current: current, first: stored || current };
  }

  function attributionProps() {
    var pack = captureAttribution();
    var first = pack.first || {};
    var current = pack.current || {};
    var props = {};
    if (first.utm_source) props.utm_source = first.utm_source;
    if (first.utm_medium) props.utm_medium = first.utm_medium;
    if (first.utm_campaign) props.utm_campaign = first.utm_campaign;
    if (first.utm_content) props.utm_content = first.utm_content;
    if (first.utm_term) props.utm_term = first.utm_term;
    if (first.referrer_host) props.referrer_host = first.referrer_host;
    if (first.referrer) props.initial_referrer = first.referrer;
    props.chatgpt_referral = !!(first.chatgpt_referral || current.chatgpt_referral);
    if (current.utm_source) props.latest_utm_source = current.utm_source;
    if (current.referrer_host) props.latest_referrer_host = current.referrer_host;
    return props;
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
    if (path.indexOf("/dashboard") !== -1) return "Dashboard";
    if (path.indexOf("/signin") !== -1) return "Sign in";
    if (path.indexOf("/bedtime-stories-in-your-voice") !== -1) return "Stories in your voice";
    if (path.indexOf("/bedtime-fears") !== -1) return "Bedtime fears";
    if (path.indexOf("/stories-about-feelings") !== -1) return "Feelings";
    if (path.indexOf("/stories-for-new-experiences") !== -1) return "New experiences";
    if (path.indexOf("/educational-stories") !== -1) return "Educational stories";
    return path;
  }

  function track(eventName, props) {
    if (!eventName) return;
    var properties = Object.assign(
      {
        token: MIXPANEL_TOKEN,
        distinct_id: distinctId(),
        time: Math.floor(Date.now() / 1000),
        mp_lib: "nanik_web",
        channel: "website",
        page: pageName(),
        path: location.pathname || "/",
      },
      attributionProps(),
      props && typeof props === "object" ? props : {}
    );
    var payload = [{ event: String(eventName), properties: properties }];
    var url = MIXPANEL_URL + "&data=" + encodeURIComponent(encodeMixpanelData(payload));
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(url)) return;
    } catch (e) {}
    try {
      var img = new Image();
      img.src = url;
    } catch (e2) {}
  }

  function bootPageView() {
    if (root.__nanikPageViewSent) return;
    root.__nanikPageViewSent = true;
    captureAttribution();
    track("page_view", {
      landing_url: location.href,
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootPageView);
  } else {
    bootPageView();
  }

  root.NanikAnalytics = {
    track: track,
    distinctId: distinctId,
    attribution: attributionProps,
    pageName: pageName,
  };
})(typeof window !== "undefined" ? window : globalThis);
