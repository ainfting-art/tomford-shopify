/* MAISON AMIIR — welcome email popup */
(function () {
  var KEY_SEEN = 'ma_popup_last_seen';
  var KEY_DONE = 'ma_popup_subscribed';

  function init() {
    var root = document.getElementById('ma-popup');
    if (!root || root.dataset.maPopupInit) return;
    root.dataset.maPopupInit = '1';

    var store;
    try { store = window.localStorage; } catch (e) { store = null; }

    function get(k) { try { return store ? store.getItem(k) : null; } catch (e) { return null; } }
    function set(k, v) { try { if (store) store.setItem(k, v); } catch (e) {} }

    /* never show again once subscribed; respect frequency window otherwise */
    if (get(KEY_DONE) === '1') return;
    var days = parseInt(root.dataset.days, 10) || 7;
    var last = parseInt(get(KEY_SEEN), 10) || 0;
    if (last && (Date.now() - last) < days * 864e5) return;

    /* don't interrupt checkout or cart */
    if (/^\/(cart|checkouts?)\b/.test(location.pathname)) return;

    function open() {
      root.hidden = false;
      /* double rAF so the transition runs after unhide */
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { root.classList.add('is-open'); });
      });
      set(KEY_SEEN, String(Date.now()));
      document.addEventListener('keydown', onKey);
    }

    function close() {
      root.classList.remove('is-open');
      document.removeEventListener('keydown', onKey);
      setTimeout(function () { root.hidden = true; }, 550);
    }

    function onKey(e) { if (e.key === 'Escape') close(); }

    root.querySelectorAll('[data-ma-popup-close]').forEach(function (el) {
      el.addEventListener('click', close);
    });

    /* copy code */
    var codeBtn = root.querySelector('[data-ma-popup-code]');
    if (codeBtn) {
      codeBtn.addEventListener('click', function () {
        var code = codeBtn.getAttribute('data-ma-popup-code');
        var label = codeBtn.querySelector('.ma-popup__code-copy');
        function done() {
          if (label) {
            label.textContent = 'Copied';
            setTimeout(function () { label.textContent = 'Copy'; }, 2200);
          }
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(code).then(done, done);
        } else {
          var ta = document.createElement('textarea');
          ta.value = code; ta.style.position = 'fixed'; ta.style.opacity = '0';
          document.body.appendChild(ta); ta.select();
          try { document.execCommand('copy'); } catch (e) {}
          document.body.removeChild(ta);
          done();
        }
      });
    }

    /* mark subscribed so it never returns */
    var form = root.querySelector('.ma-popup__form');
    if (form) form.addEventListener('submit', function () { set(KEY_DONE, '1'); });

    var delay = (parseInt(root.dataset.delay, 10) || 5) * 1000;
    setTimeout(open, delay);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  document.addEventListener('shopify:section:load', init);
})();
