(function () {
  "use strict";

  var SESSION_KEY = "nanik-web-auth-session";
  var PKCE_KEY = "nanik-pkce-verifier";
  var PROMPT_KEY = "nanik-hero-prompt";
  var FALLBACK_IMG = "images/feature-hero-ai.jpg";

  function api() {
    return window.NANIK_API || {};
  }

  function supabaseUrl() {
    return String(api().supabaseUrl || "https://zljowsxavbpqfdskekwd.supabase.co").replace(/\/$/, "");
  }

  function anonKey() {
    return (
      api().supabaseAnonKey ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpsam93c3hhdmJwcWZkc2tla3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MjM2NjgsImV4cCI6MjA5MjE5OTY2OH0.sGswPfq4uBKgYsp2b5JNU-mETXqLCGpooVbLmUlgXi4"
    );
  }

  function t(key) {
    var i18n = window.NanikI18n;
    if (i18n && typeof i18n.t === "function") return i18n.t(key);
    var el = document.querySelector("[data-i18n='" + key + "']");
    return (el && el.textContent) || key;
  }

  function readSession() {
    try {
      var raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function writeSession(session) {
    try {
      if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      else localStorage.removeItem(SESSION_KEY);
    } catch (e) {}
  }

  function displayName(user) {
    if (!user) return "";
    var meta = user.user_metadata || {};
    var name = meta.full_name || meta.name || meta.given_name || "";
    if (name) return String(name).split(" ")[0];
    var email = user.email || "";
    return email ? email.split("@")[0] : "";
  }

  function parseHashParams(hash) {
    var out = {};
    String(hash || "")
      .replace(/^#/, "")
      .split("&")
      .forEach(function (part) {
        if (!part) return;
        var i = part.indexOf("=");
        try {
          if (i === -1) out[decodeURIComponent(part)] = "";
          else out[decodeURIComponent(part.slice(0, i))] = decodeURIComponent(part.slice(i + 1).replace(/\+/g, " "));
        } catch (err) {}
      });
    return out;
  }

  function clearAuthFromUrl() {
    try {
      if (!history.replaceState) return;
      var params = new URLSearchParams(location.search || "");
      ["error", "error_description", "code", "state"].forEach(function (k) {
        params.delete(k);
      });
      var q = params.toString();
      history.replaceState(null, "", location.pathname + (q ? "?" + q : ""));
    } catch (e) {}
  }

  function b64urlFromBytes(bytes) {
    var str = "";
    var arr = bytes instanceof ArrayBuffer ? new Uint8Array(bytes) : bytes;
    for (var i = 0; i < arr.length; i++) str += String.fromCharCode(arr[i]);
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  function randomVerifier() {
    var bytes = new Uint8Array(32);
    if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(bytes);
    else for (var i = 0; i < bytes.length; i++) bytes[i] = (Math.random() * 256) | 0;
    return b64urlFromBytes(bytes);
  }

  function sha256B64Url(text) {
    if (!window.crypto || !crypto.subtle) return Promise.reject(new Error("no-subtle"));
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)).then(b64urlFromBytes);
  }

  function userFromAccessToken(accessToken) {
    try {
      var part = String(accessToken || "").split(".")[1];
      if (!part) return null;
      var json = part.replace(/-/g, "+").replace(/_/g, "/");
      while (json.length % 4) json += "=";
      var payload = JSON.parse(atob(json));
      if (!payload || !payload.sub) return null;
      return {
        id: payload.sub,
        email: payload.email || "",
        user_metadata: payload.user_metadata || {},
        app_metadata: payload.app_metadata || {},
      };
    } catch (e) {
      return null;
    }
  }

  function captureOAuthReturn() {
    var params = parseHashParams(location.hash);
    var search = new URLSearchParams(location.search || "");
    var error = params.error || search.get("error");
    var desc = params.error_description || search.get("error_description") || "";
    if (error) {
      clearAuthFromUrl();
      return { error: desc || error };
    }
    var access = params.access_token || search.get("access_token");
    var refresh = params.refresh_token || search.get("refresh_token") || "";
    var expiresIn = parseInt(params.expires_in || search.get("expires_in"), 10) || 3600;
    if (access) {
      clearAuthFromUrl();
      return {
        access_token: access,
        refresh_token: refresh,
        expires_at: Date.now() + expiresIn * 1000,
      };
    }
    var code = search.get("code");
    if (code) return { code: code };
    return null;
  }

  function exchangePkceCode(code) {
    var verifier = "";
    try {
      verifier = localStorage.getItem(PKCE_KEY) || sessionStorage.getItem(PKCE_KEY) || "";
    } catch (e) {}
    if (!verifier) {
      return Promise.reject(
        new Error("Apple/Google sign-in was interrupted (missing login key). Please try again.")
      );
    }
    return fetch(supabaseUrl() + "/auth/v1/token?grant_type=pkce", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey(),
        Authorization: "Bearer " + anonKey(),
      },
      body: JSON.stringify({
        auth_code: code,
        code_verifier: verifier,
      }),
    }).then(function (res) {
      return res.text().then(function (text) {
        var data = {};
        try {
          data = text ? JSON.parse(text) : {};
        } catch (e) {}
        if (!res.ok || !data.access_token) {
          var msg = data.error_description || data.msg || data.error || "oauth_exchange_failed";
          throw new Error(String(msg));
        }
        try {
          localStorage.removeItem(PKCE_KEY);
          sessionStorage.removeItem(PKCE_KEY);
        } catch (e) {}
        return sessionFromToken(data);
      });
    });
  }

  function authHeaders(accessToken) {
    return {
      apikey: anonKey(),
      Authorization: "Bearer " + (accessToken || anonKey()),
    };
  }

  function fetchUser(accessToken) {
    return fetch(supabaseUrl() + "/auth/v1/user", {
      headers: authHeaders(accessToken),
    }).then(function (res) {
      if (!res.ok) throw new Error("user " + res.status);
      return res.json();
    });
  }

  function refreshSession(session) {
    if (!session || !session.refresh_token) return Promise.reject(new Error("no refresh"));
    return fetch(supabaseUrl() + "/auth/v1/token?grant_type=refresh_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey(),
        Authorization: "Bearer " + anonKey(),
      },
      body: JSON.stringify({ refresh_token: session.refresh_token }),
    }).then(function (res) {
      if (!res.ok) throw new Error("refresh " + res.status);
      return res.json();
    }).then(function (data) {
      var next = {
        access_token: data.access_token,
        refresh_token: data.refresh_token || session.refresh_token,
        expires_at: Date.now() + (parseInt(data.expires_in, 10) || 3600) * 1000,
        user: data.user || session.user || null,
      };
      writeSession(next);
      return next;
    });
  }

  function sessionFromToken(data) {
    if (!data || !data.access_token) return null;
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token || "",
      expires_at: Date.now() + (parseInt(data.expires_in, 10) || 3600) * 1000,
      user: data.user || null,
    };
  }

  function ensureSessionUser(session) {
    if (!session || !session.access_token) return Promise.resolve(null);
    if (session.user && (session.user.email || session.user.id)) {
      writeSession(session);
      return Promise.resolve(session);
    }
    return fetchUser(session.access_token)
      .then(function (user) {
        session.user = user;
        writeSession(session);
        return session;
      })
      .catch(function () {
        var fallback = userFromAccessToken(session.access_token);
        if (fallback) session.user = fallback;
        writeSession(session);
        return session;
      });
  }

  function loadSession() {
    var captured = captureOAuthReturn();
    if (captured && captured.error) {
      window.__NANIK_SIGNIN_ERROR = captured.error;
    }
    if (captured && captured.code) {
      return exchangePkceCode(captured.code)
        .then(function (session) {
          clearAuthFromUrl();
          return ensureSessionUser(session);
        })
        .catch(function (err) {
          clearAuthFromUrl();
          window.__NANIK_SIGNIN_ERROR = (err && err.message) || "Could not finish Apple/Google sign-in.";
          return null;
        });
    }
    var pending = captured && captured.access_token ? captured : readSession();
    if (!pending || !pending.access_token) return Promise.resolve(null);
    var needsRefresh = !pending.expires_at || pending.expires_at < Date.now() + 15000;
    var chain = needsRefresh && pending.refresh_token
      ? refreshSession(pending).catch(function () { return pending; })
      : Promise.resolve(pending);
    return chain.then(ensureSessionUser).catch(function () {
      return null;
    });
  }

  function startOAuth(provider) {
    var redirectTo = location.origin + location.pathname;
    var verifier = randomVerifier();
    try {
      localStorage.setItem(PKCE_KEY, verifier);
      sessionStorage.setItem(PKCE_KEY, verifier);
    } catch (e) {}

    function goAuthorize(extra) {
      location.href =
        supabaseUrl() +
        "/auth/v1/authorize?provider=" +
        encodeURIComponent(provider) +
        "&redirect_to=" +
        encodeURIComponent(redirectTo) +
        (extra || "");
    }

    sha256B64Url(verifier)
      .then(function (challenge) {
        goAuthorize(
          "&code_challenge=" +
            encodeURIComponent(challenge) +
            "&code_challenge_method=s256"
        );
      })
      .catch(function () {
        try {
          localStorage.removeItem(PKCE_KEY);
          sessionStorage.removeItem(PKCE_KEY);
        } catch (e) {}
        goAuthorize("");
      });
  }

  function signOut(session) {
    var token = session && session.access_token;
    var done = token
      ? fetch(supabaseUrl() + "/auth/v1/logout", {
          method: "POST",
          headers: authHeaders(token),
        }).catch(function () {})
      : Promise.resolve();
    return done.then(function () {
      writeSession(null);
    });
  }

  function authPost(path, body) {
    return fetch(supabaseUrl() + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey(),
        Authorization: "Bearer " + anonKey(),
      },
      body: JSON.stringify(body),
    }).then(function (res) {
      return res.text().then(function (text) {
        var data = {};
        try { data = text ? JSON.parse(text) : {}; } catch (e) {}
        return { ok: res.ok, status: res.status, data: data };
      });
    });
  }

  function errorMessage(data, fallback) {
    var raw = (data && (data.error_description || data.msg || data.error || data.message)) || "";
    raw = String(raw);
    var lower = raw.toLowerCase();
    if (lower.indexOf("email not confirmed") !== -1) return t("signin.confirm");
    if (lower.indexOf("already registered") !== -1) return t("signin.exists");
    if (lower.indexOf("invalid login") !== -1) return t("signin.badPass");
    return raw || fallback || t("signin.error");
  }

  function showStatus(message, isError) {
    var status = document.getElementById("signin-status");
    if (!status) return;
    if (!message) {
      status.hidden = true;
      status.textContent = "";
      status.classList.remove("is-error");
      return;
    }
    status.hidden = false;
    status.textContent = message;
    status.classList.toggle("is-error", !!isError);
  }

  function setBusy(busy) {
    var form = document.getElementById("signin-email-form");
    var continueBtn = document.getElementById("signin-continue");
    var magicBtn = document.getElementById("signin-magic");
    if (form) form.classList.toggle("is-busy", busy);
    [continueBtn, magicBtn].forEach(function (btn) {
      if (btn) btn.disabled = busy;
    });
  }

  function paint(session) {
    var user = session && session.user;
    var guest = document.getElementById("signin-guest");
    var signed = document.getElementById("signin-signed");
    var title = document.getElementById("signin-title");
    var lead = document.getElementById("signin-lead");
    var name = displayName(user);

    if (guest) guest.hidden = !!user;
    if (signed) signed.hidden = !user;
    if (title) title.textContent = user ? t("signin.welcome") : t("signin.title");
    if (lead) {
      lead.textContent = user
        ? (name ? t("signin.signedLeadNamed").replace("{name}", name) : t("signin.signedLead"))
        : t("signin.lead");
    }
  }

  function paintPrompt() {
    var el = document.getElementById("signin-prompt");
    if (!el) return;
    var text = "";
    try { text = sessionStorage.getItem(PROMPT_KEY) || ""; } catch (e) {}
    if (!text) {
      el.hidden = true;
      el.textContent = "";
      return;
    }
    el.hidden = false;
    el.textContent = "“" + text + "”";
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
  }

  function finishSession(data, sessionRef) {
    var next = sessionFromToken(data);
    if (!next) return Promise.resolve(null);
    var ready = next.user && next.user.email
      ? Promise.resolve(next)
      : fetchUser(next.access_token).then(function (user) {
          next.user = user;
          return next;
        });
    return ready.then(function (session) {
      writeSession(session);
      sessionRef.current = session;
      goProduct();
      return session;
    });
  }

  function goProduct() {
    if (window.NANIK_DRAFT && window.NANIK_DRAFT.goDashboard) {
      window.NANIK_DRAFT.goDashboard();
      return;
    }
    location.replace("dashboard.html");
  }

  function submitEmail(sessionRef) {
    var emailEl = document.getElementById("signin-email");
    var passEl = document.getElementById("signin-password");
    var email = emailEl ? emailEl.value.trim() : "";
    var password = passEl ? passEl.value : "";
    if (!validEmail(email) || password.length < 6) {
      showStatus(t("signin.invalid"), true);
      return;
    }
    setBusy(true);
    showStatus("", false);
    authPost("/auth/v1/token?grant_type=password", { email: email, password: password })
      .then(function (login) {
        if (login.ok && login.data && login.data.access_token) {
          return finishSession(login.data, sessionRef);
        }
        var loginMsg = String((login.data && (login.data.error_description || login.data.msg || login.data.error)) || "").toLowerCase();
        if (loginMsg.indexOf("email not confirmed") !== -1) {
          showStatus(t("signin.confirm"), true);
          return null;
        }
        return authPost("/auth/v1/signup", { email: email, password: password }).then(function (signup) {
          if (signup.ok && signup.data && signup.data.access_token) {
            return finishSession(signup.data, sessionRef);
          }
          if (signup.ok && signup.data && signup.data.id && !signup.data.access_token) {
            showStatus(t("signin.confirm"), false);
            return null;
          }
          showStatus(errorMessage(signup.data || login.data, t("signin.error")), true);
          return null;
        });
      })
      .catch(function () {
        showStatus(t("signin.error"), true);
      })
      .then(function () {
        setBusy(false);
      });
  }

  function sendMagic(sessionRef) {
    var emailEl = document.getElementById("signin-email");
    var email = emailEl ? emailEl.value.trim() : "";
    if (!validEmail(email)) {
      showStatus(t("signin.emailNeeded"), true);
      if (emailEl) emailEl.focus();
      return;
    }
    setBusy(true);
    showStatus("", false);
    var redirectTo = location.origin + location.pathname;
    authPost("/auth/v1/otp?redirect_to=" + encodeURIComponent(redirectTo), {
      email: email,
      create_user: true,
    })
      .then(function (res) {
        if (res.ok) {
          showStatus(t("signin.magicSent"), false);
          return;
        }
        showStatus(errorMessage(res.data, t("signin.error")), true);
      })
      .catch(function () {
        showStatus(t("signin.error"), true);
      })
      .then(function () {
        setBusy(false);
      });
  }

  function bind(sessionRef) {
    document.querySelectorAll("[data-signin-provider]").forEach(function (el) {
      el.addEventListener("click", function () {
        var provider = el.getAttribute("data-signin-provider");
        try {
          startOAuth(provider);
        } catch (err) {
          showStatus(t("signin.error"), true);
        }
      });
    });
    var form = document.getElementById("signin-email-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        submitEmail(sessionRef);
      });
    }
    var magic = document.getElementById("signin-magic");
    if (magic) {
      magic.addEventListener("click", function () {
        sendMagic(sessionRef);
      });
    }
    var signOutBtn = document.getElementById("signin-signout");
    if (signOutBtn) {
      signOutBtn.addEventListener("click", function () {
        signOut(sessionRef.current).then(function () {
          sessionRef.current = null;
          paint(null);
          showStatus("", false);
        });
      });
    }
    var img = document.getElementById("signin-side-img");
    if (img) {
      img.addEventListener("error", function () {
        if (img.dataset.fallback) return;
        img.dataset.fallback = "1";
        img.src = FALLBACK_IMG;
      });
    }
    window.addEventListener("nanik:langchange", function () {
      paint(sessionRef.current);
      paintPrompt();
      if (window.__NANIK_SIGNIN_ERROR && !sessionRef.current) {
        showStatus(window.__NANIK_SIGNIN_ERROR, true);
      }
    });
  }

  function init() {
    var sessionRef = { current: null };
    paintPrompt();
    bind(sessionRef);
    paint(null);
    loadSession().then(function (session) {
      sessionRef.current = session;
      paint(session);
      if (window.__NANIK_SIGNIN_ERROR && !session) {
        showStatus(window.__NANIK_SIGNIN_ERROR, true);
        return;
      }
      if (session && session.access_token) goProduct();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
