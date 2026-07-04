/* MAISON AMIIR — policy pages: build the "on this page" index (desktop sidebar
   + mobile chip row) from the numbered/lettered section headers in the content,
   with smooth scroll and active highlighting. Content markup is never altered. */
(function () {
  var MARKER = /^(\d{1,2}|[A-Z])\.\s/;

  function init() {
    document.querySelectorAll('.ma-policy').forEach(function (root) {
      if (root.dataset.maPolicyInit) return;
      root.dataset.maPolicyInit = '1';

      var content = root.querySelector('.ma-policy__content');
      var indexAside = root.querySelector('.ma-policy__index');
      var indexList = root.querySelector('.ma-policy__index-list');
      var chipsWrap = root.querySelector('.ma-policy__chips');
      if (!content) return;

      var ps = content.querySelectorAll(':scope > p');
      var secs = [];
      var n = 0;
      ps.forEach(function (p) {
        var st = p.querySelector('strong');
        if (st && p.firstElementChild === st && MARKER.test(st.textContent.trim())) {
          n++;
          var id = 'ma-sec-' + n;
          p.id = id;
          p.classList.add('ma-policy__sec');
          secs.push({ id: id, text: st.textContent.trim() });
        }
      });

      var firstP = content.querySelector(':scope > p');
      if (firstP && !firstP.classList.contains('ma-policy__sec')) firstP.classList.add('ma-policy__lead');

      if (!secs.length) {
        root.classList.add('ma-policy--nolist');
        if (indexAside) indexAside.style.display = 'none';
        if (chipsWrap) chipsWrap.style.display = 'none';
        return;
      }

      var chipsRow = null;
      if (chipsWrap) {
        var cl = document.createElement('p'); cl.className = 'ma-policy__chips-label'; cl.textContent = 'On this page';
        chipsRow = document.createElement('div'); chipsRow.className = 'ma-policy__chips-row';
        chipsWrap.appendChild(cl); chipsWrap.appendChild(chipsRow);
      }

      secs.forEach(function (s) {
        if (indexList) {
          var a = document.createElement('a');
          a.href = '#' + s.id; a.className = 'ma-policy__index-link';
          a.textContent = s.text; a.setAttribute('data-target', s.id);
          indexList.appendChild(a);
        }
        if (chipsRow) {
          var c = document.createElement('a');
          c.href = '#' + s.id; c.className = 'ma-policy__chip';
          c.textContent = s.text; c.setAttribute('data-target', s.id);
          chipsRow.appendChild(c);
        }
      });

      root.querySelectorAll('[data-target]').forEach(function (link) {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          var el = document.getElementById(this.getAttribute('data-target'));
          if (!el) return;
          var y = el.getBoundingClientRect().top + window.pageYOffset - 88;
          window.scrollTo({ top: y, behavior: 'smooth' });
        });
      });

      if ('IntersectionObserver' in window) {
        var links = root.querySelectorAll('[data-target]');
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (!en.isIntersecting) return;
            var id = en.target.id;
            links.forEach(function (l) {
              var on = l.getAttribute('data-target') === id;
              l.classList.toggle('is-active', on);
              if (on && l.className.indexOf('chip') > -1 && l.scrollIntoView) {
                l.scrollIntoView({ block: 'nearest', inline: 'center' });
              }
            });
          });
        }, { rootMargin: '-84px 0px -68% 0px', threshold: 0 });
        secs.forEach(function (s) { var el = document.getElementById(s.id); if (el) io.observe(el); });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  document.addEventListener('shopify:section:load', init);
})();
