/* MAISON AMIIR — social proof: random selection + live rotation of review cards */
(function () {
  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  function init() {
    document.querySelectorAll('.ma-sproof__grid').forEach(function (grid) {
      if (grid.dataset.maSproofInit) return;
      grid.dataset.maSproofInit = '1';

      var cards = Array.prototype.slice.call(grid.querySelectorAll('.ma-sproof__card'));
      if (cards.length < 4) return; /* nothing to rotate — leave static */

      var slots = Math.min(3, cards.length);
      var deck = shuffle(cards.slice());
      var live = deck.splice(0, slots);

      grid.classList.add('ma-sproof--js');
      live.forEach(function (c) { c.classList.add('is-live'); });

      var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) return; /* random trio, but no motion */

      var secsAttr = grid.closest('.ma-sproof');
      var secs = 6;
      var slot = 0;
      var paused = false;

      grid.addEventListener('mouseenter', function () { paused = true; });
      grid.addEventListener('mouseleave', function () { paused = false; });

      setInterval(function () {
        if (paused || document.hidden) return;
        var outgoing = live[slot];
        var incoming = deck.shift();
        if (!incoming) return;

        outgoing.classList.add('is-out');
        setTimeout(function () {
          outgoing.classList.remove('is-live', 'is-out');
          deck.push(outgoing);
          incoming.classList.add('is-out', 'is-live');
          /* force reflow so the fade-in transition runs */
          void incoming.offsetWidth;
          incoming.classList.remove('is-out');
          live[slot] = incoming;
          slot = (slot + 1) % slots;
        }, 560);
      }, secs * 1000);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  document.addEventListener('shopify:section:load', init);
})();
