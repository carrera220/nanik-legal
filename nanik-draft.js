(function () {
  "use strict";

  var PROMPT_KEY = "nanik-hero-prompt";
  var IMAGE_KEY = "nanik-hero-image";
  var AGE_KEY = "nanik-hero-age";
  var CHILD_KEY = "nanik-child-profile";
  var CHILDREN_KEY = "nanik-child-profiles";
  var ACTIVE_CHILD_KEY = "nanik-active-child-id";
  var SESSION_KEY = "nanik-web-auth-session";

  function readSession() {
    try {
      var raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function sessionUserId() {
    var s = readSession();
    if (s && s.user && s.user.id) return String(s.user.id);
    var token = s && s.access_token;
    if (!token) return "";
    try {
      var part = String(token).split(".")[1] || "";
      part = part.replace(/-/g, "+").replace(/_/g, "/");
      while (part.length % 4) part += "=";
      var payload = JSON.parse(atob(part));
      return payload && payload.sub ? String(payload.sub) : "";
    } catch (e) {
      return "";
    }
  }

  function scopedKey(base) {
    var uid = sessionUserId();
    return uid ? base + ":" + uid : base + ":anon";
  }

  function childrenKey() {
    return scopedKey(CHILDREN_KEY);
  }

  function activeChildKey() {
    return scopedKey(ACTIVE_CHILD_KEY);
  }

  function childKey() {
    return scopedKey(CHILD_KEY);
  }

  function storeGet(key) {
    try {
      return sessionStorage.getItem(key) || localStorage.getItem(key) || "";
    } catch (e) {
      return "";
    }
  }

  function storeSet(key, value) {
    try {
      if (value) {
        sessionStorage.setItem(key, value);
        localStorage.setItem(key, value);
      } else {
        sessionStorage.removeItem(key);
        localStorage.removeItem(key);
      }
    } catch (e) {
      try {
        if (value) sessionStorage.setItem(key, value);
        else sessionStorage.removeItem(key);
      } catch (err) {}
    }
  }

  function getPrompt() {
    return String(storeGet(PROMPT_KEY) || "").trim();
  }

  function setPrompt(text) {
    text = String(text || "").trim();
    storeSet(PROMPT_KEY, text);
    window.NANIK_HERO_PROMPT = text || "";
  }

  function getImage() {
    return storeGet(IMAGE_KEY) || "";
  }

  function setImage(dataUrl) {
    storeSet(IMAGE_KEY, dataUrl || "");
  }

  function getAge() {
    var n = parseInt(storeGet(AGE_KEY), 10);
    return n >= 2 && n <= 16 ? n : null;
  }

  function setAge(age) {
    var n = parseInt(age, 10);
    if (n >= 2 && n <= 16) storeSet(AGE_KEY, String(n));
    else storeSet(AGE_KEY, "");
  }

  function newChildId() {
    return "child_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
  }

  function normalizeChild(raw) {
    if (!raw || typeof raw !== "object") return null;
    var age = parseInt(raw.age, 10);
    if (age < 2 || age > 16) return null;
    var gender = String(raw.gender || "").trim().toLowerCase();
    if (gender !== "girl" && gender !== "boy" && gender !== "unspecified") gender = "";
    var photo = String(raw.photo || "").trim();
    if (photo && photo.indexOf("data:image/") !== 0) photo = "";
    if (photo.length > 1400000) photo = "";
    return {
      id: String(raw.id || "").trim() || newChildId(),
      name: String(raw.name || "").trim().slice(0, 40),
      age: age,
      likes: String(raw.likes || "").trim().slice(0, 200),
      gender: gender,
      photo: photo,
    };
  }

  function readLegacyUnscopedChildren() {
    try {
      var raw = localStorage.getItem(CHILDREN_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.map(normalizeChild).filter(Boolean);
      }
    } catch (e) {}
    try {
      var legacy = localStorage.getItem(CHILD_KEY);
      if (!legacy) return [];
      var one = normalizeChild(JSON.parse(legacy));
      return one ? [one] : [];
    } catch (err) {
      return [];
    }
  }

  function readChildrenRaw() {
    try {
      var raw = localStorage.getItem(childrenKey());
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.map(normalizeChild).filter(Boolean);
        }
      }
    } catch (e) {}
    // One-time migrate old device-wide profiles into this signed-in account.
    var legacy = readLegacyUnscopedChildren();
    if (!legacy.length) return [];
    var activeId = "";
    try {
      activeId = localStorage.getItem(ACTIVE_CHILD_KEY) || (legacy[0] && legacy[0].id) || "";
    } catch (err) {}
    writeChildren(legacy, activeId);
    try {
      localStorage.removeItem(CHILDREN_KEY);
      localStorage.removeItem(ACTIVE_CHILD_KEY);
      localStorage.removeItem(CHILD_KEY);
    } catch (clearErr) {}
    return legacy;
  }

  function writeChildren(list, activeId) {
    var kids = (list || []).map(normalizeChild).filter(Boolean);
    var storeChildren = childrenKey();
    var storeActive = activeChildKey();
    var storeOne = childKey();
    try {
      if (!kids.length) {
        localStorage.removeItem(storeChildren);
        localStorage.removeItem(storeActive);
        localStorage.removeItem(storeOne);
        setAge("");
        return;
      }
      localStorage.setItem(storeChildren, JSON.stringify(kids));
      var active = kids.find(function (kid) { return kid.id === activeId; }) || kids[0];
      localStorage.setItem(storeActive, active.id);
      localStorage.setItem(storeOne, JSON.stringify({
        name: active.name,
        age: active.age,
        id: active.id,
        likes: active.likes || "",
        gender: active.gender || "",
        photo: active.photo || "",
      }));
      setAge(active.age);
      if (active.photo) setImage(active.photo);
    } catch (e) {}
  }

  function getChildren() {
    return readChildrenRaw();
  }

  /** Replace the full local list (used after cloud pull). Keeps photos by id when omitted. */
  function replaceChildren(list, activeId) {
    var prevById = {};
    getChildren().forEach(function (kid) {
      prevById[kid.id] = kid;
    });
    var next = (list || []).map(function (raw) {
      var kid = normalizeChild(raw);
      if (!kid) return null;
      var prev = prevById[kid.id];
      if (prev) {
        if (!kid.photo && prev.photo) kid.photo = prev.photo;
        if (!kid.likes && prev.likes) kid.likes = prev.likes;
        if (!kid.gender && prev.gender) kid.gender = prev.gender;
      }
      return kid;
    }).filter(Boolean);
    writeChildren(next, activeId || (next[0] && next[0].id) || "");
    try {
      window.dispatchEvent(new CustomEvent("nanik:child-profile"));
    } catch (err) {}
    return next;
  }

  function getChild() {
    var kids = getChildren();
    if (!kids.length) return null;
    var activeId = "";
    try {
      activeId = localStorage.getItem(activeChildKey()) || "";
    } catch (e) {}
    var active = kids.find(function (kid) { return kid.id === activeId; }) || kids[0];
    return {
      id: active.id,
      name: active.name,
      age: active.age,
      likes: active.likes || "",
      gender: active.gender || "",
      photo: active.photo || "",
    };
  }

  function setChild(profile) {
    if (!profile) {
      writeChildren([], "");
      try {
        window.dispatchEvent(new CustomEvent("nanik:child-profile"));
      } catch (err) {}
      return null;
    }
    var kids = getChildren();
    var next = normalizeChild(profile);
    if (!next) {
      writeChildren(kids, getChild() && getChild().id);
      try {
        window.dispatchEvent(new CustomEvent("nanik:child-profile"));
      } catch (err) {}
      return null;
    }
    var index = kids.findIndex(function (kid) {
      return kid.id === next.id || (!profile.id && kid.name && kid.name === next.name && kid.age === next.age);
    });
    if (index >= 0) {
      // Preserve photo/likes/gender when caller omits them.
      var prev = kids[index];
      next.id = prev.id;
      if (!next.likes && prev.likes) next.likes = prev.likes;
      if (!next.gender && prev.gender) next.gender = prev.gender;
      if (!next.photo && prev.photo) next.photo = prev.photo;
      kids[index] = next;
    } else {
      kids.push(next);
    }
    writeChildren(kids, next.id);
    try {
      window.dispatchEvent(new CustomEvent("nanik:child-profile"));
    } catch (err) {}
    return next;
  }

  function selectChild(id) {
    var kids = getChildren();
    var match = kids.find(function (kid) { return kid.id === id; });
    if (!match) return null;
    writeChildren(kids, match.id);
    try {
      window.dispatchEvent(new CustomEvent("nanik:child-profile"));
    } catch (err) {}
    return match;
  }

  function removeChild(id) {
    var kids = getChildren().filter(function (kid) { return kid.id !== id; });
    var active = getChild();
    writeChildren(kids, active && active.id === id ? "" : (active && active.id) || "");
    try {
      window.dispatchEvent(new CustomEvent("nanik:child-profile"));
    } catch (err) {}
    return kids;
  }

  function hasDraft() {
    return !!(getPrompt() || getImage());
  }

  function dashboardUrl(panel) {
    var base = /\/hy\//.test(location.pathname || "") ? "../dashboard.html" : "dashboard.html";
    var name = String(panel || "").trim().toLowerCase();
    if (name === "create" || name === "library" || name === "voices" || name === "kids" || name === "account") {
      return base + "?panel=" + encodeURIComponent(name);
    }
    return base;
  }

  function writeAuthSession(session) {
    try {
      if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      else localStorage.removeItem(SESSION_KEY);
    } catch (e) {}
  }

  function parseHashParams(hash) {
    var out = {};
    String(hash || "")
      .replace(/^#/, "")
      .split("&")
      .forEach(function (part) {
        if (!part) return;
        var i = part.indexOf("=");
        if (i === -1) out[decodeURIComponent(part)] = "";
        else out[decodeURIComponent(part.slice(0, i))] = decodeURIComponent(part.slice(i + 1).replace(/\+/g, " "));
      });
    return out;
  }

  function clearAuthFromUrl() {
    try {
      if (history.replaceState) {
        history.replaceState(null, "", location.pathname + (location.search || "").replace(/[?&](error|error_description|code)=[^&]*/g, "").replace(/^&/, "?").replace(/\?$/, ""));
      }
    } catch (e) {}
  }

  function consumeAuthReturn() {
    var params = parseHashParams(location.hash);
    var search = new URLSearchParams(location.search || "");
    var error = params.error || search.get("error");
    var desc = params.error_description || search.get("error_description") || "";
    if (error) {
      clearAuthFromUrl();
      return { captured: true, error: desc || error };
    }
    var access = params.access_token || search.get("access_token");
    var refresh = params.refresh_token || search.get("refresh_token") || "";
    var expiresIn = parseInt(params.expires_in || search.get("expires_in"), 10) || 3600;
    if (access) {
      clearAuthFromUrl();
      var session = {
        access_token: access,
        refresh_token: refresh,
        expires_at: Date.now() + expiresIn * 1000,
      };
      writeAuthSession(session);
      return { captured: true, session: session };
    }
    // PKCE: leave ?code= for signup.js / signin.js to exchange.
    if (search.get("code")) return { captured: true, pendingCode: true };
    return null;
  }

  var authReturn = consumeAuthReturn();

  function goDashboard(panel) {
    location.replace(dashboardUrl(panel));
  }

  function compressImage(file, maxEdge, quality) {
    maxEdge = maxEdge || 1200;
    quality = quality || 0.78;
    return new Promise(function (resolve, reject) {
      if (!file || !file.type || file.type.indexOf("image/") !== 0) {
        reject(new Error("not-image"));
        return;
      }
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        URL.revokeObjectURL(url);
        var w = img.naturalWidth || img.width;
        var h = img.naturalHeight || img.height;
        var scale = Math.min(1, maxEdge / Math.max(w, h));
        var cw = Math.max(1, Math.round(w * scale));
        var ch = Math.max(1, Math.round(h * scale));
        var canvas = document.createElement("canvas");
        canvas.width = cw;
        canvas.height = ch;
        var ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("canvas"));
          return;
        }
        ctx.drawImage(img, 0, 0, cw, ch);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        reject(new Error("load"));
      };
      img.src = url;
    });
  }

  window.NANIK_DRAFT = {
    PROMPT_KEY: PROMPT_KEY,
    IMAGE_KEY: IMAGE_KEY,
    readSession: readSession,
    getPrompt: getPrompt,
    setPrompt: setPrompt,
    getImage: getImage,
    setImage: setImage,
    getAge: getAge,
    setAge: setAge,
    getChild: getChild,
    setChild: setChild,
    getChildren: getChildren,
    replaceChildren: replaceChildren,
    selectChild: selectChild,
    removeChild: removeChild,
    hasDraft: hasDraft,
    dashboardUrl: dashboardUrl,
    goDashboard: goDashboard,
    authReturn: authReturn,
    compressImage: compressImage,
  };
})();
