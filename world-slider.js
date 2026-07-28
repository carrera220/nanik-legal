(function () {
  var INTERVAL_MS = 700;

  function prefersReducedMotion() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  /** Subtle CSS animations while section is in view; paused when off-screen. */
  function bindInViewAnimations(root, opts) {
    if (prefersReducedMotion()) return;

    var selector = opts.selector;
    var rate = opts.rate != null ? opts.rate : 0.45;
    var threshold = opts.threshold != null ? opts.threshold : 0.25;
    var section = root.closest('.feature') || root;

    function applyRate(next) {
      root.querySelectorAll(selector).forEach(function (el) {
        if (!el.getAnimations) return;
        el.getAnimations().forEach(function (anim) {
          anim.playbackRate = next;
        });
      });
    }

    function setRunning(on) {
      root.classList.toggle('is-running', !!on);
      if (on) {
        requestAnimationFrame(function () {
          applyRate(rate);
        });
      }
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          setRunning(entry.isIntersecting && entry.intersectionRatio >= threshold);
        });
      }, { threshold: [0, threshold, 0.5, 0.75, 1] });
      io.observe(section);
    } else {
      setRunning(true);
    }
  }

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
    var reduceMotion = prefersReducedMotion();

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

    function start() {
      if (reduceMotion || !started || !inView || hovering || timer) return;
      timer = setInterval(function () {
        show(index + 1);
      }, INTERVAL_MS);
    }

    function beginWhenInView() {
      inView = true;
      if (!started) {
        started = true;
        show(0);
      }
      start();
    }

    dots.forEach(function (dot, n) {
      dot.addEventListener('click', function () {
        if (!started) beginWhenInView();
        show(n);
        stop();
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
  }

  document.querySelectorAll('[data-world-slider]').forEach(initSlider);

  document.querySelectorAll('.support-collage, .lang-collage').forEach(function (root) {
    bindInViewAnimations(root, {
      selector: '.support-marquee-track, .lang-marquee-track',
      rate: 0.45
    });
  });

  document.querySelectorAll('.toy-alive').forEach(function (root) {
    bindInViewAnimations(root, {
      selector: '.toy-sparkle, .toy-alive-ai',
      rate: 0.5,
      threshold: 0.2
    });
  });
})();
