/* MAISON AMIIR — seasonal hero quick-filter chips.
   Filters the collection without a full page reload: fetches the main collection
   section via Shopify's Section Rendering API and swaps it in place, then marks
   the active chip (black pill). Falls back to normal navigation on any error. */
(function () {
  if (window.__maSheroChips) return;
  window.__maSheroChips = true;

  var FKEY = 'filter.p.product_type';

  function mainSection() {
    return document.querySelector('[id^="shopify-section-template--"][id$="__main"]');
  }

  function allChips() {
    return Array.prototype.slice.call(document.querySelectorAll('.ma-shero-chips__chip'));
  }

  function markActive() {
    var current = new URLSearchParams(window.location.search).getAll(FKEY).sort().join('|');
    allChips().forEach(function (chip) {
      var chipVal = new URL(chip.href, window.location.origin).searchParams.getAll(FKEY).sort().join('|');
      chip.classList.toggle('ma-shero-chips__chip--on', chipVal === current);
    });
  }

  document.addEventListener('click', function (e) {
    var target = e.target;
    var chip = target && target.closest ? target.closest('.ma-shero-chips__chip') : null;
    if (!chip) return;
    var wrap = mainSection();
    if (!wrap || !window.fetch || !window.URLSearchParams) return;

    e.preventDefault();
    var url = new URL(chip.href, window.location.origin);
    var req = new URL(url.href);
    req.searchParams.set('section_id', wrap.id.replace('shopify-section-', ''));

    wrap.style.transition = 'opacity .25s ease';
    wrap.style.opacity = '.35';

    fetch(req.href)
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      })
      .then(function (html) {
        var holder = document.createElement('div');
        holder.innerHTML = html;
        var next = holder.querySelector('[id^="shopify-section-"]');
        wrap.innerHTML = next ? next.innerHTML : html;
        window.history.pushState({}, '', url.href);
        wrap.style.opacity = '';
        markActive();
      })
      .catch(function () {
        window.location.href = url.href;
      });
  }, true);

  window.addEventListener('popstate', function () {
    window.location.reload();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', markActive);
  } else {
    markActive();
  }
})();
