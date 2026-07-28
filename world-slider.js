(function () {
  var INTERVAL_SLOW_MS = 1800;
  var INTERVAL_FAST_MS = 650;

  function initSlider(root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll('.world-slider-slide'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('.world-slider-dot'));
    if (slides.length < 2) return;

    var section = root.closest('.feature') || root;
    var index = 0;
    var timer = null;
    var started = false;
    var inView = false;
    var hovering = false;
    var currentInterval = INTERVAL_SLOW_MS;
    var reduceMotion = false;

    try {
      reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {}

    function show(i) {
      index = ((i % slides.length) + slides.length) % slides.length;
      slides.forEach(function (slide, n) {
        slide.classList.toggle('is-active', n === index);
      });
      dots.forEach(function (dot, n) {
        dot.classList.toggle('is-active', n === index);
        dot.setAttribute('aria-selected', n === index ? 'true' : 'false');
      });
    }

    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    /** 0 at edges / barely in view → 1 when section center is near viewport middle */
    function centeredness() {
      var rect = section.getBoundingClientRect();
      var vh = window.innerHeight || 1;
      var sectionMid = rect.top + rect.height / 2;
      var viewMid = vh / 2;
      var dist = Math.abs(sectionMid - viewMid) / (vh * 0.45);
      return Math.max(0, Math.min(1, 1 - dist));
    }

    function desiredInterval() {
      var c = centeredness();
      // Ease into fast speed once you're toward the middle of the section.
      var t = c * c;
      return Math.round(INTERVAL_SLOW_MS + (INTERVAL_FAST_MS - INTERVAL_SLOW_MS) * t);
    }

    function start() {
      if (reduceMotion || !started || !inView || hovering) return;
      var nextInterval = desiredInterval();
      if (timer && nextInterval === currentInterval) return;
      stop();
      currentInterval = nextInterval;
      timer = setInterval(function () {
        show(index + 1);
        // Re-tune speed as the user keeps scrolling while timer fires.
        var refreshed = desiredInterval();
        if (refreshed !== currentInterval) start();
      }, currentInterval);
    }

    function beginWhenInView() {
      inView = true;
      if (!started) {
        started = true;
        show(0);
      }
      start();
    }

    var ticking = false;
    function onScroll() {
      if (!started || !inView) return;
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        start();
      });
    }

    dots.forEach(function (dot, n) {
      dot.addEventListener('click', function () {
        if (!started) beginWhenInView();
        show(n);
        start();
      });
    });

    root.addEventListener('mouseenter', function () {
      hovering = true;
      stop();
    });
    root.addEventListener('mouseleave', function () {
      hovering = false;
      if (started) start();
    });
    root.addEventListener('focusin', function () {
      hovering = true;
      stop();
    });
    root.addEventListener('focusout', function () {
      hovering = false;
      if (started) start();
    });

    var startX = 0;
    root.addEventListener('touchstart', function (e) {
      if (!e.changedTouches || !e.changedTouches[0]) return;
      startX = e.changedTouches[0].clientX;
      stop();
    }, { passive: true });
    root.addEventListener('touchend', function (e) {
      if (!e.changedTouches || !e.changedTouches[0]) return;
      if (!started) beginWhenInView();
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
      start();
    }, { passive: true });

    show(0);

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
            beginWhenInView();
          } else if (!entry.isIntersecting) {
            inView = false;
            stop();
          } else if (started) {
            inView = true;
            start();
          }
        });
      }, { threshold: [0, 0.35, 0.55, 0.75, 1] });
      io.observe(section);
    } else {
      beginWhenInView();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }

  document.querySelectorAll('[data-world-slider]').forEach(initSlider);
})();
