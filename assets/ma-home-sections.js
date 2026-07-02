/* MAISON AMIIR — shared reveal animations for custom homepage sections
   (value story, brand story, social proof). Content is visible by default;
   hide-then-reveal only activates when this script runs. */
(function () {
  function init() {
    var items = document.querySelectorAll('.ma-home-reveal:not([data-ma-rv])');
    if (!items.length || !('IntersectionObserver' in window)) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });

    items.forEach(function (el, i) {
      el.dataset.maRv = '1';
      /* pre-hide via inline style so no-JS never hides content */
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1)';
      el.style.transitionDelay = (i % 6) * 90 + 'ms';
      io.observe(el);
    });

    var style = document.getElementById('ma-home-reveal-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'ma-home-reveal-style';
      style.textContent = '.ma-home-reveal.is-in{opacity:1 !important;transform:none !important;}';
      document.head.appendChild(style);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  document.addEventListener('shopify:section:load', init);
})();
