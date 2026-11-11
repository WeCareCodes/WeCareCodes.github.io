/* Goodsvalu 官網共用互動：頁首陰影、手機選單、語言切換時更新 lang、捲動淡入 */
(function () {
  var d = document;

  function onScroll() {
    var s = (window.scrollY || d.documentElement.scrollTop || 0) > 4;
    d.querySelectorAll('.hdr').forEach(function (h) { h.classList.toggle('scrolled', s); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  d.querySelectorAll('.menu-btn').forEach(function (btn) {
    var nav = d.getElementById(btn.getAttribute('aria-controls'));
    if (!nav) return;
    function set(open) {
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? btn.dataset.close : btn.dataset.open);
    }
    btn.addEventListener('click', function () { set(!nav.classList.contains('open')); });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { set(false); }); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { set(false); btn.focus(); } });
  });

  ['zh', 'en'].forEach(function (l) {
    var r = d.getElementById('lang-' + l);
    if (r) r.addEventListener('change', function () { d.documentElement.lang = l === 'zh' ? 'zh-Hant' : 'en'; });
  });

  // 詢價表單（Formspree）：前端驗證 → fetch 送出 → 成功導向感謝頁（Google Ads 轉換點）
  d.querySelectorAll('form[data-gv-form]').forEach(function (form) {
    var err = form.querySelector('.qf-err');
    var btn = form.querySelector('button[type="submit"]');
    function showErr(msg) { if (err) { err.textContent = msg; err.hidden = !msg; } }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = form.querySelector(':invalid');
      if (bad) {
        showErr(bad.type === 'email' && bad.value ? 'Please enter a valid email address.' : 'Please fill in the required fields marked with *.');
        bad.focus();
        return;
      }
      if (/FORM_ID/.test(form.action)) { showErr('The form is not configured yet. Please email support@goodsvalu.com.'); return; }
      showErr('');
      var label = btn.textContent;
      btn.disabled = true; btn.textContent = btn.dataset.busy || label;
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error(r.status);
          try { sessionStorage.setItem('gv_lead_pending', '1'); } catch (x) {}
          location.href = '/contact/thanks/#en';
        })
        .catch(function () {
          btn.disabled = false; btn.textContent = label;
          showErr('Sorry, something went wrong. Please try again or email support@goodsvalu.com.');
        });
    });
  });

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  d.documentElement.classList.add('js-reveal');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  d.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
})();
