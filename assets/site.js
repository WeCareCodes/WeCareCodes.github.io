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

  // 複製需求範本：Outlook 會把中文預填內文弄成亂碼，改由訪客自行貼上
  d.querySelectorAll('[data-copy]').forEach(function (b) {
    var label = b.textContent;
    b.addEventListener('click', function () {
      var text = b.getAttribute('data-copy');
      function ok() { b.textContent = b.dataset.done; setTimeout(function () { b.textContent = label; }, 2500); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(ok, fallback);
      } else { fallback(); }
      function fallback() {
        var ta = d.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;opacity:0'; d.body.appendChild(ta); ta.select();
        try { d.execCommand('copy'); ok(); } catch (e) {} d.body.removeChild(ta);
      }
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
