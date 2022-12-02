// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const DOCS_URL = 'https://docs.knapsackpro.com';
const KNAPSACK_PRO_URL = 'https://knapsackpro.com';

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'My Site',
  tagline: 'Dinosaurs are cool',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

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
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

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
            value: `<a href="https://knapsackpro.com/" class="navbar__link site-title">Knapsack Pro</a>&nbsp;<a href="/" class="navbar__link site-title"> <strong>Docs</strong> </a>`,
          },
          {
            type: 'html',
            position: 'right',
            value: `<a href="https://www.youtube.com/c/ArturTrzop" class="navbar__link menu__link menu__link--icon" rel="nofollow noopener" target="_blank"><i class="fab fa-youtube"></i></a>`,
          },
          {
            type: 'html',
            position: 'right',
            value: `<a href="https://twitter.com/KnapsackPro" class="navbar__link menu__link menu__link--icon" rel="nofollow noopener" target="_blank"><i class="fab fa-twitter"></i></a>`,
          },
          {
            type: 'html',
            position: 'right',
            value: `<a href="https://www.facebook.com/KnapsackPro" class="navbar__link menu__link menu__link--icon" rel="nofollow noopener" target="_blank" class="pagelink"><i class="fab fa-facebook-square"></i></a>`,
          },
          {
            type: 'html',
            position: 'right',
            value: `<a href="https://www.linkedin.com/company/knapsackpro/" class="navbar__link menu__link menu__link--icon" rel="nofollow noopener" target="_blank"><i class="fab fa-linkedin"></i></a>`,
          },
          {
            type: 'html',
            position: 'right',
            value: `<a href="https://github.com/KnapsackPro" class="navbar__link menu__link menu__link--icon" rel="nofollow noopener" target="_blank"><i class="fab fa-github"></i></a>`,
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
            target: '_self'
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/docusaurus',
              },
              {
                label: 'Discord',
                href: 'https://discordapp.com/invite/docusaurus',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/docusaurus',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/facebook/docusaurus',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
