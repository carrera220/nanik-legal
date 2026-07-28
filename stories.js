(function () {
  var CACHE = Object.create(null);
  var listEl = document.getElementById('andersen-story-list');
  var readerEl = document.getElementById('story-reader');
  var titleEl = document.getElementById('story-reader-title');
  var bodyEl = document.getElementById('story-reader-body');
  var backEl = document.getElementById('story-reader-back');
  var metaEl = document.getElementById('story-reader-meta');
  var filterEl = document.getElementById('story-filter');

  if (!listEl || !readerEl) return;

  function showList() {
    readerEl.hidden = true;
    listEl.hidden = false;
    if (filterEl) filterEl.parentElement.hidden = false;
    document.getElementById('andersen-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function showReader() {
    listEl.hidden = true;
    if (filterEl) filterEl.parentElement.hidden = true;
    readerEl.hidden = false;
    readerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderStory(story) {
    titleEl.textContent = story.title;
    metaEl.innerHTML =
      'Hans Christian Andersen · Public domain · ' +
      '<a href="' + story.sourceUrl + '" rel="noopener noreferrer" target="_blank">Source</a>';
    bodyEl.innerHTML = (story.paragraphs || [])
      .map(function (p) {
        return '<p>' + escapeHtml(p) + '</p>';
      })
      .join('');
    showReader();
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function loadStory(slug) {
    if (!slug) return;
    if (CACHE[slug]) {
      renderStory(CACHE[slug]);
      return;
    }
    titleEl.textContent = 'Loading…';
    metaEl.textContent = '';
    bodyEl.innerHTML = '<p class="effective">Loading story…</p>';
    showReader();
    fetch('data/andersen/stories/' + encodeURIComponent(slug) + '.json')
      .then(function (r) {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then(function (story) {
        CACHE[slug] = story;
        renderStory(story);
      })
      .catch(function () {
        titleEl.textContent = 'Story unavailable';
        metaEl.textContent = '';
        bodyEl.innerHTML = '<p class="effective">Could not load this story. Please try another.</p>';
      });
  }

  function slugFromHash() {
    var h = (location.hash || '').replace(/^#/, '');
    if (!h || h === 'andersen') return '';
    return decodeURIComponent(h);
  }

  listEl.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-story-slug]');
    if (!a) return;
    e.preventDefault();
    var slug = a.getAttribute('data-story-slug');
    if (history.replaceState) history.replaceState(null, '', '#' + slug);
    else location.hash = slug;
    loadStory(slug);
  });

  if (backEl) {
    backEl.addEventListener('click', function () {
      if (history.replaceState) history.replaceState(null, '', '#andersen');
      else location.hash = 'andersen';
      showList();
    });
  }

  if (filterEl) {
    filterEl.addEventListener('input', function () {
      var q = filterEl.value.trim().toLowerCase();
      listEl.querySelectorAll('li').forEach(function (li) {
        var t = (li.textContent || '').toLowerCase();
        li.hidden = q && t.indexOf(q) === -1;
      });
    });
  }

  function onHash() {
    var slug = slugFromHash();
    if (slug) loadStory(slug);
    else showList();
  }

  window.addEventListener('hashchange', onHash);
  onHash();
})();
