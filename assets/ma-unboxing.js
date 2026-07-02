/* MAISON AMIIR — unboxing sequence: crossfade frames with captions + progress */
(function () {
  function init() {
    document.querySelectorAll('.ma-unbox').forEach(function (root) {
      if (root.dataset.maUnboxInit) return;
      root.dataset.maUnboxInit = '1';

      var frames = root.querySelectorAll('.ma-unbox__frame');
      var segs = root.querySelectorAll('.ma-unbox__seg');
      var capNum = root.querySelector('.ma-unbox__cap-num');
      var capText = root.querySelector('.ma-unbox__cap-text');
      var capsEl = root.querySelector('.ma-unbox-caps');
      var caps = ['The Coffret', 'The Reveal', 'The Bottle', 'The Note'];
      try { if (capsEl) caps = JSON.parse(capsEl.textContent); } catch (e) {}

      if (frames.length < 2) return;
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      var i = 0;
      var paused = false;
      root.addEventListener('mouseenter', function () { paused = true; });
      root.addEventListener('mouseleave', function () { paused = false; });

      setInterval(function () {
        if (paused || document.hidden) return;
        i = (i + 1) % frames.length;
        frames.forEach(function (f, k) { f.classList.toggle('is-on', k === i); });
        segs.forEach(function (s, k) { s.classList.toggle('is-on', k === i); });
        if (capNum) capNum.textContent = ('0' + (i + 1)).slice(-2);
        if (capText) capText.textContent = caps[i] || '';
      }, 3200);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  document.addEventListener('shopify:section:load', init);
})();
