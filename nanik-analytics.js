(function (root) {
  "use strict";

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

  function encodeMixpanelData(payload) {
    var json = JSON.stringify(payload);
    try {
      return btoa(unescape(encodeURIComponent(json)));
    } catch (e) {
      return btoa(json);
    }
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
      },
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

  root.NanikAnalytics = {
    track: track,
    distinctId: distinctId,
  };
})(typeof window !== "undefined" ? window : globalThis);
