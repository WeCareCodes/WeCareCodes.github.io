/* Goodsvalu 官網共用互動：手機選單、語言切換時更新 lang、需求單組成郵件 */
(function () {
  var d = document;

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

  // 需求單：把選到的項目組成郵件內容，開啟使用者的郵件軟體
  d.querySelectorAll('form[data-slip]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var ds = f.dataset, lines = [ds.greet, ''];
      f.querySelectorAll('[data-label]').forEach(function (g) {
        var ta = g.querySelector('textarea');
        var v = ta ? [ta.value.trim()] : [].map.call(g.querySelectorAll('input:checked'), function (i) { return i.value; });
        lines.push(g.dataset.label + ds.sep + v.filter(Boolean).join(ds.join));
      });
      location.href = 'mailto:' + ds.to + '?subject=' + encodeURIComponent(ds.subject) + '&body=' + encodeURIComponent(lines.join('\n') + '\n');
      var done = f.querySelector('.slip-done');
      if (done) done.hidden = false;
    });
  });
})();
