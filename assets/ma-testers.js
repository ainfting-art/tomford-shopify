/* MAISON AMIIR — writes the computed tester list to the "Testers to pack" cart
   attribute so it appears on the order in admin. The tester rows themselves are
   rendered in Liquid; this only syncs the order flag. Guarded + change-checked so
   it never loops, and re-runs after cart re-renders via a debounced observer. */
(function () {
  if (window.__maTestersBound) return;
  window.__maTestersBound = true;

  function sync() {
    var el = document.querySelector('.ma-testers[data-testers-current]');
    if (!el) return;
    var want = el.querySelector('.ma-testers__data');
    want = want ? (want.getAttribute('data-testers') || '') : '';
    var have = el.getAttribute('data-testers-current') || '';
    if (want === have) return;
    el.setAttribute('data-testers-current', want); /* set first so we don't re-fire */
    fetch('/cart/update.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ attributes: { 'Testers to pack': want } })
    }).catch(function () {});
  }

  var t;
  function schedule() { clearTimeout(t); t = setTimeout(sync, 300); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sync);
  } else {
    sync();
  }
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
})();
