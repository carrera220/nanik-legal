(function () {
  function init(root) {
    var track = root.querySelector('[data-uc-track]');
    var prev = root.querySelector('[data-uc-prev]');
    var next = root.querySelector('[data-uc-next]');
    var dotsWrap = root.querySelector('[data-uc-dots]');
    if (!track) return;
    var cards = Array.prototype.slice.call(track.children);

    var dots = cards.map(function () {
      var d = document.createElement('span');
      d.className = 'use-cases-dot';
      if (dotsWrap) dotsWrap.appendChild(d);
      return d;
    });

    function step() {
      if (cards.length < 2) return track.clientWidth;
      return cards[1].offsetLeft - cards[0].offsetLeft;
    }

    function update() {
      var max = track.scrollWidth - track.clientWidth;
      var idx = Math.round(track.scrollLeft / Math.max(1, step()));
      if (track.scrollLeft >= max - 2) idx = cards.length - 1;
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === idx); });
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max - 2;
    }

    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });

    var ticking = false;
    track.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; update(); });
    }, { passive: true });
    window.addEventListener('resize', update);
    update();

    track.addEventListener('click', function (e) {
      var link = e.target.closest && e.target.closest('a.use-case-cta');
      if (!link || !window.NanikAnalytics) return;
      var card = link.closest('.use-case-card');
      var title = card && card.querySelector('h3');
      var href = link.getAttribute('href') || '';
      window.NanikAnalytics.track('use_case_clicked', {
        use_case: useCaseFromHref(href),
        use_case_title: title ? title.textContent.trim() : '',
        use_case_position: card ? cards.indexOf(card) + 1 : 0,
        destination: href,
      });
    });
  }

  function useCaseFromHref(href) {
    if (href.indexOf('bedtime-fears') !== -1) return 'bedtime_fears';
    if (href.indexOf('feelings') !== -1) return 'big_feelings';
    if (href.indexOf('new-experiences') !== -1) return 'new_experiences';
    if (href.indexOf('educational') !== -1) return 'learning';
    return href.replace(/^\/+|\.html$/g, '') || 'unknown';
  }

  function boot() {
    document.querySelectorAll('[data-use-cases]').forEach(init);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
