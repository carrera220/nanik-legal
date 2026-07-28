(function () {
  var LABEL_BY_FILE = {
    'languages.html': { key: 'nav.languages', en: 'Languages', hy: 'Լեզուներ' },
    'stories.html': { key: 'nav.stories', en: 'Stories', hy: 'Հեքիաթներ' },
    'pricing.html': { key: 'nav.pricing', en: 'Pricing', hy: 'Գներ' },
    'support.html': { key: 'nav.support', en: 'Support', hy: 'Աջակցություն' },
    'privacy.html': { key: 'nav.privacy', en: 'Privacy', hy: 'Գաղտնիություն' },
    'terms.html': { key: 'nav.terms', en: 'Terms', hy: 'Պայմաններ' },
    'hy.html': { key: null, en: 'Home', hy: 'Գլխավոր' }
  };
  var DESKTOP_MQ = '(min-width: 721px)';

  function currentFile() {
    var path = (location.pathname || '/').replace(/\/+$/, '');
    var file = path.split('/').pop();
    return file || 'index.html';
  }

  function isDesktop() {
    return window.matchMedia && window.matchMedia(DESKTOP_MQ).matches;
  }

  function syncToggleLabel() {
    var btn = document.querySelector('.nav-toggle');
    if (!btn) return;
    var label = btn.querySelector('.nav-toggle-label');
    if (!label) {
      label = document.createElement('span');
      label.className = 'nav-toggle-label';
      btn.insertBefore(label, btn.firstChild);
    }
    var meta = LABEL_BY_FILE[currentFile()] || { key: 'nav.home', en: 'Home', hy: 'Գլխավոր' };
    if (meta.key) {
      label.setAttribute('data-i18n', meta.key);
      label.textContent = meta.en;
    } else {
      label.removeAttribute('data-i18n');
      label.textContent = meta.hy;
    }
    if (!btn.querySelector('.nav-toggle-caret')) {
      var caret = document.createElement('span');
      caret.className = 'nav-toggle-caret';
      caret.setAttribute('aria-hidden', 'true');
      btn.appendChild(caret);
    }
    btn.setAttribute('aria-label', label.textContent);
  }

  function initNavToggle() {
    var btn = document.querySelector('.nav-toggle');
    var menu = document.getElementById('site-nav-links');
    if (!btn || !menu || btn.dataset.navReady) return;
    btn.dataset.navReady = '1';
    syncToggleLabel();

    function closeMenu() {
      menu.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    }
    function openMenu() {
      menu.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
    }
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
    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target) && !btn.contains(e.target)) closeMenu();
    });
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
    // Arrive via /#features from another page — smooth scroll after layout.
    if (location.hash && location.hash.length > 1) {
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
