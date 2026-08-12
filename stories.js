(function () {
  var CACHE = Object.create(null);
  var readerEl = document.getElementById('story-reader');
  var titleEl = document.getElementById('story-reader-title');
  var bodyEl = document.getElementById('story-reader-body');
  var backEl = document.getElementById('story-reader-back');
  var metaEl = document.getElementById('story-reader-meta');

  var COLLECTIONS = {
    'nanik-hy': {
      listId: 'nanik-hy-story-list',
      dropdownId: 'nanik-hy-dropdown',
      filterId: 'nanik-hy-story-filter',
      sectionId: 'nanik-hy-section',
      dataPath: 'data/nanik-hy/stories/',
      indexPath: 'data/nanik-hy/index.json',
      author: 'Made with Nanik',
      hash: 'nanik-hy',
      langOnly: 'hy',
      dynamic: true
    },
    'nanik-en': {
      listId: 'nanik-en-story-list',
      dropdownId: 'nanik-en-dropdown',
      filterId: 'nanik-en-story-filter',
      sectionId: 'nanik-en-section',
      dataPath: 'data/nanik-en/stories/',
      indexPath: 'data/nanik-en/index.json',
      author: 'Made with Nanik',
      hash: 'nanik-en',
      hideWhenLang: 'hy',
      dynamic: true
    },
    tumanyan: {
      listId: 'tumanyan-story-list',
      dropdownId: 'tumanyan-dropdown',
      filterId: 'tumanyan-story-filter',
      sectionId: 'tumanyan-section',
      dataPath: 'data/tumanyan/stories/',
      author: 'Հովհաննես Թումանյան',
      hash: 'tumanyan',
      langOnly: 'hy'
    },
    'andersen-hy': {
      listId: 'andersen-hy-story-list',
      dropdownId: 'andersen-hy-dropdown',
      filterId: 'andersen-hy-story-filter',
      sectionId: 'andersen-hy-section',
      dataPath: 'data/andersen-hy/stories/',
      author: 'Հանս Քրիստիան Անդերսեն',
      hash: 'andersen-hy',
      langOnly: 'hy'
    },
    aghayan: {
      listId: 'aghayan-story-list',
      dropdownId: 'aghayan-dropdown',
      filterId: 'aghayan-story-filter',
      sectionId: 'aghayan-section',
      dataPath: 'data/aghayan/stories/',
      author: 'Ղազարոս Աղայան',
      hash: 'aghayan',
      langOnly: 'hy'
    },
    andersen: {
      listId: 'andersen-story-list',
      dropdownId: 'andersen-dropdown',
      filterId: 'andersen-story-filter',
      sectionId: 'andersen-section',
      dataPath: 'data/andersen/stories/',
      author: 'Hans Christian Andersen',
      hash: 'andersen',
      hideWhenLang: 'hy'
    },
    grimm: {
      listId: 'grimm-story-list',
      dropdownId: 'grimm-dropdown',
      filterId: 'grimm-story-filter',
      sectionId: 'grimm-section',
      dataPath: 'data/grimm/stories/',
      author: 'Brothers Grimm',
      hash: 'grimm',
      hideWhenLang: 'hy'
    }
  };

  if (!readerEl) return;

  var STORIES_BASE = (document.body && document.body.getAttribute('data-stories-base')) || '';
  if (STORIES_BASE && STORIES_BASE.slice(-1) !== '/') STORIES_BASE += '/';

  Object.keys(COLLECTIONS).forEach(function (key) {
    var col = COLLECTIONS[key];
    if (col.dataPath && col.dataPath.indexOf('://') === -1 && col.dataPath.charAt(0) !== '/') {
      col.dataPath = STORIES_BASE + col.dataPath;
    }
    if (col.indexPath && col.indexPath.indexOf('://') === -1 && col.indexPath.charAt(0) !== '/') {
      col.indexPath = STORIES_BASE + col.indexPath;
    }
  });

  var activeCollection = null;
  var coverEl = document.getElementById('story-reader-cover');

  function assetUrl(path) {
    if (!path) return '';
    if (path.indexOf('://') !== -1 || path.charAt(0) === '/') return path;
    return STORIES_BASE + path;
  }

  function tellCtaLabel() {
    var sample = document.querySelector('[data-i18n="stories.tellCta"]');
    return (sample && sample.textContent) || 'Tell with my voice';
  }

  function padNr(n) {
    var s = String(n || 0);
    return s.length >= 2 ? s : ('0' + s).slice(-2);
  }

  function renderDynamicList(col, stories, key) {
    var listEl = document.getElementById(col.listId);
    if (!listEl || !stories || !stories.length) return;
    var collection = key || collectionKey(col);
    var cta = tellCtaLabel();
    listEl.innerHTML = stories
      .map(function (s) {
        var cover = s.coverImage
          ? '<img class="story-cover-thumb" src="' +
            escapeHtml(assetUrl(s.coverImage)) +
            '" alt="" loading="lazy" width="56" height="56">'
          : '<span class="story-cover-thumb story-cover-thumb--empty" aria-hidden="true"></span>';
        return (
          '<li class="story-list-item story-list-item--cover">' +
          '<a class="story-list-link" href="#' +
          encodeURIComponent(s.slug) +
          '" data-story-collection="' +
          escapeHtml(collection) +
          '" data-story-slug="' +
          escapeHtml(s.slug) +
          '">' +
          cover +
          '<span class="story-nr">' +
          escapeHtml(padNr(s.nr)) +
          '</span> <span class="story-title">' +
          escapeHtml(s.title) +
          '</span></a>' +
          '<button type="button" class="story-list-tell" data-open-download-app data-i18n="stories.tellCta" aria-haspopup="dialog" aria-controls="download-app-modal">' +
          escapeHtml(cta) +
          '</button></li>'
        );
      })
      .join('');
  }

  function loadDynamicCollections() {
    Object.keys(COLLECTIONS).forEach(function (key) {
      var col = COLLECTIONS[key];
      if (!col.dynamic || !col.indexPath) return;
      fetch(col.indexPath)
        .then(function (r) {
          if (!r.ok) throw new Error('index missing');
          return r.json();
        })
        .then(function (index) {
          renderDynamicList(col, index.stories || [], key);
        })
        .catch(function () {
          var listEl = document.getElementById(col.listId);
          if (listEl) {
            listEl.innerHTML =
              '<li class="story-list-item"><span class="story-title effective">No stories yet.</span></li>';
          }
        });
    });
  }

  function currentLang() {
    var forced = document.body && document.body.getAttribute('data-stories-locale');
    if (forced) return String(forced).toLowerCase();
    try {
      return (localStorage.getItem('nanik-site-lang') || document.documentElement.lang || 'en').toLowerCase();
    } catch (e) {
      return (document.documentElement.lang || 'en').toLowerCase();
    }
  }

  function collectionBySlug(slug) {
    if (!slug) return null;
    if (slug.indexOf('nanik-hy-') === 0) return COLLECTIONS['nanik-hy'];
    if (slug.indexOf('nanik-en-') === 0) return COLLECTIONS['nanik-en'];
    if (slug.indexOf('nanik-ru-') === 0) return COLLECTIONS['nanik-ru'] || null;
    if (slug.indexOf('tumanyan-') === 0) return COLLECTIONS.tumanyan;
    if (slug.indexOf('andersen-hy-') === 0) return COLLECTIONS['andersen-hy'];
    if (slug.indexOf('aghayan-') === 0) return COLLECTIONS.aghayan;
    if (slug.indexOf('grimm-') === 0) return COLLECTIONS.grimm;
    return COLLECTIONS.andersen;
  }

  function collectionAllowed(col, lang) {
    if (!col) return false;
    if (col.langOnly && col.langOnly !== lang) return false;
    if (col.hideWhenLang && col.hideWhenLang === lang) return false;
    return true;
  }

  function collectionKey(col) {
    for (var k in COLLECTIONS) {
      if (COLLECTIONS[k] === col) return k;
    }
    return null;
  }

  function showAuthors() {
    readerEl.hidden = true;
    var lang = currentLang();
    Object.keys(COLLECTIONS).forEach(function (key) {
      var col = COLLECTIONS[key];
      var section = document.getElementById(col.sectionId);
      var dropdown = document.getElementById(col.dropdownId);
      var list = document.getElementById(col.listId);
      var filter = document.getElementById(col.filterId);
      var allowed = collectionAllowed(col, lang);
      if (section) {
        section.hidden = !allowed;
      }
      if (dropdown) {
        dropdown.hidden = !allowed;
        // Keep author rows collapsed by default; only open when hash targets that author.
        dropdown.open = Boolean(
          allowed && (location.hash || '') === '#' + col.hash
        );
      }
      if (list) list.hidden = false;
      if (filter && filter.parentElement) filter.parentElement.hidden = false;
    });
  }

  function showList(col) {
    readerEl.hidden = true;
    var lang = currentLang();
    Object.keys(COLLECTIONS).forEach(function (key) {
      var c = COLLECTIONS[key];
      var section = document.getElementById(c.sectionId);
      var dropdown = document.getElementById(c.dropdownId);
      var allowed = collectionAllowed(c, lang);
      if (section) section.hidden = !allowed;
      if (dropdown) dropdown.hidden = !allowed;
    });
    if (col) {
      if (!collectionAllowed(col, lang)) {
        showAuthors();
        return;
      }
      var dropdown = document.getElementById(col.dropdownId);
      if (dropdown) dropdown.open = true;
      var section = document.getElementById(col.sectionId);
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function showReader(col) {
    Object.keys(COLLECTIONS).forEach(function (key) {
      var c = COLLECTIONS[key];
      var dropdown = document.getElementById(c.dropdownId);
      if (dropdown) {
        dropdown.open = false;
        dropdown.hidden = true;
      }
    });
    readerEl.hidden = false;
    activeCollection = col;
    readerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderStory(story, col) {
    titleEl.textContent = story.title;
    metaEl.textContent = col.author;
    if (coverEl) {
      var cover = story.coverImage ? assetUrl(story.coverImage) : '';
      if (cover) {
        coverEl.hidden = false;
        coverEl.src = cover;
        coverEl.alt = story.title || '';
      } else {
        coverEl.hidden = true;
        coverEl.removeAttribute('src');
        coverEl.alt = '';
      }
    }
    bodyEl.innerHTML = (story.paragraphs || [])
      .map(function (p) {
        return '<p>' + escapeHtml(p) + '</p>';
      })
      .join('');
    showReader(col);
  }

  function loadStory(slug, col) {
    if (!slug) return;
    col = col || collectionBySlug(slug);
    if (!col) return;
    var cacheKey = collectionKey(col) + ':' + slug;
    if (CACHE[cacheKey]) {
      renderStory(CACHE[cacheKey], col);
      return;
    }
    titleEl.textContent = 'Loading…';
    metaEl.textContent = '';
    bodyEl.innerHTML = '<p class="effective">Loading story…</p>';
    showReader(col);
    fetch(col.dataPath + encodeURIComponent(slug) + '.json')
      .then(function (r) {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then(function (story) {
        CACHE[cacheKey] = story;
        renderStory(story, col);
      })
      .catch(function () {
        titleEl.textContent = 'Story unavailable';
        metaEl.textContent = '';
        bodyEl.innerHTML = '<p class="effective">Could not load this story. Please try another.</p>';
      });
  }

  document.querySelectorAll('.story-list').forEach(function (listEl) {
    listEl.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-story-slug]');
      if (!a) return;
      e.preventDefault();
      var slug = a.getAttribute('data-story-slug');
      var key = a.getAttribute('data-story-collection') || 'andersen';
      var col = COLLECTIONS[key] || collectionBySlug(slug);
      if (history.replaceState) history.replaceState(null, '', '#' + slug);
      else location.hash = slug;
      loadStory(slug, col);
    });
  });

  if (backEl) {
    backEl.addEventListener('click', function () {
      var col = activeCollection || COLLECTIONS.andersen;
      if (history.replaceState) history.replaceState(null, '', '#' + col.hash);
      else location.hash = col.hash;
      showList(col);
    });
  }

  Object.keys(COLLECTIONS).forEach(function (key) {
    var col = COLLECTIONS[key];
    var filterEl = document.getElementById(col.filterId);
    var listEl = document.getElementById(col.listId);
    if (!filterEl || !listEl) return;
    filterEl.addEventListener('input', function () {
      var q = filterEl.value.trim().toLowerCase();
      listEl.querySelectorAll('li').forEach(function (li) {
        var t = (li.textContent || '').toLowerCase();
        li.hidden = q && t.indexOf(q) === -1;
      });
    });
  });

  function onHash() {
    var hash = (location.hash || '').replace(/^#/, '');
    if (hash === 'andersen') {
      showAuthors();
      showList(COLLECTIONS.andersen);
      return;
    }
    if (hash === 'andersen-hy') {
      showAuthors();
      showList(COLLECTIONS['andersen-hy']);
      return;
    }
    if (hash === 'aghayan') {
      showAuthors();
      showList(COLLECTIONS.aghayan);
      return;
    }
    if (hash === 'grimm') {
      showAuthors();
      showList(COLLECTIONS.grimm);
      return;
    }
    if (hash === 'tumanyan') {
      showAuthors();
      showList(COLLECTIONS.tumanyan);
      return;
    }
    if (hash === 'nanik-hy') {
      showAuthors();
      showList(COLLECTIONS['nanik-hy']);
      return;
    }
    if (hash === 'nanik-en') {
      showAuthors();
      showList(COLLECTIONS['nanik-en']);
      return;
    }
    var slug = slugFromHash();
    if (slug) {
      var col = collectionBySlug(slug);
      if (col && !collectionAllowed(col, currentLang())) {
        showAuthors();
        return;
      }
      loadStory(slug, col);
    } else showAuthors();
  }

  function slugFromHash() {
    var h = (location.hash || '').replace(/^#/, '');
    if (
      !h ||
      h === 'andersen' ||
      h === 'andersen-hy' ||
      h === 'aghayan' ||
      h === 'grimm' ||
      h === 'tumanyan' ||
      h === 'nanik-hy' ||
      h === 'nanik-en'
    )
      return '';
    return decodeURIComponent(h);
  }

  window.addEventListener('hashchange', onHash);
  window.addEventListener('nanik:langchange', function () {
    if (activeCollection && !collectionAllowed(activeCollection, currentLang())) {
      activeCollection = null;
      if (history.replaceState) history.replaceState(null, '', location.pathname + location.search);
      else location.hash = '';
    }
    showAuthors();
  });

  var downloadModal = document.getElementById('download-app-modal');
  function openDownloadModal() {
    if (!downloadModal) return;
    if (typeof downloadModal.showModal === 'function') downloadModal.showModal();
    else downloadModal.setAttribute('open', '');
    document.body.classList.add('download-app-open');
  }
  function closeDownloadModal() {
    if (!downloadModal) return;
    if (typeof downloadModal.close === 'function') downloadModal.close();
    else downloadModal.removeAttribute('open');
    document.body.classList.remove('download-app-open');
  }
  document.addEventListener('click', function (e) {
    var openBtn = e.target.closest && e.target.closest('[data-open-download-app]');
    if (openBtn) {
      e.preventDefault();
      e.stopPropagation();
      openDownloadModal();
      return;
    }
    if (e.target.closest && e.target.closest('[data-close-download-app]')) {
      e.preventDefault();
      closeDownloadModal();
    }
  });
  if (downloadModal) {
    downloadModal.addEventListener('cancel', function (e) {
      e.preventDefault();
      closeDownloadModal();
    });
  }

  loadDynamicCollections();
  onHash();
})();
