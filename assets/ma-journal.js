/* MAISON AMIIR — From the Journal: mobile swipe dots (desktop grid needs no JS). */
(function () {
  function init() {
    document.querySelectorAll('.ma-journal').forEach(function (root) {
      if (root.dataset.maInit) return;
      root.dataset.maInit = '1';
      var track = root.querySelector('.ma-journal__track');
      var dots = root.querySelectorAll('.ma-journal__dot');
      if (!track || !dots.length) return;

      function paint() {
        var card = track.children[0];
        if (!card) return;
        var step = card.offsetWidth + 14;
        var active = Math.min(dots.length - 1, Math.round(track.scrollLeft / step));
        dots.forEach(function (d, i) { d.classList.toggle('is-active', i === active); });
      }

      track.addEventListener('scroll', function () { requestAnimationFrame(paint); }, { passive: true });
      dots.forEach(function (d, i) {
        d.addEventListener('click', function () {
          var card = track.children[i];
          if (card) track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' });
        });
      });
      paint();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
