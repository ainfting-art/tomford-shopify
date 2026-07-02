/* MAISON AMIIR — welcome email popup
   Shows once per visit (browser session), on every visit.
   After subscribing (persistent, per device) the subscribe form is
   hidden forever — the popup keeps offering the welcome code only. */
(function () {
  var KEY_SEEN = 'ma_popup_seen_session';
  var KEY_DONE = 'ma_popup_subscribed';

  function init() {
    var root = document.getElementById('ma-popup');
    if (!root || root.dataset.maPopupInit) return;
    root.dataset.maPopupInit = '1';

    function get(store, k) { try { return window[store].getItem(k); } catch (e) { return null; } }
    function set(store, k, v) { try { window[store].setItem(k, v); } catch (e) {} }

    /* once per visit: sessionStorage dies when the browser/tab closes */
    if (get('sessionStorage', KEY_SEEN) === '1') return;

    /* subscribed before (this device): keep the code, drop the ask */
    if (get('localStorage', KEY_DONE) === '1') root.classList.add('ma-popup--subscribed');

    /* don't interrupt checkout or cart */
    if (/^\/(cart|checkouts?)\b/.test(location.pathname)) return;

    function open() {
      root.hidden = false;
      /* double rAF so the transition runs after unhide */
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { root.classList.add('is-open'); });
      });
      set('sessionStorage', KEY_SEEN, '1');
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

    /* mark subscribed so the form never returns on this device */
    var form = root.querySelector('.ma-popup__form');
    if (form) form.addEventListener('submit', function () { set('localStorage', KEY_DONE, '1'); });

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
