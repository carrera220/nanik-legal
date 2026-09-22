(function () {
  var DESKTOP_MQ = '(min-width: 721px)';

  function isDesktop() {
    return window.matchMedia && window.matchMedia(DESKTOP_MQ).matches;
  }

  function syncToggleLabel() {
    var btn = document.querySelector('.nav-toggle');
    if (!btn) return;
    if (!btn.querySelector('.nav-toggle-bars')) {
      var bars = document.createElement('span');
      bars.className = 'nav-toggle-bars';
      bars.setAttribute('aria-hidden', 'true');
      btn.insertBefore(bars, btn.firstChild);
    }
    var label = btn.querySelector('.nav-toggle-label');
    var caret = btn.querySelector('.nav-toggle-caret');
    if (label) label.remove();
    if (caret) caret.remove();
    if (!btn.getAttribute('aria-label')) btn.setAttribute('aria-label', 'Menu');
  }

  function ensureDrawerChrome(menu) {
    if (!menu.querySelector('.site-nav-close')) {
      var close = document.createElement('button');
      close.type = 'button';
      close.className = 'site-nav-close';
      close.setAttribute('aria-label', 'Close menu');
      close.innerHTML = '&times;';
      menu.insertBefore(close, menu.firstChild);
    }

    if (!menu.querySelector('.site-nav-drawer-actions')) {
      var actions = document.createElement('div');
      actions.className = 'site-nav-drawer-actions';

      var login = document.createElement('button');
      login.type = 'button';
      login.className = 'site-nav-drawer-btn site-nav-drawer-btn-login';
      login.setAttribute('data-i18n', 'signup.login');
      login.textContent = 'Log in';

      var signup = document.createElement('button');
      signup.type = 'button';
      signup.className = 'site-nav-drawer-btn site-nav-drawer-btn-signup';
      signup.setAttribute('data-i18n', 'nav.startFree');
      signup.textContent = 'Sign up';

      actions.appendChild(login);
      actions.appendChild(signup);
      menu.appendChild(actions);

      login.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        closeMenuUi();
        if (typeof window.NANIK_OPEN_LOGIN === 'function') window.NANIK_OPEN_LOGIN();
        else if (typeof window.NANIK_OPEN_SIGNUP === 'function') window.NANIK_OPEN_SIGNUP();
      });
      signup.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        closeMenuUi();
        if (typeof window.NANIK_OPEN_SIGNUP === 'function') window.NANIK_OPEN_SIGNUP();
        else {
          var openBtn = document.getElementById('site-signup-open');
          if (openBtn) openBtn.click();
        }
      });
    }

    var backdrop = document.getElementById('site-nav-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'site-nav-backdrop';
      backdrop.className = 'site-nav-backdrop';
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.appendChild(backdrop);
    }
    return backdrop;
  }

  var closeMenuUi = function () {};

  function initNavToggle() {
    var btn = document.querySelector('.nav-toggle');
    var menu = document.getElementById('site-nav-links');
    if (!btn || !menu || btn.dataset.navReady) return;
    btn.dataset.navReady = '1';
    syncToggleLabel();

    var backdrop = ensureDrawerChrome(menu);

    function closeMenu() {
      menu.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-drawer-open');
      backdrop.setAttribute('aria-hidden', 'true');
    }
    function openMenu() {
      menu.classList.add('is-open');
      backdrop.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('nav-drawer-open');
      backdrop.setAttribute('aria-hidden', 'false');
    }
    closeMenuUi = closeMenu;

    function syncLayout() {
      closeMenu();
    }
    function toggleMenu(e) {
      e.preventDefault();
      e.stopPropagation();
      if (isDesktop()) return;
      if (menu.classList.contains('is-open')) closeMenu();
      else openMenu();
    }

    syncLayout();
    btn.addEventListener('click', toggleMenu);
    backdrop.addEventListener('click', closeMenu);
    var closeBtn = menu.querySelector('.site-nav-close');
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    if (window.matchMedia) {
      var mq = window.matchMedia(DESKTOP_MQ);
      if (mq.addEventListener) mq.addEventListener('change', syncLayout);
      else if (mq.addListener) mq.addListener(syncLayout);
    }
  }

  function prefersReduce() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (err) {
      return false;
    }
  }

  function normalizePath(path) {
    return String(path || '/')
      .replace(/\/index\.html$/i, '/')
      .replace(/\/+$/, '') || '/';
  }

  /** Smooth-scroll same-page hash links (Features, fact chips, etc.) so motion is visible. */
  function initSmoothSectionScroll() {
    function headerOffset() {
      var header = document.querySelector('header.site');
      if (!header) return 12;
      return Math.ceil(header.getBoundingClientRect().height) + 12;
    }

    function scrollToId(id, behavior) {
      var target = document.getElementById(id);
      if (!target) return false;
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset();
      top = Math.max(0, Math.round(top));
      window.scrollTo({
        top: top,
        behavior: behavior || (prefersReduce() ? 'auto' : 'smooth')
      });
      return true;
    }

    function scrollHomeTop(behavior) {
      window.scrollTo({
        top: 0,
        behavior: behavior || (prefersReduce() ? 'auto' : 'smooth')
      });
    }

    function isLandingPath(pathname) {
      var n = normalizePath(pathname);
      var file = String(pathname || '/').replace(/\/+$/, '').split('/').pop() || '';
      return n === '/' || file === 'index.html' || file === 'hy.html' || file === '';
    }

    document.addEventListener('click', function (e) {
      var link = e.target.closest && e.target.closest('a[href]');
      if (!link || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (link.target && link.target !== '' && link.target !== '_self') return;

      var href = link.getAttribute('href') || '';
      var url;
      try {
        url = new URL(href, location.href);
      } catch (err) {
        return;
      }
      if (url.origin !== location.origin) return;

      var samePath = normalizePath(url.pathname) === normalizePath(location.pathname);

      // Same-page section link (e.g. #features)
      if (samePath && url.hash && url.hash !== '#') {
        var id = decodeURIComponent(url.hash.slice(1));
        if (!id || !document.getElementById(id)) return;
        e.preventDefault();
        scrollToId(id);
        try {
          if (history.pushState) history.pushState(null, '', url.pathname + url.search + url.hash);
          else location.hash = url.hash;
        } catch (err) {}
        return;
      }

      // Home / brand while on landing with a hash — clear hash and return to top
      // (browsers keep scroll when only the hash is removed).
      if (samePath && isLandingPath(url.pathname) && (!url.hash || url.hash === '#') && location.hash) {
        e.preventDefault();
        try {
          if (history.pushState) history.pushState(null, '', url.pathname + url.search);
          else history.replaceState(null, '', url.pathname + url.search);
        } catch (err) {}
        scrollHomeTop();
      }
    });

    window.addEventListener('popstate', function () {
      if (location.hash && location.hash.length > 1) {
        scrollToId(decodeURIComponent(location.hash.slice(1)), 'auto');
      } else {
        scrollHomeTop('auto');
      }
    });

    window.addEventListener('hashchange', function () {
      if (!location.hash || location.hash === '#') {
        scrollHomeTop('auto');
      }
    });
  }

  function init() {
    initNavToggle();
    initSmoothSectionScroll();
    function isAuthHash(hash) {
      var h = String(hash || '').replace(/^#/, '');
      return (
        h.indexOf('access_token=') !== -1 ||
        h.indexOf('refresh_token=') !== -1 ||
        h.indexOf('error=') !== -1 ||
        h.indexOf('error_description=') !== -1
      );
    }
    // Arrive via /#features from another page — smooth scroll after layout.
    if (location.hash && location.hash.length > 1 && !isAuthHash(location.hash)) {
      var id = decodeURIComponent(location.hash.slice(1));
      var target = document.getElementById(id);
      if (target) {
        var header = document.querySelector('header.site');
        var offset = header ? Math.ceil(header.getBoundingClientRect().height) + 12 : 12;
        var reduce = prefersReduce();
        // Jump to section without first flashing the top of the page.
        var top = Math.max(0, Math.round(target.getBoundingClientRect().top + window.pageYOffset - offset));
        window.scrollTo(0, top);
        requestAnimationFrame(function () {
          top = Math.max(0, Math.round(target.getBoundingClientRect().top + window.pageYOffset - offset));
          window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
        });
      }
    } else if (!location.hash) {
      // Back/forward or in-page return to home without a hash should start at top.
      window.scrollTo(0, 0);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
