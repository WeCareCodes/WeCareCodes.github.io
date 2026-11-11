/* Goodsvalu 公司網站追蹤：GA4 + Google Ads（只用在公司頁面，App 子站不載入）
 * 只要改這裡的三個值；還是 placeholder（含 XXXX）時整支腳本不做任何事。 */
(function () {
  var GA4_ID = 'G-HERCHT8155';         // GA4 評估 ID
  var ADS_ID = 'AW-XXXXXXXXXX';        // Google Ads 轉換 ID
  var ADS_LEAD_LABEL = 'XXXXXXXXXX';   // 「詢價表單送出」轉換動作的標籤

  function ok(id) { return id && id.indexOf('XXXX') === -1; }
  var hasGA = ok(GA4_ID), hasAds = ok(ADS_ID);
  var hasLead = hasAds && ok(ADS_LEAD_LABEL);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  // 感謝頁呼叫：送出 Ads 轉換與 GA4 generate_lead。
  // 只有表單剛送出成功（site.js 設了 gv_lead_pending）才計算，直接打開或重新整理感謝頁都不會重複計
  window.gvTrackLead = function () {
    try {
      if (!sessionStorage.getItem('gv_lead_pending')) return;
      sessionStorage.removeItem('gv_lead_pending');
    } catch (e) { return; }
    if (hasLead) gtag('event', 'conversion', { send_to: ADS_ID + '/' + ADS_LEAD_LABEL });
    if (hasGA) gtag('event', 'generate_lead', { form: 'quote' });
  };

  if (!hasGA && !hasAds) return;

  window.gtag = gtag;
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + (hasGA ? GA4_ID : ADS_ID);
  document.head.appendChild(s);

  gtag('js', new Date());
  if (hasGA) gtag('config', GA4_ID);
  if (hasAds) gtag('config', ADS_ID);

  // mailto 點擊：GA4 次要轉換（只觀察，不拿來出價）
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[href^="mailto:"]');
    if (a && hasGA) gtag('event', 'contact_email_click', { link_text: (a.textContent || '').trim().slice(0, 60), page_path: location.pathname });
  }, true);
})();
