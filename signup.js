(function () {
  "use strict";

  var SESSION_KEY = "nanik-web-auth-session";
  var PKCE_KEY = "nanik-pkce-verifier";
  var APP_STORE = "https://apps.apple.com/app/id6762894314";
  var formMode = "signup";

  var COPY = {
    en: {
      start: "Sign up",
      account: "Account",
      title: "Sign up free so your child’s stories are saved",
      lead: "Create your account to make bedtime stories in your voice.",
      google: "Continue with Google",
      apple: "Continue with Apple",
      appleHint: "Apple sign-in works in the Nanik iOS app. Use Google here, or download the app.",
      close: "Close",
      error: "Could not start sign-in. Please try again.",
      welcome: "You’re in",
      signedLead: "Your Nanik account is ready. Continue creating stories in the browser, or get the iOS app.",
      continueProduct: "Continue creating",
      signOut: "Sign out",
      appStore: "Get the iOS app",
      or: "or",
      email: "Email",
      emailPh: "Email",
      password: "Password",
      passwordPh: "Password",
      continue: "Create account",
      login: "Log in",
      haveAccount: "Already signed up? Log in",
      needAccount: "Need an account? Create one",
      loginTitle: "Log in",
      magic: "Already signed up? Log in",
      magicSent: "Check your email for a sign-in link.",
      confirm: "Check your email to confirm your account.",
      invalid: "Enter a valid email and a password with at least 6 characters.",
      emailNeeded: "Enter your email to get a sign-in link.",
      exists: "This email already has an account. Try your password or a sign-in link.",
      badPass: "Wrong email or password. Try again, or use a sign-in link.",
      legal: 'By signing up, you accept our <a href="{terms}">Terms</a>, <a href="{privacy}">Privacy Policy</a>.',
      legalLogin: 'By logging in, you accept our <a href="{terms}">Terms</a>, <a href="{privacy}">Privacy Policy</a>.',
    },
    hy: {
      start: "Սկսել անվճար",
      account: "Հաշիվ",
      title: "Սկսիր Nanik-ով",
      lead: "Ստեղծիր հաշիվ՝ հեքիաթներ պատմելու քո ձայնով։",
      google: "Շարունակել Google-ով",
      apple: "Շարունակել Apple-ով",
      appleHint: "Apple մուտքը աշխատում է Nanik iOS հավելվածում։ Այստեղ օգտագործիր Google, կամ բեռնիր հավելվածը։",
      close: "Փակել",
      error: "Չհաջողվեց մուտք գործել։ Փորձիր նորից։",
      welcome: "Դու ներս ես",
      signedLead: "Քո Nanik հաշիվը պատրաստ է։ Շարունակիր ստեղծել հեքիաթներ բրաուզերում, կամ բեռնիր iOS հավելվածը։",
      continueProduct: "Շարունակել ստեղծել",
      signOut: "Դուրս գալ",
      appStore: "Բեռնել iOS հավելվածը",
      or: "կամ",
      email: "Էլ․ փոստ",
      emailPh: "you@email.com",
      password: "Գաղտնաբառ",
      passwordPh: "Առնվազն 6 նիշ",
      continue: "Ստեղծել հաշիվ",
      login: "Մուտք",
      haveAccount: "Արդեն գրանցվա՞ծ ես։ Մուտք գործիր",
      needAccount: "Հաշիվ չունե՞ս։ Ստեղծիր",
      loginTitle: "Մուտք",
      magic: "Արդեն գրանցվա՞ծ ես։ Մուտք գործիր",
      magicSent: "Ստուգիր էլ․ փոստդ՝ մուտքի հղման համար։",
      confirm: "Ստուգիր էլ․ փոստդ՝ հաշիվը հաստատելու համար։",
      invalid: "Մուտքագրիր վավեր էլ․ փոստ և առնվազն 6 նիշ գաղտնաբառ։",
      emailNeeded: "Մուտքագրիր էլ․ փոստդ՝ հղում ստանալու համար։",
      exists: "Այս էլ․ փոստով հաշիվ արդեն կա։ Փորձիր գաղտնաբառը կամ հղումը։",
      badPass: "Սխալ էլ․ փոստ կամ գաղտնաբառ։ Փորձիր նորից կամ օգտագործիր հղումը։",
      legal: 'Գրանցվելով՝ դու ընդունում ես մեր <a href="{terms}">Պայմանները</a>, <a href="{privacy}">Գաղտնիության քաղաքականությունը</a>։',
      legalLogin: 'Մուտք գործելով՝ դու ընդունում ես մեր <a href="{terms}">Պայմանները</a>, <a href="{privacy}">Գաղտնիության քաղաքականությունը</a>։',
    },
    ru: {
      start: "Начать бесплатно",
      account: "Аккаунт",
      title: "Начните с Nanik",
      lead: "Создайте аккаунт, чтобы рассказывать сказки своим голосом.",
      google: "Продолжить с Google",
      apple: "Продолжить с Apple",
      appleHint: "Вход через Apple доступен в приложении Nanik для iOS. Здесь используйте Google или скачайте приложение.",
      close: "Закрыть",
      error: "Не удалось войти. Попробуйте ещё раз.",
      welcome: "Вы внутри",
      signedLead: "Аккаунт Nanik готов. Продолжайте создавать сказки в браузере или скачайте iOS‑приложение.",
      continueProduct: "Продолжить создание",
      signOut: "Выйти",
      appStore: "Скачать приложение для iOS",
      or: "или",
      email: "Эл. почта",
      emailPh: "you@email.com",
      password: "Пароль",
      passwordPh: "Не менее 6 символов",
      continue: "Создать аккаунт",
      login: "Войти",
      haveAccount: "Уже есть аккаунт? Войти",
      needAccount: "Нет аккаунта? Создать",
      loginTitle: "Войти",
      magic: "Уже есть аккаунт? Войти",
      magicSent: "Проверьте почту — мы отправили ссылку для входа.",
      confirm: "Проверьте почту, чтобы подтвердить аккаунт.",
      invalid: "Введите действующую почту и пароль не короче 6 символов.",
      emailNeeded: "Введите почту, чтобы получить ссылку для входа.",
      exists: "У этого адреса уже есть аккаунт. Попробуйте пароль или ссылку.",
      badPass: "Неверная почта или пароль. Попробуйте ещё раз или войдите по ссылке.",
      legal: 'Регистрируясь, вы принимаете наши <a href="{terms}">Условия</a>, <a href="{privacy}">Политику конфиденциальности</a>.',
      legalLogin: 'Входя в аккаунт, вы принимаете наши <a href="{terms}">Условия</a>, <a href="{privacy}">Политику конфиденциальности</a>.',
    },
  };

  function lang() {
    try {
      var stored = localStorage.getItem("nanik-site-lang");
      if (stored && COPY[stored]) return stored;
    } catch (e) {}
    var html = (document.documentElement.lang || "en").slice(0, 2).toLowerCase();
    return COPY[html] ? html : "en";
  }

  function t() {
    return COPY[lang()] || COPY.en;
  }

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
    var error =
      params.error ||
      search.get("error") ||
      params.error_code ||
      search.get("error_code");
    var desc =
      params.error_description ||
      search.get("error_description") ||
      params.error_code ||
      search.get("error_code") ||
      "";
    if (error) {
      clearAuthFromUrl();
      var message = desc || error;
      try {
        message = decodeURIComponent(String(message).replace(/\+/g, " "));
      } catch (e) {}
      if (/unable to exchange external code/i.test(message) || /c214/i.test(message)) {
        message =
          "Apple sign-in is misconfigured (client secret expired or invalid). Rotate the Apple secret in Supabase Auth → Providers → Apple.";
      }
      return { error: message };
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

  function pkceGet() {
    try {
      return localStorage.getItem(PKCE_KEY) || sessionStorage.getItem(PKCE_KEY) || "";
    } catch (e) {
      return "";
    }
  }

  function pkceSet(value) {
    try {
      localStorage.setItem(PKCE_KEY, value);
    } catch (e) {}
    try {
      sessionStorage.setItem(PKCE_KEY, value);
    } catch (e) {}
  }

  function pkceClear() {
    try {
      localStorage.removeItem(PKCE_KEY);
    } catch (e) {}
    try {
      sessionStorage.removeItem(PKCE_KEY);
    } catch (e) {}
  }

  function readLastOAuthReturn() {
    try {
      var raw = localStorage.getItem("nanik-last-oauth-return");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function exchangePkceCode(code) {
    var verifier = pkceGet();
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
        pkceClear();
        return sessionFromToken(data);
      });
    });
  }

  function authHeaders(accessToken) {
    var headers = {
      apikey: anonKey(),
      Authorization: "Bearer " + (accessToken || anonKey()),
    };
    return headers;
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

  var oauthReturned = false;

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
      window.__NANIK_SIGNUP_ERROR = captured.error;
    }
    if (captured && captured.code) {
      oauthReturned = true;
      return exchangePkceCode(captured.code)
        .then(function (session) {
          clearAuthFromUrl();
          return ensureSessionUser(session);
        })
        .catch(function (err) {
          clearAuthFromUrl();
          window.__NANIK_SIGNUP_ERROR = (err && err.message) || t().error;
          return null;
        });
    }
    if (captured && captured.access_token) oauthReturned = true;
    var pending = captured && captured.access_token ? captured : readSession();
    if (!pending || !pending.access_token) return Promise.resolve(null);
    var needsRefresh = !pending.expires_at || pending.expires_at < Date.now() + 15000;
    var chain =
      needsRefresh && pending.refresh_token
        ? refreshSession(pending).catch(function () {
            return pending;
          })
        : Promise.resolve(pending);
    return chain.then(ensureSessionUser).catch(function () {
      return null;
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

  function sessionFromToken(data) {
    if (!data || !data.access_token) return null;
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token || "",
      expires_at: Date.now() + (parseInt(data.expires_in, 10) || 3600) * 1000,
      user: data.user || null,
    };
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
  }

  function errorMessage(data, fallback) {
    var copy = t();
    var raw = (data && (data.error_description || data.msg || data.error || data.message)) || "";
    raw = String(raw);
    var lower = raw.toLowerCase();
    if (lower.indexOf("email not confirmed") !== -1) return copy.confirm;
    if (lower.indexOf("already registered") !== -1) return copy.exists;
    if (lower.indexOf("invalid login") !== -1) return copy.badPass;
    return raw || fallback || copy.error;
  }

  function showStatus(message, isError) {
    var status = document.getElementById("signup-status");
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
    var form = document.getElementById("signup-email-form");
    var continueBtn = document.getElementById("signup-continue");
    var magicBtn = document.getElementById("signup-magic");
    if (form) form.classList.toggle("is-busy", busy);
    [continueBtn, magicBtn].forEach(function (btn) {
      if (btn) btn.disabled = busy;
    });
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
      goProduct(session);
      return session;
    });
  }

  function submitEmail(sessionRef) {
    var copy = t();
    var emailEl = document.getElementById("signup-email");
    var passEl = document.getElementById("signup-password");
    var email = emailEl ? emailEl.value.trim() : "";
    var password = passEl ? passEl.value : "";
    if (!validEmail(email) || password.length < 6) {
      showStatus(copy.invalid, true);
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
          showStatus(copy.confirm, true);
          return null;
        }
        if (formMode === "login") {
          showStatus(errorMessage(login.data, copy.badPass), true);
          return null;
        }
        return authPost("/auth/v1/signup", { email: email, password: password }).then(function (signup) {
          if (signup.ok && signup.data && signup.data.access_token) {
            return finishSession(signup.data, sessionRef);
          }
          if (signup.ok && signup.data && signup.data.id && !signup.data.access_token) {
            showStatus(copy.confirm, false);
            return null;
          }
          showStatus(errorMessage(signup.data || login.data, copy.error), true);
          return null;
        });
      })
      .catch(function () {
        showStatus(copy.error, true);
      })
      .then(function () {
        setBusy(false);
      });
  }

  function sendMagic() {
    var copy = t();
    var emailEl = document.getElementById("signup-email");
    var email = emailEl ? emailEl.value.trim() : "";
    if (!validEmail(email)) {
      showStatus(copy.emailNeeded, true);
      if (emailEl) emailEl.focus();
      return;
    }
    setBusy(true);
    showStatus("", false);
    var redirectTo = location.origin + location.pathname + (location.search || "");
    authPost("/auth/v1/otp?redirect_to=" + encodeURIComponent(redirectTo), {
      email: email,
      create_user: true,
    })
      .then(function (res) {
        if (res.ok) {
          showStatus(copy.magicSent, false);
          return;
        }
        showStatus(errorMessage(res.data, copy.error), true);
      })
      .catch(function () {
        showStatus(copy.error, true);
      })
      .then(function () {
        setBusy(false);
      });
  }

  function startOAuth(provider) {
    var redirectTo = location.origin + location.pathname + (location.search || "");
    try {
      var clean = new URL(redirectTo);
      clean.searchParams.delete("code");
      clean.searchParams.delete("state");
      clean.searchParams.delete("error");
      clean.searchParams.delete("error_description");
      clean.searchParams.delete("error_code");
      clean.searchParams.delete("oauth_debug");
      redirectTo = clean.origin + clean.pathname + clean.search + clean.hash;
    } catch (e) {}

    function goAuthorize(extra) {
      var url =
        supabaseUrl() +
        "/auth/v1/authorize?provider=" +
        encodeURIComponent(provider) +
        "&redirect_to=" +
        encodeURIComponent(redirectTo) +
        (extra || "");
      // Always show Google's account chooser so the last-used account is not forced.
      if (String(provider) === "google") {
        url += "&prompt=select_account";
      }
      location.href = url;
    }

    // Apple's token exchange via Supabase is unreliable with an extra PKCE challenge
    // on authorize; use implicit return tokens for Apple. Keep PKCE for Google.
    if (String(provider) === "apple") {
      pkceClear();
      goAuthorize("");
      return;
    }

    var verifier = randomVerifier();
    pkceSet(verifier);

    sha256B64Url(verifier)
      .then(function (challenge) {
        goAuthorize(
          "&code_challenge=" +
            encodeURIComponent(challenge) +
            "&code_challenge_method=s256"
        );
      })
      .catch(function () {
        pkceClear();
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

  function ensureUi() {
    var shell = document.querySelector("header.site .nav-shell");
    if (shell && !document.getElementById("site-signup-open")) {
      var btn = document.createElement("a");
      btn.href = "#";
      btn.id = "site-signup-open";
      btn.className = "site-signup-open";
      btn.setAttribute("data-i18n", "nav.startFree");
      btn.textContent = t().start;

      var slot = document.getElementById("site-lang-slot");
      if (slot && slot.parentNode === shell) {
        if (slot.nextSibling) shell.insertBefore(btn, slot.nextSibling);
        else shell.appendChild(btn);
      } else {
        shell.appendChild(btn);
      }
    }

    if (document.getElementById("signup-modal")) return;

    var dialog = document.createElement("dialog");
    dialog.id = "signup-modal";
    dialog.className = "signup-modal";
    dialog.setAttribute("aria-labelledby", "signup-title");
    dialog.innerHTML =
      '<div class="signup-backdrop" data-signup-close></div>' +
      '<div class="signup-sheet" role="document">' +
      '<button type="button" class="signup-close" data-signup-close data-i18n-title="signup.close" aria-label="Close">&times;</button>' +
      '<h2 id="signup-title" data-i18n="signup.title"></h2>' +
      '<p class="signup-status" id="signup-status" hidden></p>' +
      '<div class="signup-actions" id="signup-actions">' +
      '<button type="button" class="signup-provider signup-provider-google" data-signup-provider="google">' +
      '<span class="signup-provider-icon" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24" width="18" height="18">' +
      '<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>' +
      '<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>' +
      '<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>' +
      '<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>' +
      "</svg></span>" +
      '<span class="signup-provider-label" data-i18n="signup.google"></span></button>' +
      '<button type="button" class="signup-provider signup-provider-apple" data-signup-provider="apple">' +
      '<span class="signup-provider-icon" aria-hidden="true">' +
      '<svg viewBox="0 0 384 512" width="16" height="18"><path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>' +
      "</span>" +
      '<span class="signup-provider-label" data-i18n="signup.apple"></span></button>' +
      '<a class="signup-provider signup-provider-store" id="signup-apple-store" href="' + APP_STORE + '" hidden>' +
      '<span class="signup-provider-label" data-i18n="signup.appStore"></span></a>' +
      '<div class="signup-email-block" id="signup-email-block" hidden>' +
      '<div class="signup-or" role="separator"><span id="signup-or-label" data-i18n="signin.or"></span></div>' +
      '<form class="signup-email" id="signup-email-form" novalidate>' +
      '<label class="signup-field">' +
      '<input id="signup-email" type="email" name="email" autocomplete="email" inputmode="email" required placeholder="Email" aria-label="Email"></label>' +
      '<label class="signup-field">' +
      '<input id="signup-password" type="password" name="password" autocomplete="current-password" minlength="6" required placeholder="Password" aria-label="Password"></label>' +
      '<button type="submit" class="signup-continue" id="signup-continue" data-i18n="signup.createAccount"></button>' +
      '<button type="button" class="signup-magic" id="signup-magic" data-i18n="signup.haveAccount"></button>' +
      "</form>" +
      "</div>" +
      '<p class="signup-legal" id="signup-legal"></p>' +
      "</div>" +
      '<div class="signup-signed" id="signup-signed" hidden>' +
      '<p class="signup-lead" id="signup-signed-lead"></p>' +
      '<button type="button" class="signup-provider signup-provider-continue" id="signup-continue-product" data-i18n="signup.continueProduct"></button>' +
      '<a class="signup-provider signup-provider-store" href="' + APP_STORE + '">' +
      '<span class="signup-provider-label" data-i18n="signup.appStore"></span></a>' +
      '<button type="button" class="signup-signout" id="signup-signout" data-i18n="signup.signOut"></button>' +
      "</div>" +
      "</div>";
    document.body.appendChild(dialog);
  }

  function paint(session) {
    var copy = t();
    var btn = document.getElementById("site-signup-open");
    var title = document.getElementById("signup-title");
    var signedLead = document.getElementById("signup-signed-lead");
    var actions = document.getElementById("signup-actions");
    var signed = document.getElementById("signup-signed");
    var status = document.getElementById("signup-status");
    var close = document.querySelector("#signup-modal .signup-close");
    var googleLabel = document.querySelector("#signup-modal [data-i18n='signup.google']");
    var appleLabel = document.querySelector("#signup-modal [data-i18n='signup.apple']");
    var storeLabels = document.querySelectorAll("#signup-modal [data-i18n='signup.appStore']");
    var signOutBtn = document.getElementById("signup-signout");
    var continueProductBtn = document.getElementById("signup-continue-product");
    var appleStore = document.getElementById("signup-apple-store");
    var user = session && session.user;
    var name = displayName(user);

    if (btn) {
      btn.textContent = user ? name || copy.account : copy.start;
      btn.setAttribute("data-i18n", user ? "signup.account" : "nav.startFree");
      if (user && name) btn.removeAttribute("data-i18n");
    }
    if (title) title.textContent = user ? copy.welcome : (formMode === "login" ? copy.loginTitle : copy.title);
    if (signedLead) signedLead.textContent = copy.signedLead;
    if (actions) actions.hidden = !!user;
    if (signed) signed.hidden = !user;
    if (googleLabel) googleLabel.textContent = copy.google;
    if (appleLabel) appleLabel.textContent = copy.apple;
    storeLabels.forEach(function (el) { el.textContent = copy.appStore; });
    if (continueProductBtn) continueProductBtn.textContent = copy.continueProduct;
    if (appleStore && user) appleStore.hidden = true;
    if (signOutBtn) signOutBtn.textContent = copy.signOut;
    var orLabel = document.getElementById("signup-or-label");
    var emailInput = document.getElementById("signup-email");
    var passwordInput = document.getElementById("signup-password");
    var continueBtn = document.getElementById("signup-continue");
    var magicBtn = document.getElementById("signup-magic");
    if (orLabel) orLabel.textContent = copy.or;
    if (emailInput) {
      emailInput.setAttribute("placeholder", copy.emailPh);
      emailInput.setAttribute("aria-label", copy.email);
    }
    if (passwordInput) {
      passwordInput.setAttribute("placeholder", copy.passwordPh);
      passwordInput.setAttribute("aria-label", copy.password);
    }
    if (continueBtn) continueBtn.textContent = formMode === "login" ? copy.login : copy.continue;
    if (magicBtn) magicBtn.textContent = formMode === "login" ? copy.needAccount : copy.haveAccount;
    var legal = document.getElementById("signup-legal");
    if (legal) {
      var base = /\/hy\//.test(location.pathname || "") ? "../" : "";
      legal.innerHTML = (formMode === "login" ? copy.legalLogin : copy.legal)
        .replace("{terms}", base + "terms.html")
        .replace("{privacy}", base + "privacy.html");
    }
    if (close) {
      close.setAttribute("aria-label", copy.close);
      close.setAttribute("title", copy.close);
    }
    if (status) {
      var err = window.__NANIK_SIGNUP_ERROR;
      if (err && !user) {
        status.hidden = false;
        status.textContent = err;
        status.classList.add("is-error");
      } else {
        status.hidden = true;
        status.textContent = "";
        status.classList.remove("is-error");
      }
    }
  }

  function goProduct(session) {
    if (!session || !session.access_token) return false;
    closeModal();
    if (window.NANIK_DRAFT && window.NANIK_DRAFT.goDashboard) {
      window.NANIK_DRAFT.goDashboard();
      return true;
    }
    location.replace(/\/hy\//.test(location.pathname || "") ? "../dashboard.html" : "dashboard.html");
    return true;
  }

  function justCapturedAuth() {
    return !!(window.NANIK_DRAFT && window.NANIK_DRAFT.authReturn && window.NANIK_DRAFT.authReturn.captured);
  }

  function openModal(mode) {
    ensureUi();
    var session = readSession();
    // Already signed in → go straight to the web product.
    if (session && session.access_token && mode !== "account") {
      if (goProduct(session)) return;
    }
    var dialog = document.getElementById("signup-modal");
    if (!dialog) return;
    formMode = mode === "login" ? "login" : "signup";
    paint(session);
    document.body.classList.add("signup-open");
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  window.NANIK_OPEN_SIGNUP = function () { openModal("signup"); };
  window.NANIK_OPEN_LOGIN = function () { openModal("login"); };

  function closeModal() {
    var dialog = document.getElementById("signup-modal");
    if (!dialog) return;
    document.body.classList.remove("signup-open");
    if (typeof dialog.close === "function" && dialog.open) dialog.close();
    else dialog.removeAttribute("open");
    window.__NANIK_SIGNUP_ERROR = "";
    var status = document.getElementById("signup-status");
    if (status) {
      status.hidden = true;
      status.textContent = "";
      status.classList.remove("is-error");
    }
    var appleStore = document.getElementById("signup-apple-store");
    if (appleStore) appleStore.hidden = true;
  }

  function bind(sessionRef) {
    var dialog = document.getElementById("signup-modal");
    if (!dialog || dialog.dataset.signupReady) return;
    dialog.dataset.signupReady = "1";

    var btn = document.getElementById("site-signup-open");
    if (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        openModal();
      });
    }
    document.addEventListener(
      "click",
      function (e) {
        var link = e.target.closest && e.target.closest("a[href]");
        if (!link) return;
        var href = String(link.getAttribute("href") || "");
        if (href.indexOf("signin.html") === -1) return;
        e.preventDefault();
        e.stopPropagation();
        openModal();
      },
      true
    );
    var emailForm = document.getElementById("signup-email-form");
    if (emailForm) {
      emailForm.addEventListener("submit", function (e) {
        e.preventDefault();
        submitEmail(sessionRef);
      });
    }
    var magicBtn = document.getElementById("signup-magic");
    if (magicBtn) {
      magicBtn.addEventListener("click", function () {
        formMode = formMode === "login" ? "signup" : "login";
        showStatus("", false);
        paint(sessionRef.current);
      });
    }
    dialog.addEventListener("click", function (e) {
      var closeEl = e.target.closest && e.target.closest("[data-signup-close]");
      if (closeEl) {
        e.preventDefault();
        closeModal();
      }
    });
    dialog.addEventListener("cancel", function (e) {
      e.preventDefault();
      closeModal();
    });
    dialog.querySelectorAll("[data-signup-provider]").forEach(function (el) {
      el.addEventListener("click", function () {
        var provider = el.getAttribute("data-signup-provider");
        try {
          startOAuth(provider);
        } catch (err) {
          window.__NANIK_SIGNUP_ERROR = t().error;
          paint(sessionRef.current);
        }
      });
    });
    var signOutBtn = document.getElementById("signup-signout");
    if (signOutBtn) {
      signOutBtn.addEventListener("click", function () {
        signOut(sessionRef.current).then(function () {
          sessionRef.current = null;
          paint(null);
          closeModal();
        });
      });
    }
    var continueProductBtn = document.getElementById("signup-continue-product");
    if (continueProductBtn) {
      continueProductBtn.addEventListener("click", function () {
        goProduct(sessionRef.current || readSession());
      });
    }
    window.addEventListener("nanik:langchange", function () {
      paint(sessionRef.current);
    });
  }

  function init() {
    ensureUi();
    var sessionRef = { current: null };
    bind(sessionRef);
    paint(null);
    loadSession().then(function (session) {
      sessionRef.current = session;
      paint(session);
      if (window.__NANIK_SIGNUP_ERROR && !session) {
        var last = readLastOAuthReturn();
        if (last && last.href) {
          try {
            console.warn("[nanik-auth] oauth return", last.href);
          } catch (e) {}
        }
        openModal("signup");
      } else if (session && (oauthReturned || justCapturedAuth())) {
        goProduct(session);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
