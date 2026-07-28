(function () {
  var LABEL_BY_FILE = {
    'languages.html': { key: 'nav.languages', en: 'Languages', hy: 'Լեզուներ' },
    'true-voice.html': { key: 'nav.trueVoice', en: 'True Voice', hy: 'Իսկական ձայն' },
    'pricing.html': { key: 'nav.pricing', en: 'Pricing', hy: 'Գներ' },
    'support.html': { key: 'nav.support', en: 'Support', hy: 'Աջակցություն' },
    'privacy.html': { key: 'nav.privacy', en: 'Privacy', hy: 'Գաղտնիություն' },
    'terms.html': { key: 'nav.terms', en: 'Terms', hy: 'Պայմաններ' },
    'hy.html': { key: null, en: 'Features', hy: 'Հնարավորություններ' }
  };

  function currentFile() {
    var path = (location.pathname || '/').replace(/\/+$/, '');
    var file = path.split('/').pop();
    return file || 'index.html';
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
    var meta = LABEL_BY_FILE[currentFile()] || { key: 'nav.features', en: 'Features', hy: 'Հնարավորություններ' };
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
    function toggleMenu(e) {
      e.stopPropagation();
      var open = !menu.classList.contains('is-open');
      menu.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavToggle);
  } else {
    initNavToggle();
  }
})();
