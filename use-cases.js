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
  }

  function boot() {
    document.querySelectorAll('[data-use-cases]').forEach(init);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
