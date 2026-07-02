/* MAISON AMIIR — Our Story reveal animations */
(function () {
  function init() {
    document.querySelectorAll('.ma-story').forEach(function (root) {
      if (root.dataset.maStoryInit) return;
      root.dataset.maStoryInit = '1';

      var items = root.querySelectorAll('.ma-story-reveal');
      if (!items.length) return;

      /* stagger index within each group */
      ['.ma-story__pillars', '.ma-story__cities', '.ma-story__principles'].forEach(function (sel) {
        root.querySelectorAll(sel).forEach(function (group) {
          Array.prototype.forEach.call(group.children, function (child, i) {
            child.style.setProperty('--ms-i', i);
          });
        });
      });

      if (!('IntersectionObserver' in window)) return;

      /* enable hide-then-reveal only now that JS is confirmed running */
      root.classList.add('ma-story--js');

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

      items.forEach(function (el) { io.observe(el); });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  document.addEventListener('shopify:section:load', init);
})();
