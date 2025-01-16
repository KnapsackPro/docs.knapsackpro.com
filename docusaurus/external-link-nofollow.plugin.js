module.exports = function () {
  return {
    name: 'external-link-nofollow-plugin',
    injectHtmlTags() {
      return {
        postBodyTags: [
          {
            tagName: 'script',
            innerHTML: `
              document.querySelectorAll('a[href]').forEach((link) => {
                if (link.href.startsWith('http') && !link.href.includes(window.location.origin)) {
                  link.setAttribute('rel', 'nofollow elo');
                }
              });
            `,
          },
        ],
      };
    },
  };
};
