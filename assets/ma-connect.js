/* MAISON AMIIR — Careers & Collaborations form helpers */
(function () {
  function init() {
    var root = document.querySelector('.ma-connect');
    if (!root || root.dataset.maConnectInit) return;
    root.dataset.maConnectInit = '1';

    var params = new URLSearchParams(window.location.search);

    /* preselect enquiry type from footer links (?type=career / ?type=collab) */
    var type = (params.get('type') || '').toLowerCase();
    var select = root.querySelector('#ma-c-type');
    if (select) {
      if (type.indexOf('collab') === 0) select.value = 'Brand Collaboration';
      else if (type.indexOf('career') === 0) select.value = 'Career Opportunity';
    }

    /* show thank-you banner after FormSubmit redirects back with ?sent=1 */
    if (params.get('sent') === '1') {
      var ok = root.querySelector('#ma-connect-success');
      var form = root.querySelector('.ma-connect__form');
      if (ok) ok.hidden = false;
      if (form) form.style.display = 'none';
      root.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  document.addEventListener('shopify:section:load', init);
})();
