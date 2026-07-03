/* MAISON AMIIR — unboxing sequence: crossfade frames, captions, progress,
   desktop arrows, mobile swipe + dots. Auto-play continues after manual use. */
(function () {
  function init() {
    document.querySelectorAll('.ma-unbox').forEach(function (root) {
      if (root.dataset.maUnboxInit) return;
      root.dataset.maUnboxInit = '1';

      var stage = root.querySelector('.ma-unbox__stage');
      var frames = root.querySelectorAll('.ma-unbox__frame');
      var segs = root.querySelectorAll('.ma-unbox__seg');
      var dots = root.querySelectorAll('.ma-unbox__dot');
      var capNum = root.querySelector('.ma-unbox__cap-num');
      var capText = root.querySelector('.ma-unbox__cap-text');
      var capsEl = root.querySelector('.ma-unbox-caps');
      var caps = ['The Coffret', 'The Reveal', 'The Bottle', 'The Note'];
      try { if (capsEl) caps = JSON.parse(capsEl.textContent); } catch (e) {}

      if (!stage || frames.length < 2) return;

      var i = 0;
      var paused = false;
      var timer = null;
      var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      function go(n) {
        i = (n + frames.length) % frames.length;
        frames.forEach(function (f, k) { f.classList.toggle('is-on', k === i); });
        segs.forEach(function (s, k) { s.classList.toggle('is-on', k === i); });
        dots.forEach(function (d, k) { d.classList.toggle('is-on', k === i); });
        if (capNum) capNum.textContent = ('0' + (i + 1)).slice(-2);
        if (capText) capText.textContent = caps[i] || '';
      }

      function startAuto() {
        if (reduced) return;
        if (timer) clearInterval(timer);
        timer = setInterval(function () {
          if (paused || document.hidden) return;
          go(i + 1);
        }, 3200);
      }

      function manual(n) {
        go(n);
        startAuto(); /* restart the clock so it doesn't jump right after a tap */
      }

      stage.addEventListener('mouseenter', function () { paused = true; });
      stage.addEventListener('mouseleave', function () { paused = false; });

      var prev = root.querySelector('.ma-unbox__arrow--prev');
      var next = root.querySelector('.ma-unbox__arrow--next');
      if (prev) prev.addEventListener('click', function () { manual(i - 1); });
      if (next) next.addEventListener('click', function () { manual(i + 1); });

      /* mobile swipe */
      var x0 = null, y0 = null;
      stage.addEventListener('touchstart', function (e) {
        if (e.touches.length !== 1) return;
        x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
        paused = true;
      }, { passive: true });
      stage.addEventListener('touchend', function (e) {
        paused = false;
        if (x0 === null) return;
        var dx = e.changedTouches[0].clientX - x0;
        var dy = e.changedTouches[0].clientY - y0;
        x0 = null; y0 = null;
        if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)) {
          manual(dx < 0 ? i + 1 : i - 1);
        }
      }, { passive: true });

      dots.forEach(function (d, k) {
        d.addEventListener('click', function () { manual(k); });
      });

      startAuto();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  document.addEventListener('shopify:section:load', init);
})();
