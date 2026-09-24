(function () {
  "use strict";

  var SESSION_KEY = "nanik-web-auth-session";
  var overlayEl = null;
  var overlayStyleReady = false;
  var checkoutModalEl = null;
  var checkoutFrameTimer = null;
  var activeCheckoutUrl = "";
  var refreshInFlight = null;

  function api() {
    return window.NANIK_API || {};
  }

  function supabaseUrl() {
    return String(api().supabaseUrl || "https://zljowsxavbpqfdskekwd.supabase.co").replace(/\/$/, "");
  }

  function anonKey() {
    return api().supabaseAnonKey || "";
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

  function jwtExpMs(accessToken) {
    try {
      var part = String(accessToken || "").split(".")[1] || "";
      part = part.replace(/-/g, "+").replace(/_/g, "/");
      while (part.length % 4) part += "=";
      var payload = JSON.parse(atob(part));
      var exp = Number(payload && payload.exp);
      return Number.isFinite(exp) ? exp * 1000 : 0;
    } catch (e) {
      return 0;
    }
  }

  function sessionExpiresAt(session) {
    if (!session) return 0;
    var stored = Number(session.expires_at) || 0;
    // Some writers store unix seconds; normalize to ms.
    if (stored > 0 && stored < 1e12) stored *= 1000;
    var fromJwt = jwtExpMs(session.access_token);
    return Math.max(stored, fromJwt);
  }

  function sessionStillValid(session, skewMs) {
    if (!session || !session.access_token) return false;
    var exp = sessionExpiresAt(session);
    if (!exp) return true; // unknown expiry — try the token
    return exp > Date.now() + (skewMs == null ? 15000 : skewMs);
  }

  function refreshSession(session) {
    // Single-flight: Safari (and multi-tab) often race refresh-token rotation.
    if (refreshInFlight) return refreshInFlight;

    refreshInFlight = Promise.resolve()
      .then(function () {
        var latest = readSession() || session;
        if (sessionStillValid(latest, 20000)) return latest;
        if (!latest || !latest.refresh_token) {
          throw new Error("Your session has expired. Please sign in again.");
        }
        return fetch(supabaseUrl() + "/auth/v1/token?grant_type=refresh_token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: anonKey(),
            Authorization: "Bearer " + anonKey(),
          },
          body: JSON.stringify({ refresh_token: latest.refresh_token }),
        }).then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (data) {
            if (!res.ok || !data.access_token) {
              // Another tab may have rotated successfully — reuse that session.
              var raced = readSession();
              if (sessionStillValid(raced, 5000)) return raced;
              writeSession(null);
              throw new Error("Your session has expired. Please sign in again.");
            }
            var next = {
              access_token: data.access_token,
              refresh_token: data.refresh_token || latest.refresh_token,
              expires_at: Date.now() + (parseInt(data.expires_in, 10) || 3600) * 1000,
              user: data.user || latest.user || null,
            };
            writeSession(next);
            return next;
          });
        });
      })
      .finally(function () {
        refreshInFlight = null;
      });

    return refreshInFlight;
  }

  function ensureFreshSession(session) {
    var current = session || readSession();
    if (!current || !current.access_token) {
      return Promise.reject(new Error("Your session has expired. Please sign in again."));
    }
    if (sessionStillValid(current, 60000)) return Promise.resolve(current);
    return refreshSession(current);
  }

  function authenticatedPost(url, body, session, label) {
    function send(activeSession) {
      return fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: anonKey(),
          Authorization: "Bearer " + activeSession.access_token,
        },
        body: JSON.stringify(body),
      });
    }
    return ensureFreshSession(session)
      .then(send)
      .then(function (res) {
        if (res.status !== 401) return res;
        return refreshSession(readSession() || session).then(send);
      })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (!res.ok) {
            var message = (data && (data.details || data.error)) || (label + " " + res.status);
            throw new Error(message);
          }
          return data;
        });
      });
  }

  function signInUrl(next) {
    var target = "signin.html?next=" + encodeURIComponent(next || "pricing.html");
    return target;
  }

  function redirectToSignIn(next) {
    hideCheckoutLoading();
    writeSession(null);
    window.location.href = signInUrl(next || (window.location.pathname.split("/").pop() || "dashboard.html"));
  }

  function checkoutEndpoint() {
    return supabaseUrl() + "/functions/v1/dodo-checkout";
  }

  function portalEndpoint() {
    return supabaseUrl() + "/functions/v1/dodo-portal";
  }

  function syncEndpoint() {
    return supabaseUrl() + "/functions/v1/dodo-sync";
  }

  function syncSubscription(options) {
    var opts = options || {};
    var session = readSession();
    if (!session || !session.access_token) return Promise.resolve(null);
    return authenticatedPost(
      syncEndpoint(),
      {
        subscriptionId: opts.subscriptionId || "",
        sessionId: opts.sessionId || "",
      },
      session,
      "sync"
    ).catch(function (err) {
      console.warn("[dodo-sync]", err);
      return null;
    });
  }

  function ensureOverlayStyles() {
    if (overlayStyleReady) return;
    overlayStyleReady = true;
    var style = document.createElement("style");
    style.textContent = [
      ".nanik-checkout-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(18,14,28,0.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}",
      ".nanik-checkout-overlay[hidden]{display:none!important}",
      ".nanik-checkout-card{display:flex;flex-direction:column;align-items:center;gap:14px;min-width:min(100%,280px);padding:28px 32px;border-radius:20px;background:#fff;color:#1c1630;box-shadow:0 18px 50px rgba(0,0,0,0.28);text-align:center}",
      ".nanik-checkout-spinner{width:28px;height:28px;border-radius:50%;border:3px solid rgba(240,138,58,0.25);border-top-color:#f08a3a;animation:nanik-checkout-spin .7s linear infinite}",
      ".nanik-checkout-card p{margin:0;font:600 16px/1.35 ui-rounded,system-ui,sans-serif}",
      ".nanik-checkout-card span{font:500 13px/1.4 ui-rounded,system-ui,sans-serif;color:rgba(28,22,48,0.62)}",
      ".nanik-dodo-modal{position:fixed;inset:0;z-index:6859455;display:flex;align-items:stretch;justify-content:center;padding:0;background:rgba(18,14,28,.62);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}",
      ".nanik-dodo-modal[hidden]{display:none!important}",
      ".nanik-dodo-dialog{position:relative;width:min(100%,560px);height:100%;height:100dvh;max-height:100dvh;margin:0 auto;display:flex;flex-direction:column}",
      ".nanik-dodo-close{position:absolute;top:10px;right:10px;z-index:3;display:grid;place-items:center;width:38px;height:38px;padding:0;border:0;border-radius:50%;background:rgba(255,255,255,.96);color:#17122c;box-shadow:0 8px 22px rgba(0,0,0,.2);font:400 28px/1 system-ui,sans-serif;cursor:pointer}",
      ".nanik-dodo-close:hover,.nanik-dodo-close:focus-visible{background:#e6e2f1;outline:2px solid #6454d9;outline-offset:2px}",
      ".nanik-dodo-body{position:relative;flex:1;min-height:0;overflow:hidden;border-radius:0;background:#fff;box-shadow:0 24px 72px rgba(0,0,0,.38)}",
      ".nanik-dodo-mount{position:absolute;inset:0;min-height:0}",
      ".nanik-dodo-frame{display:block;width:100%;height:100%;min-height:0;border:0;background:#fff}",
      ".nanik-dodo-status{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:28px;background:#fff;color:#1c1630;text-align:center}",
      ".nanik-dodo-status[hidden]{display:none!important}",
      ".nanik-dodo-status p{max-width:340px;margin:0;font:600 15px/1.45 ui-rounded,system-ui,sans-serif}",
      ".nanik-dodo-status-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:10px}",
      ".nanik-dodo-status button{min-height:42px;padding:9px 16px;border:1px solid #d9d4e8;border-radius:8px;background:#fff;color:#31266f;font:700 14px/1.2 ui-rounded,system-ui,sans-serif;cursor:pointer}",
      ".nanik-dodo-status button:first-child{border-color:#5546d8;background:#5546d8;color:#fff}",
      "@media(min-width:720px){.nanik-dodo-modal{padding:18px;align-items:center}.nanik-dodo-dialog{height:min(900px,calc(100dvh - 36px));max-height:calc(100dvh - 36px);border-radius:12px;overflow:hidden}.nanik-dodo-close{top:0;right:-48px;background:#fff}.nanik-dodo-body{border-radius:12px}}",
      "@keyframes nanik-checkout-spin{to{transform:rotate(360deg)}}",
      "a.is-loading,button.is-loading{pointer-events:none;opacity:.72;cursor:wait}",
      "#guided-plan-upgrade.is-loading{text-decoration:none}",
    ].join("");
    document.head.appendChild(style);
  }

  function showCheckoutLoading(message) {
    ensureOverlayStyles();
    if (!overlayEl) {
      overlayEl = document.createElement("div");
      overlayEl.className = "nanik-checkout-overlay";
      overlayEl.setAttribute("role", "status");
      overlayEl.setAttribute("aria-live", "polite");
      overlayEl.innerHTML =
        '<div class="nanik-checkout-card">' +
        '<div class="nanik-checkout-spinner" aria-hidden="true"></div>' +
        '<p data-checkout-title>Opening checkout…</p>' +
        "<span>This usually takes a second</span>" +
        "</div>";
      document.body.appendChild(overlayEl);
    }
    var title = overlayEl.querySelector("[data-checkout-title]");
    if (title) title.textContent = message || "Opening checkout…";
    overlayEl.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function hideCheckoutLoading() {
    if (!overlayEl) return;
    overlayEl.hidden = true;
    document.body.style.overflow = "";
  }

  function closeCheckoutModal() {
    if (checkoutFrameTimer) window.clearTimeout(checkoutFrameTimer);
    checkoutFrameTimer = null;
    activeCheckoutUrl = "";
    if (checkoutModalEl) checkoutModalEl.remove();
    checkoutModalEl = null;
    document.body.style.overflow = "";
  }

  function checkoutUrlWithRetry(checkoutUrl, attempt) {
    if (!attempt) return checkoutUrl;
    return checkoutUrl + (checkoutUrl.indexOf("?") >= 0 ? "&" : "?") + "nanik_retry=" + Date.now();
  }

  function loadCheckoutFrame(attempt) {
    if (!checkoutModalEl || !activeCheckoutUrl) return;
    var frame = checkoutModalEl.querySelector(".nanik-dodo-frame");
    var status = checkoutModalEl.querySelector(".nanik-dodo-status");
    var statusText = checkoutModalEl.querySelector("[data-dodo-status-text]");
    var actions = checkoutModalEl.querySelector(".nanik-dodo-status-actions");
    if (!frame || !status) return;
    status.hidden = false;
    if (statusText) statusText.textContent = attempt ? "Still connecting to checkout…" : "Loading payment details…";
    if (actions) actions.hidden = true;
    var loaded = false;
    function handleLoad() {
      loaded = true;
      if (checkoutFrameTimer) window.clearTimeout(checkoutFrameTimer);
      checkoutFrameTimer = null;
      status.hidden = true;
    }
    frame.addEventListener("load", handleLoad, { once: true });
    frame.src = checkoutUrlWithRetry(activeCheckoutUrl, attempt);
    checkoutFrameTimer = window.setTimeout(function () {
      if (loaded || !checkoutModalEl) return;
      if (attempt < 1) {
        loadCheckoutFrame(attempt + 1);
        return;
      }
      if (statusText) statusText.textContent = "Dodo Payments could not load inside this browser.";
      if (actions) actions.hidden = false;
    }, 6500);
  }

  function showCheckoutModal(checkoutUrl) {
    ensureOverlayStyles();
    closeCheckoutModal();
    checkoutModalEl = document.createElement("div");
    checkoutModalEl.className = "nanik-dodo-modal";
    checkoutModalEl.setAttribute("role", "dialog");
    checkoutModalEl.setAttribute("aria-modal", "true");
    checkoutModalEl.setAttribute("aria-label", "Secure checkout");
    checkoutModalEl.innerHTML =
      '<div class="nanik-dodo-dialog">' +
      '<button type="button" class="nanik-dodo-close" aria-label="Close checkout">&times;</button>' +
      '<div class="nanik-dodo-body">' +
      '<div class="nanik-dodo-status" role="status" aria-live="polite"><div class="nanik-checkout-spinner" aria-hidden="true"></div>' +
      '<p data-dodo-status-text>Loading payment details…</p><div class="nanik-dodo-status-actions" hidden>' +
      '<button type="button" data-dodo-retry>Try again</button><button type="button" data-dodo-open>Open secure checkout</button></div></div>' +
      '<div class="nanik-dodo-mount"><iframe class="nanik-dodo-frame" title="Dodo Payments secure checkout" allow="payment *"></iframe></div></div></div>';
    checkoutModalEl.querySelector(".nanik-dodo-close").addEventListener("click", function () {
      closeCheckoutModal();
    });
    checkoutModalEl.addEventListener("click", function (event) {
      if (event.target === checkoutModalEl) closeCheckoutModal();
    });
    checkoutModalEl.querySelector("[data-dodo-retry]").addEventListener("click", function () {
      loadCheckoutFrame(0);
    });
    checkoutModalEl.querySelector("[data-dodo-open]").addEventListener("click", function () {
      window.open(activeCheckoutUrl, "_blank", "noopener");
    });
    document.body.appendChild(checkoutModalEl);
    document.body.style.overflow = "hidden";
    activeCheckoutUrl = checkoutUrl;
    loadCheckoutFrame(0);
  }

  var dodoOverlayReady = false;
  var dodoOverlayLoading = null;
  var dodoSdkDisplayType = null;

  function dodoModeFromCheckoutUrl(checkoutUrl) {
    try {
      var host = String(new URL(checkoutUrl).hostname || "").toLowerCase();
      if (host.indexOf("test.") >= 0 || host.indexOf("sandbox") >= 0) return "test";
    } catch (e) {}
    // Local preview usually uses Dodo test keys.
    if (/^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname || "")) return "test";
    return "live";
  }

  function loadDodoOverlaySdk() {
    if (window.DodoPaymentsCheckout && window.DodoPaymentsCheckout.DodoPayments) {
      return Promise.resolve(window.DodoPaymentsCheckout.DodoPayments);
    }
    if (dodoOverlayLoading) return dodoOverlayLoading;
    dodoOverlayLoading = new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/dodopayments-checkout@latest/dist/index.js";
      script.async = true;
      script.onload = function () {
        if (window.DodoPaymentsCheckout && window.DodoPaymentsCheckout.DodoPayments) {
          resolve(window.DodoPaymentsCheckout.DodoPayments);
        } else {
          reject(new Error("Dodo overlay SDK missing"));
        }
      };
      script.onerror = function () {
        reject(new Error("Failed to load Dodo overlay SDK"));
      };
      document.head.appendChild(script);
    }).finally(function () {
      dodoOverlayLoading = null;
    });
    return dodoOverlayLoading;
  }

  function handleDodoCheckoutEvent(event) {
    var type = event && (event.event_type || event.type);
    if (type === "checkout.closed" || type === "checkout.error") {
      if (!paywallEl || paywallEl.hidden) document.body.style.overflow = "";
    }
    if (type === "checkout.form_ready" || type === "checkout.opened") {
      setPaywallCheckoutLoading(false);
    }
    if (type === "checkout.link_expired") {
      setPaywallCheckoutError("This checkout link expired. Go back and try again.");
    }
    if (type === "checkout.error") {
      var msg =
        (event && event.data && (event.data.message || event.data.error)) ||
        "Checkout could not load.";
      setPaywallCheckoutError(String(msg));
    }
    if (type === "checkout.completed" || type === "payment.succeeded") {
      syncSubscription({}).finally(function () {
        closePaywall();
        window.dispatchEvent(
          new CustomEvent("nanik:checkout-complete", {
            detail: { status: "success" },
          })
        );
      });
    }
  }

  function ensureDodoSdk(displayType, checkoutUrl) {
    return loadDodoOverlaySdk().then(function (DodoPayments) {
      if (dodoSdkDisplayType && dodoSdkDisplayType !== displayType) {
        try {
          DodoPayments.Checkout.close();
        } catch (e) {}
        dodoOverlayReady = false;
        dodoSdkDisplayType = null;
      }
      if (!dodoOverlayReady || dodoSdkDisplayType !== displayType) {
        DodoPayments.Initialize({
          mode: dodoModeFromCheckoutUrl(checkoutUrl),
          displayType: displayType,
          onEvent: handleDodoCheckoutEvent,
        });
        dodoOverlayReady = true;
        dodoSdkDisplayType = displayType;
      }
      return DodoPayments;
    });
  }

  function closeDodoCheckout() {
    try {
      if (window.DodoPaymentsCheckout && window.DodoPaymentsCheckout.DodoPayments) {
        window.DodoPaymentsCheckout.DodoPayments.Checkout.close();
      }
    } catch (e) {}
  }

  function openCheckoutOverlay(checkoutUrl) {
    hideCheckoutLoading();
    return ensureDodoSdk("overlay", checkoutUrl)
      .then(function (DodoPayments) {
        document.body.style.overflow = "hidden";
        return DodoPayments.Checkout.open({
          checkoutUrl: checkoutUrl,
        });
      })
      .catch(function (err) {
        console.warn("[dodo-overlay] falling back to iframe", err);
        showCheckoutModal(checkoutUrl);
      });
  }

  function openCheckoutInline(checkoutUrl, elementId, options) {
    var opts = options || {};
    return ensureDodoSdk("inline", checkoutUrl).then(function (DodoPayments) {
      return DodoPayments.Checkout.open({
        checkoutUrl: checkoutUrl,
        elementId: elementId,
        options: {
          showTimer: opts.showTimer === true,
          showSecurityBadge: opts.showSecurityBadge !== false,
          payButtonText: opts.payButtonText || undefined,
        },
      });
    });
  }

  function siteLanguage() {
    try {
      var stored = String(localStorage.getItem("nanik-site-lang") || "").trim().toLowerCase();
      if (stored) return stored.slice(0, 2);
    } catch (e) {}
    var html = String((document.documentElement && document.documentElement.lang) || "")
      .trim()
      .toLowerCase()
      .slice(0, 2);
    return html || "en";
  }

  /**
   * Soft hints only — never use browser language region (Safari en-GB → UK).
   * Server prefers Cloudflare IP country over this value.
   */
  function guessBillingCountry() {
    try {
      if (siteLanguage() === "hy") return "AM";
    } catch (e0) {}
    try {
      var tz = String(Intl.DateTimeFormat().resolvedOptions().timeZone || "");
      if (tz === "Asia/Yerevan") return "AM";
    } catch (e1) {}
    return undefined;
  }

  function currentReturnUrl() {
    try {
      var url = new URL(window.location.href);
      url.searchParams.delete("status");
      url.searchParams.delete("subscription_id");
      url.searchParams.delete("subscriptionId");
      url.searchParams.delete("session_id");
      url.searchParams.delete("checkout_session_id");
      url.searchParams.delete("payment_id");
      url.searchParams.set("nanik_checkout", "1");
      return url.toString();
    } catch (e) {
      return window.location.origin + "/dashboard.html?nanik_checkout=1";
    }
  }

  function createCheckoutSession(planId, options) {
    var opts = options || {};
    var returnTo = opts.returnPath || (window.location.pathname.split("/").pop() || "pricing.html");
    var session = readSession();
    if (!session || !session.access_token) {
      window.location.href = signInUrl(
        returnTo + (returnTo.indexOf("?") >= 0 ? "&" : "?") + "plan=" + encodeURIComponent(planId)
      );
      return Promise.resolve(null);
    }
    var returnUrl = opts.returnUrl || currentReturnUrl();
    return ensureFreshSession(session)
      .then(function (fresh) {
        return authenticatedPost(
          checkoutEndpoint(),
          {
            planId: planId,
            returnUrl: returnUrl,
            forceProduct: opts.forceProduct !== false,
            language: opts.language || siteLanguage(),
            billingCountry: opts.billingCountry || guessBillingCountry(),
          },
          fresh,
          "checkout"
        );
      })
      .catch(function (err) {
        var msg = err && err.message ? String(err.message) : "";
        if (/session has expired/i.test(msg) || /not authenticated/i.test(msg)) {
          redirectToSignIn(
            returnTo + (returnTo.indexOf("?") >= 0 ? "&" : "?") + "plan=" + encodeURIComponent(planId)
          );
          return null;
        }
        throw err;
      });
  }

  function startCheckout(planId, options) {
    var opts = options || {};
    if (!opts.skipLoading) {
      showCheckoutLoading(opts.loadingMessage || "Opening checkout…");
    }
    return createCheckoutSession(planId, opts)
      .then(function (data) {
        if (!data) return null;
        if (!data.checkoutUrl) throw new Error("Checkout URL missing");
        if (opts.display === "inline" && opts.elementId) {
          hideCheckoutLoading();
          return openCheckoutInline(data.checkoutUrl, opts.elementId, opts).then(function () {
            return data;
          });
        }
        return openCheckoutOverlay(data.checkoutUrl).then(function () {
          return data;
        });
      })
      .catch(function (err) {
        hideCheckoutLoading();
        throw err;
      });
  }

  function openPortal(options) {
    var opts = options || {};
    var session = readSession();
    if (!session || !session.access_token) {
      window.location.href = signInUrl("dashboard.html");
      return Promise.resolve(null);
    }
    showCheckoutLoading("Opening billing…");
    return authenticatedPost(
      portalEndpoint(),
      {
        returnUrl: opts.returnUrl || (window.location.origin + "/dashboard.html"),
      },
      session,
      "portal"
    )
      .then(function (data) {
        if (!data || !data.portalUrl) throw new Error("Portal URL missing");
        window.location.assign(data.portalUrl);
        return data;
      })
      .catch(function (err) {
        hideCheckoutLoading();
        throw err;
      });
  }

  function wireCheckoutClick(el, planAttr, returnPath) {
    if (!el || el.getAttribute("data-dodo-wired") === "1") return;
    el.setAttribute("data-dodo-wired", "1");
    var idleLabel = el.textContent;
    el.addEventListener("click", function (event) {
      event.preventDefault();
      if (el.getAttribute("aria-busy") === "true") return;
      var planId = el.getAttribute(planAttr);
      if (planId !== "monthly" && planId !== "yearly") planId = "yearly";
      // Dashboard / in-app CTAs open the custom paywall; pricing page goes straight to Dodo.
      if (planAttr === "data-dodo-checkout" && typeof openPaywall === "function") {
        openPaywall({ planId: planId });
        return;
      }
      el.setAttribute("aria-busy", "true");
      el.classList.add("is-loading");
      if (el.id === "guided-plan-upgrade") el.textContent = "Opening checkout…";
      startCheckout(planId, {
        returnPath: returnPath || (window.location.pathname.split("/").pop() || "dashboard.html"),
      }).then(function () {
        el.textContent = idleLabel;
        el.removeAttribute("aria-busy");
        el.classList.remove("is-loading");
      }).catch(function (err) {
        console.error("[dodo]", err);
        el.textContent = idleLabel;
        el.removeAttribute("aria-busy");
        el.classList.remove("is-loading");
        window.alert(err && err.message ? err.message : "Could not start checkout.");
      });
    });
  }

  function wirePricingButtons() {
    document.querySelectorAll("[data-dodo-plan]").forEach(function (button) {
      wireCheckoutClick(button, "data-dodo-plan", "pricing.html");
    });
    document.querySelectorAll("[data-dodo-checkout]").forEach(function (el) {
      wireCheckoutClick(el, "data-dodo-checkout", "dashboard.html");
    });
  }

  function autoStartFromQuery() {
    try {
      var params = new URLSearchParams(window.location.search);
      var plan = params.get("plan");
      if (plan !== "monthly" && plan !== "yearly") return;
      if (!readSession() || !readSession().access_token) return;
      openPaywall({ planId: plan }).catch(function (err) {
        console.error("[dodo]", err);
      });
    } catch (e) {}
  }

  var paywallEl = null;
  var paywallSelected = "yearly";
  var paywallStep = "plans";
  var paywallMode = "";
  var paywallCheckoutPlan = "";
  var paywallStoryCta = "Unlock the story";
  var paywallStoryPrice = "$1.99";
  var paywallInlineBusy = false;
  var PAYWALL_PLANS = {
    monthly: {
      id: "monthly",
      label: "Monthly",
      price: "9.99$",
      period: "/month",
      trial: false,
    },
    yearly: {
      id: "yearly",
      label: "Yearly",
      price: "59.99$",
      period: "/year",
      perMonth: "5.00$",
      strikeMonthly: "9.99$",
      savings: 50,
      trialDays: 7,
      trial: true,
    },
  };

  function ensurePaywallStyles() {
    var existing = document.getElementById("nanik-paywall-styles");
    if (existing) existing.remove();
    var style = document.createElement("style");
    style.id = "nanik-paywall-styles";
    style.textContent = [
      ".nanik-paywall{position:fixed;inset:0;z-index:6859500;display:flex;align-items:stretch;justify-content:center;background:#9869FF}",
      ".nanik-paywall[hidden]{display:none!important}",
      ".nanik-paywall-shell{position:relative;width:min(100%,480px);margin:0 auto;height:100%;height:100dvh;max-height:100dvh;overflow:hidden;display:flex;flex-direction:column;background:#9869FF}",
      ".nanik-paywall-shell.is-pay{justify-content:stretch}",
      ".nanik-paywall-bg{position:absolute;inset:0;background:#9869FF}",
      ".nanik-paywall-scrim{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(152,105,255,.12) 0%,rgba(72,40,140,.28) 45%,rgba(40,18,90,.62) 100%)}",
      ".nanik-paywall-top{position:relative;z-index:2;display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:max(16px,calc(env(safe-area-inset-top) + 12px)) 20px 4px;flex-shrink:0}",
      ".nanik-paywall-shell.is-pay .nanik-paywall-top{padding:max(14px,calc(env(safe-area-inset-top) + 10px)) 16px 8px;align-items:center}",
      ".nanik-paywall-title{margin:0;max-width:16ch;color:#fff;font:800 24px/1.15 ui-rounded,system-ui,sans-serif;letter-spacing:-.03em}",
      ".nanik-paywall-shell.is-pay .nanik-paywall-title{max-width:none;flex:1;font:800 18px/1.25 ui-rounded,system-ui,sans-serif;letter-spacing:-.02em}",
      ".nanik-paywall-close{appearance:none;width:36px;height:36px;border:0;border-radius:18px;background:rgba(0,0,0,.35);color:#fff;font:700 22px/1 system-ui,sans-serif;cursor:pointer;flex-shrink:0;margin-top:0}",
      ".nanik-paywall-shell.is-pay .nanik-paywall-close{margin-top:0}",
      ".nanik-paywall-hero{position:relative;z-index:1;flex:0 1 auto;display:flex;align-items:center;justify-content:center;min-height:0;max-height:min(22vh,140px);padding:4px 20px;pointer-events:none}",
      ".nanik-paywall-shell.is-pay .nanik-paywall-hero{display:none}",
      ".nanik-paywall-hero img{display:block;width:min(36vw,140px);height:auto;max-height:min(20vh,130px);object-fit:contain;filter:drop-shadow(0 0 18px rgba(255,214,90,.45)) drop-shadow(0 12px 28px rgba(0,0,0,.35));animation:nanik-paywall-gift 3.2s ease-in-out infinite}",
      "@keyframes nanik-paywall-gift{0%,100%{transform:translateY(0) scale(1);filter:drop-shadow(0 0 14px rgba(255,214,90,.38)) drop-shadow(0 12px 28px rgba(0,0,0,.35))}50%{transform:translateY(-6px) scale(1.04);filter:drop-shadow(0 0 26px rgba(255,214,90,.7)) drop-shadow(0 14px 32px rgba(0,0,0,.4))}}",
      "@media(prefers-reduced-motion:reduce){.nanik-paywall-hero img{animation:none}}",
      ".nanik-paywall-dock{position:relative;z-index:2;flex:1 1 auto;min-height:0;display:flex;flex-direction:column;padding:8px 20px max(16px,env(safe-area-inset-bottom));animation:nanik-paywall-up .45s ease}",
      ".nanik-paywall-shell.is-pay .nanik-paywall-dock{flex:1;padding:0 12px max(10px,env(safe-area-inset-bottom));animation:none}",
      "@keyframes nanik-paywall-up{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}",
      ".nanik-paywall-trial-badge{display:inline-flex;align-items:center;gap:6px;margin:0 0 8px;padding:5px 10px;border-radius:999px;background:rgba(255,255,255,.14);color:#fff;font:700 12px/1.2 ui-rounded,system-ui,sans-serif;flex-shrink:0}",
      ".nanik-paywall-trial-badge[hidden]{display:none!important}",
      ".nanik-paywall-status{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 10px;padding:10px 12px;border-radius:14px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.18);color:#fff;flex-shrink:0}",
      ".nanik-paywall-status[hidden]{display:none!important}",
      ".nanik-paywall-status-copy{display:grid;gap:2px;min-width:0}",
      ".nanik-paywall-status-label{font:650 12px/1.2 ui-rounded,system-ui,sans-serif;opacity:.78}",
      ".nanik-paywall-status-value{font:800 15px/1.2 ui-rounded,system-ui,sans-serif}",
      ".nanik-paywall-status-pill{flex-shrink:0;padding:5px 10px;border-radius:999px;background:rgba(255,255,255,.16);font:800 11px/1 ui-rounded,system-ui,sans-serif;letter-spacing:.04em;text-transform:uppercase}",
      ".nanik-paywall-status-pill.is-free{background:rgba(255,229,102,.22);color:#ffe566}",
      ".nanik-paywall-step[data-paywall-step=plans]{flex:1;min-height:0;display:flex;flex-direction:column}",
      ".nanik-paywall-benefits{display:grid;gap:8px;margin:0 0 10px;flex:1 1 auto;min-height:0;overflow:auto;-webkit-overflow-scrolling:touch}",
      ".nanik-paywall-benefit{display:flex;align-items:center;gap:8px;color:#fff;font:600 14px/1.25 ui-rounded,system-ui,sans-serif}",
      ".nanik-paywall-ico{width:28px;height:28px;border-radius:14px;background:rgba(0,0,0,.28);display:grid;place-items:center;flex-shrink:0;color:#ffe566}",
      ".nanik-paywall-ico svg{width:14px;height:14px}",
      ".nanik-paywall-plans{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:0 0 12px;flex-shrink:0;align-items:stretch}",
      ".nanik-paywall-plan{appearance:none;width:100%;min-height:118px;text-align:left;border:1.5px solid rgba(255,255,255,.22);border-radius:18px;background:rgba(0,0,0,.36);color:#fff;padding:14px 12px;cursor:pointer;font:inherit;display:flex;flex-direction:column;gap:6px;box-sizing:border-box;overflow:hidden}",
      ".nanik-paywall-plan.is-on{border-color:#d946ef;background:rgba(217,70,239,.28);box-shadow:0 0 0 1px rgba(217,70,239,.45)}",
      ".nanik-paywall-plan.is-yearly{padding:0;gap:0}",
      ".nanik-paywall-plan-banner{display:flex;align-items:center;justify-content:center;width:100%;min-height:28px;padding:6px 10px;background:#d946ef;color:#fff;font:800 12px/1 ui-rounded,system-ui,sans-serif;letter-spacing:.04em;text-transform:uppercase;box-sizing:border-box}",
      ".nanik-paywall-plan.is-on .nanik-paywall-plan-banner{background:#e879f9}",
      ".nanik-paywall-plan.is-yearly .nanik-paywall-plan-body{display:flex;flex-direction:column;gap:6px;flex:1;padding:12px;box-sizing:border-box}",
      ".nanik-paywall-plan-row{display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-start;gap:8px}",
      ".nanik-paywall-plan-label{font:800 14px/1.2 ui-rounded,system-ui,sans-serif}",
      ".nanik-paywall-plan-price{font:800 22px/1.05 ui-rounded,system-ui,sans-serif}",
      ".nanik-paywall-save{display:inline-flex;margin:0;padding:3px 8px;border-radius:999px;background:#d946ef;color:#fff;font:800 10px/1.2 ui-rounded,system-ui,sans-serif;vertical-align:middle}",
      ".nanik-paywall-plan-meta{margin-top:auto;display:flex;flex-direction:column;flex-wrap:nowrap;align-items:flex-start;gap:2px;font:600 11px/1.25 ui-rounded,system-ui,sans-serif}",
      ".nanik-paywall-strike{color:rgba(255,255,255,.55);text-decoration:line-through}",
      ".nanik-paywall-gold{color:#ffe566}",
      ".nanik-paywall-plan-trial{margin-top:2px;color:rgba(255,255,255,.82);font:650 11px/1.25 ui-rounded,system-ui,sans-serif}",
      ".nanik-paywall-story{flex:1 1 auto;min-height:0;overflow:auto;-webkit-overflow-scrolling:touch;margin:4px 0 12px}",
      ".nanik-paywall-story[hidden]{display:none!important}",
      ".nanik-paywall-story .guided-plan-cards{margin:0}",
      ".nanik-paywall-or{margin:0 0 8px;color:#fff;font:700 14px/1.35 ui-rounded,system-ui,sans-serif;text-align:center;flex-shrink:0}",
      ".nanik-paywall-or[hidden]{display:none!important}",
      ".nanik-paywall-shell.is-story .nanik-paywall-hero,.nanik-paywall-shell.is-story .nanik-paywall-benefits,.nanik-paywall-shell.is-story .nanik-paywall-trial-badge{display:none!important}",
      ".nanik-paywall-shell.is-story .nanik-paywall-title{max-width:none}",
      ".nanik-paywall-cta{appearance:none;width:100%;min-height:50px;border:0;border-radius:999px;background:#fff;color:#181818;font:800 16px/1.1 ui-rounded,system-ui,sans-serif;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;gap:12px}",
      ".nanik-paywall-shell.is-story .nanik-paywall-cta{justify-content:space-between;padding:0 22px}",
      ".nanik-paywall-cta-price{font:800 16px/1 ui-rounded,system-ui,sans-serif}",
      ".nanik-paywall-cta-price[hidden]{display:none!important}",
      ".nanik-paywall-cta[aria-busy=true]{opacity:.7;cursor:wait}",
      ".nanik-paywall-legal{margin:8px 0 0;text-align:center;color:rgba(255,255,255,.78);font:500 11px/1.4 ui-rounded,system-ui,sans-serif;flex-shrink:0}",
      ".nanik-paywall-legal a{color:rgba(255,255,255,.9);text-decoration:none}",
      ".nanik-paywall-legal span{opacity:.45;margin:0 6px}",
      ".nanik-paywall-step[hidden]{display:none!important}",
      ".nanik-paywall-step[data-paywall-step=pay]{flex:1;display:flex;flex-direction:column;min-height:0;gap:8px}",
      ".nanik-paywall-pay-head{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-shrink:0;padding:0 4px}",
      ".nanik-paywall-back{appearance:none;border:0;border-radius:999px;padding:8px 14px;background:rgba(255,255,255,.14);color:#fff;font:700 13px/1.2 ui-rounded,system-ui,sans-serif;cursor:pointer}",
      ".nanik-paywall-plan-chip{color:#fff;font:700 12px/1.3 ui-rounded,system-ui,sans-serif;opacity:.92;text-align:right}",
      ".nanik-paywall-checkout-card{position:relative;flex:1;min-height:0;border-radius:18px 18px 0 0;overflow:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;background:#f7f4ff;box-shadow:0 18px 50px rgba(0,0,0,.35)}",
      ".nanik-paywall-dodo{width:100%;min-height:100%;height:auto}",
      ".nanik-paywall-dodo>div,.nanik-paywall-dodo iframe{display:block;width:100%!important;min-height:min(780px,calc(100dvh - 120px))!important;height:auto!important;border:0;background:#f7f4ff}",
      ".nanik-paywall-checkout-status{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:24px;background:#f7f4ff;color:#1c1630;text-align:center}",
      ".nanik-paywall-checkout-status[hidden]{display:none!important}",
      ".nanik-paywall-checkout-status p{margin:0;max-width:280px;font:600 15px/1.4 ui-rounded,system-ui,sans-serif}",
      ".nanik-paywall-checkout-status button{appearance:none;border:0;border-radius:999px;padding:10px 16px;background:#1c1630;color:#fff;font:700 13px/1.2 ui-rounded,system-ui,sans-serif;cursor:pointer}",
      "@media(max-height:700px){.nanik-paywall-title{font-size:22px}.nanik-paywall-hero{max-height:min(16vh,108px)}.nanik-paywall-hero img{width:min(30vw,112px);max-height:min(14vh,96px)}.nanik-paywall-benefit{font-size:13px}.nanik-paywall-benefits{gap:6px}.nanik-paywall-plan{min-height:104px;padding:12px 10px}.nanik-paywall-plan.is-yearly{padding:0}.nanik-paywall-plan.is-yearly .nanik-paywall-plan-body{padding:10px}.nanik-paywall-plan-banner{min-height:26px;font-size:11px}.nanik-paywall-plan-price{font-size:20px}.nanik-paywall-cta{min-height:48px}}",
      "@media(max-height:620px){.nanik-paywall-title{font-size:20px;max-width:18ch}.nanik-paywall-top{padding-top:max(10px,calc(env(safe-area-inset-top) + 8px));padding-bottom:2px}.nanik-paywall-hero{max-height:min(12vh,80px);padding:2px 16px}.nanik-paywall-hero img{width:min(26vw,88px);max-height:min(11vh,72px)}.nanik-paywall-dock{padding-left:16px;padding-right:16px}.nanik-paywall-benefits{gap:5px;margin-bottom:8px}.nanik-paywall-benefit{font-size:12px;gap:6px}.nanik-paywall-ico{width:24px;height:24px;border-radius:12px}.nanik-paywall-ico svg{width:12px;height:12px}.nanik-paywall-plans{gap:8px;margin-bottom:8px}.nanik-paywall-plan{min-height:96px;padding:10px 8px;border-radius:16px}.nanik-paywall-plan.is-yearly{padding:0}.nanik-paywall-plan.is-yearly .nanik-paywall-plan-body{padding:8px}.nanik-paywall-plan-banner{min-height:24px;padding:5px 8px;font-size:11px}.nanik-paywall-plan-label{font-size:13px}.nanik-paywall-plan-price{font-size:18px}.nanik-paywall-cta{min-height:46px;font-size:15px}.nanik-paywall-legal{margin-top:6px;font-size:10px}}",
      "@media(min-width:720px){.nanik-paywall{align-items:center;padding:24px;background:rgba(152,105,255,.55);backdrop-filter:blur(10px)}.nanik-paywall-shell{height:min(820px,92dvh);max-height:92dvh;border-radius:28px;box-shadow:0 24px 80px rgba(72,40,140,.45)}.nanik-paywall-shell.is-pay{height:min(860px,94dvh);max-height:94dvh}.nanik-paywall-title{font-size:28px;max-width:15ch}.nanik-paywall-shell.is-pay .nanik-paywall-title{font-size:18px}.nanik-paywall-hero{max-height:min(24vh,160px)}.nanik-paywall-hero img{width:min(28vw,160px);max-height:min(22vh,150px)}.nanik-paywall-checkout-card{border-radius:18px}.nanik-paywall-dodo>div,.nanik-paywall-dodo iframe{min-height:640px!important}}",
    ].join("");
    document.head.appendChild(style);
  }

  function paywallIcon(kind) {
    if (kind === "book") {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>';
    }
    if (kind === "voice") {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';
    }
    if (kind === "mic") {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>';
    }
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>';
  }

  function setPaywallCheckoutLoading(loading) {
    if (!paywallEl) return;
    var status = paywallEl.querySelector("[data-paywall-checkout-status]");
    var text = paywallEl.querySelector("[data-paywall-checkout-status-text]");
    var retry = paywallEl.querySelector("[data-paywall-checkout-retry]");
    if (!status) return;
    if (loading) {
      status.hidden = false;
      if (text) text.textContent = "Preparing secure checkout…";
      if (retry) retry.hidden = true;
    } else if (paywallStep === "pay" && (!text || !/expired|could not|failed|try again/i.test(text.textContent || ""))) {
      status.hidden = true;
    }
  }

  function setPaywallCheckoutError(message) {
    if (!paywallEl) return;
    var status = paywallEl.querySelector("[data-paywall-checkout-status]");
    var text = paywallEl.querySelector("[data-paywall-checkout-status-text]");
    var retry = paywallEl.querySelector("[data-paywall-checkout-retry]");
    if (status) status.hidden = false;
    if (text) text.textContent = message || "Checkout could not load.";
    if (retry) retry.hidden = false;
  }

  function setPaywallStep(step) {
    if (!paywallEl) return;
    paywallStep = step === "pay" ? "pay" : "plans";
    var shell = paywallEl.querySelector(".nanik-paywall-shell");
    var plansStep = paywallEl.querySelector('[data-paywall-step="plans"]');
    var payStep = paywallEl.querySelector('[data-paywall-step="pay"]');
    var titleEl = paywallEl.querySelector("#nanik-paywall-title");
    if (shell) shell.classList.toggle("is-pay", paywallStep === "pay");
    if (plansStep) plansStep.hidden = paywallStep !== "plans";
    if (payStep) payStep.hidden = paywallStep !== "pay";
    if (titleEl) {
      titleEl.textContent =
        paywallStep === "pay"
          ? "Complete your subscription"
          : "Bring every story to life in your own voice";
    }
  }

  function showPaywallPlansStep() {
    closeDodoCheckout();
    paywallInlineBusy = false;
    var mount = paywallEl && paywallEl.querySelector("#nanik-paywall-dodo");
    if (mount) mount.innerHTML = "";
    var cta = paywallEl && paywallEl.querySelector("[data-paywall-cta]");
    if (cta) cta.removeAttribute("aria-busy");
    paywallCheckoutPlan = "";
    setPaywallStep("plans");
    renderPaywallPlans();
  }

  function updatePaywallPlanChip() {
    if (!paywallEl) return;
    var chip = paywallEl.querySelector("[data-paywall-plan-chip]");
    if (!chip) return;
    if (paywallCheckoutPlan === "story") {
      chip.textContent = paywallStoryCta + " · " + paywallStoryPrice;
      return;
    }
    var plan = PAYWALL_PLANS[paywallSelected] || PAYWALL_PLANS.yearly;
    chip.textContent =
      plan.label +
      " · " +
      plan.price +
      plan.period +
      (plan.trial && plan.trialDays ? " · " + plan.trialDays + "-day trial" : "");
  }

  function startPaywallInlineCheckout(planId) {
    if (!paywallEl || paywallInlineBusy) return Promise.resolve(null);
    paywallInlineBusy = true;
    planId = planId === "monthly" || planId === "story" ? planId : "yearly";
    if (planId !== "story") paywallSelected = planId;
    paywallCheckoutPlan = planId;
    updatePaywallPlanChip();
    setPaywallStep("pay");
    setPaywallCheckoutLoading(true);
    var statusText = paywallEl.querySelector("[data-paywall-checkout-status-text]");
    if (statusText) statusText.textContent = "Opening secure checkout…";
    var mount = paywallEl.querySelector("#nanik-paywall-dodo");
    if (mount) mount.innerHTML = "";

    return createCheckoutSession(planId, {
      returnPath: "dashboard.html",
      returnUrl: currentReturnUrl(),
      forceProduct: true,
    })
      .then(function (data) {
        paywallInlineBusy = false;
        if (!data) {
          showPaywallPlansStep();
          return null;
        }
        if (!data.checkoutUrl) throw new Error("Checkout URL missing");
        // Top-level hosted page (not iframe): Apple Pay only appears outside iframes.
        window.location.assign(data.checkoutUrl);
        return data;
      })
      .catch(function (err) {
        paywallInlineBusy = false;
        console.error("[dodo-paywall]", err);
        setPaywallCheckoutError(err && err.message ? err.message : "Could not start checkout.");
        return null;
      });
  }

  function renderPaywallPlans() {
    if (!paywallEl) return;
    var monthly = PAYWALL_PLANS.monthly;
    var yearly = PAYWALL_PLANS.yearly;
    var plans = paywallEl.querySelector("[data-paywall-plans]");
    var badge = paywallEl.querySelector("[data-paywall-trial-badge]");
    if (badge) {
      var showBadge = paywallMode !== "story" && paywallSelected === "yearly" && yearly.trial;
      badge.hidden = !showBadge;
      badge.textContent = yearly.trialDays + "-day free trial";
    }
    if (plans) {
      var monthlyOn = paywallMode !== "story" && paywallSelected === "monthly";
      var yearlyOn = paywallMode !== "story" && paywallSelected === "yearly";
      plans.innerHTML =
        '<button type="button" class="nanik-paywall-plan' +
        (monthlyOn ? " is-on" : "") +
        '" data-paywall-plan="monthly">' +
        '<div class="nanik-paywall-plan-row"><span class="nanik-paywall-plan-label">' +
        monthly.label +
        '</span><span class="nanik-paywall-plan-price">' +
        monthly.price +
        '<span style="font-size:13px;font-weight:700;opacity:.85">' +
        monthly.period +
        "</span></span></div></button>" +
        '<button type="button" class="nanik-paywall-plan is-yearly' +
        (yearlyOn ? " is-on" : "") +
        '" data-paywall-plan="yearly">' +
        '<div class="nanik-paywall-plan-banner">' +
        yearly.savings +
        "% off</div>" +
        '<div class="nanik-paywall-plan-body">' +
        '<div class="nanik-paywall-plan-row"><span class="nanik-paywall-plan-label">' +
        yearly.label +
        '</span><span class="nanik-paywall-plan-price">' +
        yearly.price +
        '<span style="font-size:13px;font-weight:700;opacity:.85">' +
        yearly.period +
        "</span></span></div>" +
        '<div class="nanik-paywall-plan-meta"><span class="nanik-paywall-strike">' +
        yearly.strikeMonthly +
        '/mo</span><span class="nanik-paywall-gold">' +
        yearly.perMonth +
        "/mo</span></div>" +
        "</div></button>";
      plans.querySelectorAll("[data-paywall-plan]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var next = btn.getAttribute("data-paywall-plan") === "monthly" ? "monthly" : "yearly";
          paywallSelected = next;
          if (paywallMode === "story") {
            var unlock = paywallEl.querySelector("[data-paywall-cta]");
            if (unlock && unlock.getAttribute("aria-busy") === "true") return;
            if (unlock) unlock.setAttribute("aria-busy", "true");
            startPaywallInlineCheckout(next).finally(function () {
              if (unlock) unlock.removeAttribute("aria-busy");
            });
            return;
          }
          renderPaywallPlans();
        });
      });
    }
    if (paywallMode === "story") setPaywallCta(paywallStoryCta, paywallStoryPrice);
    else setPaywallCta(paywallSelected === "yearly" && yearly.trial ? "Try for Free 7 days" : "Subscribe");
  }

  function ensurePaywall() {
    ensureOverlayStyles();
    ensurePaywallStyles();
    if (paywallEl) return paywallEl;
    paywallEl = document.createElement("div");
    paywallEl.className = "nanik-paywall";
    paywallEl.hidden = true;
    paywallEl.setAttribute("role", "dialog");
    paywallEl.setAttribute("aria-modal", "true");
    paywallEl.setAttribute("aria-labelledby", "nanik-paywall-title");
    paywallEl.innerHTML =
      '<div class="nanik-paywall-shell">' +
      '<div class="nanik-paywall-bg" aria-hidden="true"></div>' +
      '<div class="nanik-paywall-scrim" aria-hidden="true"></div>' +
      '<div class="nanik-paywall-top">' +
      '<h2 class="nanik-paywall-title" id="nanik-paywall-title">Bring every story to life in your own voice</h2>' +
      '<button type="button" class="nanik-paywall-close" data-paywall-close aria-label="Close">&times;</button>' +
      "</div>" +
      '<div class="nanik-paywall-hero" aria-hidden="true">' +
      '<img src="images/paywall-gift.png?v=20260922alpha1" alt="" width="434" height="452" decoding="async">' +
      "</div>" +
      '<div class="nanik-paywall-dock">' +
      '<div class="nanik-paywall-step" data-paywall-step="plans">' +
      '<div class="nanik-paywall-status" data-paywall-status hidden>' +
      '<div class="nanik-paywall-status-copy">' +
      '<span class="nanik-paywall-status-label" data-paywall-status-label>Current plan</span>' +
      '<span class="nanik-paywall-status-value" data-paywall-status-value>Freemium</span>' +
      "</div>" +
      '<span class="nanik-paywall-status-pill is-free" data-paywall-status-pill>Free</span>' +
      "</div>" +
      '<div class="nanik-paywall-trial-badge" data-paywall-trial-badge hidden></div>' +
      '<div class="nanik-paywall-story" data-paywall-story hidden></div>' +
      '<p class="nanik-paywall-or" data-paywall-or hidden>or Subscribe to get more stories</p>' +
      '<div class="nanik-paywall-benefits">' +
      '<div class="nanik-paywall-benefit"><span class="nanik-paywall-ico" aria-hidden="true">' +
      paywallIcon("book") +
      "</span>60 stories every month</div>" +
      '<div class="nanik-paywall-benefit"><span class="nanik-paywall-ico" aria-hidden="true">' +
      paywallIcon("voice") +
      "</span>Tell with voice</div>" +
      '<div class="nanik-paywall-benefit"><span class="nanik-paywall-ico" aria-hidden="true">' +
      paywallIcon("mic") +
      "</span>More than 1 voice clone</div>" +
      '<div class="nanik-paywall-benefit"><span class="nanik-paywall-ico" aria-hidden="true">' +
      paywallIcon("book") +
      "</span>More than 1 child profile</div>" +
      '<div class="nanik-paywall-benefit"><span class="nanik-paywall-ico" aria-hidden="true">' +
      paywallIcon("zap") +
      "</span>Advanced AI models for story generation</div>" +
      "</div>" +
      '<div class="nanik-paywall-plans" data-paywall-plans></div>' +
      '<button type="button" class="nanik-paywall-cta" data-paywall-cta><span data-paywall-cta-label>Try for Free 7 days</span><span class="nanik-paywall-cta-price" data-paywall-cta-price hidden>$1.99</span></button>' +
      '<p class="nanik-paywall-legal">' +
      '<a href="terms.html" target="_blank" rel="noopener">Terms of Use</a><span>·</span>' +
      '<a href="privacy.html" target="_blank" rel="noopener">Privacy Policy</a>' +
      "</p></div>" +
      '<div class="nanik-paywall-step" data-paywall-step="pay" hidden>' +
      '<div class="nanik-paywall-pay-head">' +
      '<button type="button" class="nanik-paywall-back" data-paywall-back>← Plans</button>' +
      '<span class="nanik-paywall-plan-chip" data-paywall-plan-chip></span>' +
      "</div>" +
      '<div class="nanik-paywall-checkout-card">' +
      '<div class="nanik-paywall-checkout-status" data-paywall-checkout-status>' +
      '<div class="nanik-checkout-spinner" aria-hidden="true"></div>' +
      '<p data-paywall-checkout-status-text>Preparing secure checkout…</p>' +
      '<button type="button" data-paywall-checkout-retry hidden>Try again</button>' +
      "</div>" +
      '<div id="nanik-paywall-dodo" class="nanik-paywall-dodo"></div>' +
      "</div></div></div></div>";
    document.body.appendChild(paywallEl);
    paywallEl.querySelector("[data-paywall-close]").addEventListener("click", closePaywall);
    paywallEl.addEventListener("click", function (event) {
      if (event.target === paywallEl) closePaywall();
    });
    paywallEl.querySelector("[data-paywall-back]").addEventListener("click", function () {
      showPaywallPlansStep();
    });
    paywallEl.querySelector("[data-paywall-checkout-retry]").addEventListener("click", function () {
      startPaywallInlineCheckout(paywallSelected);
    });
    paywallEl.querySelector("[data-paywall-cta]").addEventListener("click", function () {
      var cta = paywallEl.querySelector("[data-paywall-cta]");
      if (cta.getAttribute("aria-busy") === "true") return;
      var planId = paywallMode === "story"
        ? "story"
        : (paywallSelected === "monthly" ? "monthly" : "yearly");
      cta.setAttribute("aria-busy", "true");
      startPaywallInlineCheckout(planId).finally(function () {
        cta.removeAttribute("aria-busy");
      });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape" || !paywallEl || paywallEl.hidden) return;
      if (paywallStep === "pay") showPaywallPlansStep();
      else closePaywall();
    });
    return paywallEl;
  }

  function closePaywall() {
    if (!paywallEl) return;
    closeDodoCheckout();
    paywallInlineBusy = false;
    var mount = paywallEl.querySelector("#nanik-paywall-dodo");
    if (mount) mount.innerHTML = "";
    setPaywallStep("plans");
    paywallCheckoutPlan = "";
    paywallMode = "";
    var shell = paywallEl.querySelector(".nanik-paywall-shell");
    if (shell) shell.classList.remove("is-story");
    paywallEl.hidden = true;
    document.body.style.overflow = "";
  }

  function setPaywallCta(label, price) {
    if (!paywallEl) return;
    var cta = paywallEl.querySelector("[data-paywall-cta]");
    if (!cta) return;
    var labelEl = cta.querySelector("[data-paywall-cta-label]");
    var priceEl = cta.querySelector("[data-paywall-cta-price]");
    if (labelEl) labelEl.textContent = label;
    else cta.textContent = label;
    if (priceEl) {
      priceEl.hidden = !price;
      if (price) priceEl.textContent = price;
    }
  }

  function openPaywall(options) {
    var opts = options || {};
    ensurePaywall();
    paywallMode = opts.variant === "story" ? "story" : "";
    paywallStoryCta = String(opts.ctaLabel || "Unlock the story");
    paywallStoryPrice = String(opts.price || "$1.99");
    paywallSelected = opts.planId === "monthly" ? "monthly" : "yearly";
    var shell = paywallEl.querySelector(".nanik-paywall-shell");
    if (shell) shell.classList.toggle("is-story", paywallMode === "story");
    var story = paywallEl.querySelector("[data-paywall-story]");
    if (story) {
      story.hidden = paywallMode !== "story";
      story.innerHTML = paywallMode === "story" ? String(opts.cardsHtml || "") : "";
    }
    var orLine = paywallEl.querySelector("[data-paywall-or]");
    if (orLine) {
      orLine.hidden = paywallMode !== "story";
      if (opts.orLabel) orLine.textContent = String(opts.orLabel);
    }
    showPaywallPlansStep();
    var titleEl = paywallEl.querySelector("#nanik-paywall-title");
    var status = paywallEl.querySelector("[data-paywall-status]");
    var statusLabel = paywallEl.querySelector("[data-paywall-status-label]");
    var statusValue = paywallEl.querySelector("[data-paywall-status-value]");
    var statusPill = paywallEl.querySelector("[data-paywall-status-pill]");
    var showBillingStatus = opts.mode === "billing" || opts.showFreemiumStatus === true;
    if (status) {
      status.hidden = !showBillingStatus;
      if (showBillingStatus) {
        if (statusLabel) statusLabel.textContent = opts.statusLabel || "Current plan";
        if (statusValue) statusValue.textContent = opts.statusValue || "Freemium";
        if (statusPill) {
          statusPill.textContent = opts.statusPill || "Free";
          statusPill.classList.toggle("is-free", String(opts.statusPill || "Free").toLowerCase() !== "plus");
        }
      }
    }
    if (titleEl && paywallStep === "plans") {
      titleEl.textContent = String(
        opts.title ||
          (showBillingStatus
            ? "Upgrade your plan"
            : "Bring every story to life in your own voice")
      ).trim();
    }
    renderPaywallPlans();
    if (showBillingStatus && paywallMode !== "story") {
      var yearly = PAYWALL_PLANS.yearly;
      setPaywallCta(
        paywallSelected === "yearly" && yearly.trial ? "Try for Free 7 days" : "Upgrade to Plus"
      );
    }
    paywallEl.hidden = false;
    document.body.style.overflow = "hidden";
    return Promise.resolve(true);
  }

  function openBilling(options) {
    var opts = options || {};
    var quota = window.NANIK_QUOTA_STATE || {};
    var isPlus = !!quota.isPlus;
    if (isPlus && typeof openPortal === "function") {
      return openPortal(opts).catch(function (err) {
        console.warn("[billing portal]", err);
        return openPaywall({
          mode: "billing",
          showFreemiumStatus: true,
          title: opts.title || "Manage payment",
          statusLabel: "Current plan",
          statusValue: "Plus",
          statusPill: "Plus",
          planId: opts.planId || "yearly",
        }).then(function (result) {
          if (paywallEl) {
            var pill = paywallEl.querySelector("[data-paywall-status-pill]");
            if (pill) pill.classList.remove("is-free");
          }
          return result;
        });
      });
    }
    return openPaywall({
      mode: "billing",
      showFreemiumStatus: true,
      title: opts.title || "Manage payment",
      statusLabel: opts.statusLabel || "Current plan",
      statusValue: opts.statusValue || "Freemium",
      statusPill: opts.statusPill || "Free",
      planId: opts.planId || "yearly",
    });
  }

  window.NanikPayments = {
    startCheckout: startCheckout,
    openPortal: openPortal,
    syncSubscription: syncSubscription,
    openPaywall: openPaywall,
    openBilling: openBilling,
    closePaywall: closePaywall,
  };

  function handleCheckoutReturnOnLoad() {
    try {
      var params = new URLSearchParams(window.location.search);
      var status = String(params.get("status") || "").toLowerCase();
      var subscriptionId = params.get("subscription_id") || params.get("subscriptionId") || "";
      var sessionId = params.get("session_id") || params.get("checkout_session_id") || "";
      var marked = params.get("nanik_checkout") === "1";
      var success = status === "success" || (!!subscriptionId && status !== "failed");
      if (!marked && !success && !sessionId) return;

      // If this page loaded inside the checkout overlay/iframe, tell the parent.
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(
          {
            type: "nanik:checkout-complete",
            status: status || (success ? "success" : ""),
            subscriptionId: subscriptionId,
            sessionId: sessionId,
          },
          window.location.origin
        );
        return;
      }

      if (status === "failed") return;
      syncSubscription({
        subscriptionId: subscriptionId,
        sessionId: sessionId,
      }).finally(function () {
        try {
          var clean = new URL(window.location.href);
          [
            "nanik_checkout",
            "status",
            "subscription_id",
            "subscriptionId",
            "session_id",
            "checkout_session_id",
            "payment_id",
          ].forEach(function (key) {
            clean.searchParams.delete(key);
          });
          window.history.replaceState({}, "", clean.pathname + clean.search + clean.hash);
        } catch (e) {}
      });
    } catch (e) {}
  }

  window.addEventListener("message", function (event) {
    if (event.origin !== window.location.origin) return;
    if (!event.data || event.data.type !== "nanik:checkout-complete") return;
    closeCheckoutModal();
    hideCheckoutLoading();
    syncSubscription({
      subscriptionId: event.data.subscriptionId || "",
      sessionId: event.data.sessionId || "",
    }).finally(function () {
      window.dispatchEvent(new CustomEvent("nanik:checkout-complete", { detail: event.data }));
    });
  });

  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && checkoutModalEl) closeCheckoutModal();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      wirePricingButtons();
      autoStartFromQuery();
      handleCheckoutReturnOnLoad();
    });
  } else {
    wirePricingButtons();
    autoStartFromQuery();
    handleCheckoutReturnOnLoad();
  }
})();
