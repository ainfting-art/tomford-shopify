/* MAISON AMIIR — free gift-wrap toggle. Ticking the cart checkbox writes the
   "Gift wrap" cart attribute (Yes/No) so it shows on the order in admin.
   Delegated + guarded so it survives cart-drawer re-renders and only binds once. */
(function () {
  if (window.__maGiftwrapBound) return;
  window.__maGiftwrapBound = true;

  document.addEventListener('change', function (e) {
    var cb = e.target;
    if (!cb || !cb.classList || !cb.classList.contains('ma-giftwrap__cb')) return;
    fetch('/cart/update.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ attributes: { 'Gift wrap': cb.checked ? 'Yes' : 'No' } })
    }).catch(function () {});
  });
})();
