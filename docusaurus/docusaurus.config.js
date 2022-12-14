// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const DOCS_URL = 'https://docs.knapsackpro.com';
const KNAPSACK_PRO_URL = 'https://knapsackpro.com';
const REPO_URL = 'https://github.com/KnapsackPro/docs.knapsackpro.com';

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Knapsack Pro Docs',
  tagline: 'Speed up your tests',
  url: 'https://docs.knapsackpro.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  trailingSlash: true,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'KnapsackPro', // Usually your GitHub org/user name.
  projectName: 'docs.knapsackpro.com', // Usually your repo name.

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://use.fontawesome.com/releases/v5.0.13/css/all.css',
        integrity: 'sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:site',
        content: '@KnapsackPro',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'description',
        content: 'Speed up your tests with optimal test suite parallelisation on your CI. Blog & documentation for Knapsack Pro.',
      },
    },
  ],

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/KnapsackPro/docs.knapsackpro.com/tree/main/docusaurus/',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: ['./googleAnalytics.plugin.js'],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        logo: {
          alt: 'Knapsack Pro logo',
          src: 'img/logo.png',
          href: 'https://knapsackpro.com/',
        },
        items: [
          {
            type: 'html',
            position: 'left',
            className: 'pl-0',
            value: `<a href="https://knapsackpro.com/" class="navbar__link site-title" rel="nofollow noopener" target="_blank">Knapsack Pro</a>&nbsp;<a href="/" class="navbar__link site-title"><strong>Docs</strong></a>`,
          },
          {
            to: DOCS_URL,
            label: 'Blog',
            position: 'right',
            target: '_self'
          },
          {
            to: `${DOCS_URL}/integration/`,
            label: 'Get started with integration',
            position: 'right',
            target: '_self'
          },
          {
            to: `${DOCS_URL}/api/`,
            label: 'API',
            position: 'right',
            target: '_self'
          },
          {
            to: KNAPSACK_PRO_URL,
            label: 'Sign up',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            title: 'Contribute',
            items: [
              {
                html: `<ul class="contact-list"><li>Found a typo? Want to contribute?</li><li><a href="${REPO_URL}" rel="nofollow noopener" target="_blank">Source Code of this site</a></li></ul>`
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                html: `<a href="https://www.youtube.com/c/ArturTrzop" class="footer__link-item" rel="nofollow noopener" target="_blank"><i class="fab fa-youtube"></i>&nbsp;Testing tips</a>`,
              },
              {
                html: `<a href="https://twitter.com/KnapsackPro" class="footer__link-item" rel="nofollow noopener" target="_blank"><i class="fab fa-twitter"></i>&nbsp;Follow us on Twitter</a>`,
              },
              {
                html: `<a href="https://www.facebook.com/KnapsackPro" class="footer__link-item" rel="nofollow noopener" target="_blank" class="pagelink"><i class="fab fa-facebook-square"></i>&nbsp;Like our Fanpage</a>`,
              },
              {
                html: `<a href="https://www.linkedin.com/company/knapsackpro/" class="footer__link-item" rel="nofollow noopener" target="_blank"><i class="fab fa-linkedin"></i>&nbsp;Follow us on LinkedIn</a>`,
              },
              {
                html: `<a href="https://github.com/KnapsackPro" class="footer__link-item" rel="nofollow noopener" target="_blank"><i class="fab fa-github"></i>&nbsp;GitHub</a>`,
              },
            ],
          },
          {
            title: 'Knapsack Pro',
            items: [
              {
                html: `Speed up your tests with optimal test suite parallelisation on your CI.`
              },
            ],
          },
        ],
        copyright: `© 2015 - ${new Date().getFullYear()} <a href="${KNAPSACK_PRO_URL}" rel="nofollow noopener" target="_blank">KnapsackPro.com</a>`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['ruby', 'bash'],
      },
    }),
};

module.exports = config;
