const headTags = `
<!-- Start cookieyes banner -->
<script id="cookieyes" type="text/javascript" src="https://cdn-cookieyes.com/client_data/598fae4ae82d14bcb6ef9572/script.js"></script>
<!-- End cookieyes banner -->

<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-JPGP34N3JJ"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-JPGP34N3JJ');
</script>`

async function googleAnalyticsPlugin() {
  return {
    name: 'knapsackpro-google-analytics-plugin',

    injectHtmlTags() {
      return {
        headTags,
      }
    },
  };
}

module.exports = googleAnalyticsPlugin;
