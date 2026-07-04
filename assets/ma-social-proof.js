/* MAISON AMIIR — social proof: random selection + live rotation of review cards.
   Desktop shows 3 rotating slots; mobile shows 1 slot that auto-slides through
   every review (single-panel carousel). Rebuilds when the breakpoint changes. */
(function () {
  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  var mqMobile = window.matchMedia('(max-width: 849px)');
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function build(grid) {
    if (grid._maTimer) { clearInterval(grid._maTimer); grid._maTimer = null; }

    var cards = Array.prototype.slice.call(grid.querySelectorAll('.ma-sproof__card'));
    if (cards.length < 4) return; /* nothing to rotate — leave static */
    cards.forEach(function (c) { c.classList.remove('is-live', 'is-out'); });

    var slots = mqMobile.matches ? 1 : Math.min(3, cards.length);
    var deck = shuffle(cards.slice());
    var live = deck.splice(0, slots);

    grid.classList.add('ma-sproof--js');
    live.forEach(function (c) { c.classList.add('is-live'); });

    if (reduced) return; /* random selection, but no motion */

    var slot = 0;
    grid._maTimer = setInterval(function () {
      if (grid._maPaused || document.hidden) return;
      var outgoing = live[slot];
      var incoming = deck.shift();
      if (!incoming) return;

      outgoing.classList.add('is-out');
      setTimeout(function () {
        outgoing.classList.remove('is-live', 'is-out');
        deck.push(outgoing);
        incoming.classList.add('is-out', 'is-live');
        void incoming.offsetWidth; /* force reflow so the fade-in runs */
        incoming.classList.remove('is-out');
        live[slot] = incoming;
        slot = (slot + 1) % slots;
      }, 560);
    }, 6000);
  }

  function init() {
    document.querySelectorAll('.ma-sproof__grid').forEach(function (grid) {
      if (!grid._maBound) {
        grid._maBound = true;
        grid.addEventListener('mouseenter', function () { grid._maPaused = true; });
        grid.addEventListener('mouseleave', function () { grid._maPaused = false; });
      }
      build(grid);
    });
  }

  function onBreakpointChange() {
    document.querySelectorAll('.ma-sproof__grid').forEach(build);
  }
  if (mqMobile.addEventListener) mqMobile.addEventListener('change', onBreakpointChange);
  else if (mqMobile.addListener) mqMobile.addListener(onBreakpointChange);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  document.addEventListener('shopify:section:load', init);
})();
