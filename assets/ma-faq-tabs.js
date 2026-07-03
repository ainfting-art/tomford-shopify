/* MAISON AMIIR — FAQ category tabs (Chanel behavior).
   Turns the in-page anchor nav into tabs: clicking a category shows its
   questions in place instead of scrolling down the page. The page content
   itself is never modified — groups are derived from the existing headings.
   No-JS fallback: anchors keep their native scroll behavior. */
(function () {
  function init() {
    var root = document.querySelector('.ma-faq');
    if (!root || root.dataset.maFaqTabs) return;
    var nav = root.querySelector('.ma-faq__nav');
    if (!nav) return;

    var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
    if (links.length < 2) return;
    var ids = links.map(function (a) { return a.getAttribute('href').slice(1); });

    /* walk the content after the nav; each known id starts a new group */
    var groups = {};
    ids.forEach(function (id) { groups[id] = []; });
    var current = null;
    var node = nav.nextElementSibling;
    while (node) {
      if (node.id && groups.hasOwnProperty(node.id)) current = node.id;
      if (current) groups[current].push(node);
      node = node.nextElementSibling;
    }
    for (var k in groups) { if (groups.hasOwnProperty(k) && !groups[k].length) return; /* unexpected markup — leave anchors alone */ }

    root.dataset.maFaqTabs = '1';
    root.classList.add('ma-faq--tabs');

    function activate(id, updateHash) {
      ids.forEach(function (gid, i) {
        var on = gid === id;
        groups[gid].forEach(function (el) { el.style.display = on ? '' : 'none'; });
        links[i].classList.toggle('is-active', on);
        links[i].setAttribute('aria-selected', on ? 'true' : 'false');
      });
      /* the tab label already names the section — hide the repeated heading */
      var first = groups[id][0];
      if (first && first.tagName === 'H2') first.style.display = 'none';
      if (updateHash && history.replaceState) history.replaceState(null, '', '#' + id);
    }

    links.forEach(function (a, i) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        activate(ids[i], true);
      });
    });

    var start = (location.hash || '').slice(1);
    activate(groups.hasOwnProperty(start) ? start : ids[0], false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
