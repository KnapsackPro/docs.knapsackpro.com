/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  sidebar: [
    {
      type: 'doc',
      label: 'Integration',
      id: 'index',
    },
    {
      type: 'doc',
      label: 'Overview',
      id: 'overview/index',
    },
    {
    type: 'category',
    label: 'Ruby',
    collapsible: true,
    collapsed: true,
    items: [
      {
        type: 'doc',
        label: 'Installation',
        id: 'knapsack_pro-ruby/guide/index',
      },
      {
        type: 'doc',
        label: 'Reference',
        id: 'ruby/reference',
      },
      {
        type: 'doc',
        label: 'Troubleshooting',
        id: 'ruby/troubleshooting',
      },
      {
        type: 'category',
        label: 'Advanced',
        collapsible: true,
        collapsed: true,
        items: [
          {
            type: 'doc',
            label: 'Cookbook',
            id: 'ruby/cookbook',
          },
          {
            type: 'doc',
            label: 'Hooks',
            id: 'ruby/hooks',
          },
          {
            type: 'doc',
            label: 'Split by test examples',
            id: 'ruby/split-by-test-examples',
          },
        ],
      },
      {
        type: 'category',
        label: 'Use Knapsack Pro with...',
        collapsible: true,
        collapsed: true,
        items: [
          {
            type: 'doc',
            label: 'CodeClimate',
            id: 'ruby/code-climate',
          },
          {
            type: 'doc',
            label: 'Heroku CI',
            id: 'ruby/heroku',
          },
          {
            type: 'doc',
            label: 'parallel_tests',
            id: 'ruby/parallel_tests',
          },
          {
            type: 'doc',
            label: 'puffing-billy',
            id: 'ruby/puffing-billy',
          },
          {
            type: 'doc',
            label: 'RSpec',
            id: 'ruby/rspec',
          },
          {
            type: 'doc',
            label: 'simplecov',
            id: 'ruby/simplecov',
          },
          {
            type: 'doc',
            label: 'spring',
            id: 'ruby/spring',
          },
          {
            type: 'doc',
            label: 'Capybara',
            id: 'ruby/capybara',
          },
          {
            type: 'doc',
            label: 'Cucumber',
            id: 'ruby/cucumber',
          },
        ]
      },
      {
        type: 'link',
        label: 'GitHub',
        href: 'https://github.com/KnapsackPro/knapsack_pro-ruby',
      },
      {
        type: 'link',
        label: 'FAQ',
        href: 'https://knapsackpro.com/faq/knapsack_pro_client/knapsack_pro_ruby',
      },
      {
        type: 'link',
        label: 'Changelog',
        href: 'https://github.com/KnapsackPro/knapsack_pro-ruby/blob/master/CHANGELOG.md#change-log',
      },
    ]
  }, {
    type: 'category',
    label: 'Cypress',
    collapsible: true,
    collapsed: true,
    items: [
      {
        type: 'doc',
        label: 'Installation',
        id: 'cypress/guide/index',
      },
      {
        type: 'doc',
        label: 'Reference',
        id: 'cypress/reference',
      },
      {
        type: 'doc',
        label: 'Troubleshooting',
        id: 'cypress/troubleshooting',
      },
      {
        type: 'doc',
        label: 'Cookbook',
        id: 'cypress/cookbook',
      },
      {
        type: 'link',
        label: 'GitHub',
        href: 'https://github.com/KnapsackPro/knapsack-pro-cypress',
      },
      {
        type: 'link',
        label: 'FAQ',
        href: 'https://knapsackpro.com/faq/knapsack_pro_client/knapsack_pro_cypress',
      },
      {
        type: 'link',
        label: 'Changelog',
        href: 'https://github.com/KnapsackPro/knapsack-pro-cypress/blob/master/CHANGELOG.md#changelog',
      },
    ]
  }, {
    type: 'category',
    label: 'Jest',
    collapsible: true,
    collapsed: true,
    items: [
      {
        type: 'doc',
        label: 'Installation',
        id: 'jest/guide/index',
      },
      {
        type: 'doc',
        label: 'Reference',
        id: 'jest/reference',
      },
      {
        type: 'doc',
        label: 'Troubleshooting',
        id: 'jest/troubleshooting',
      },
      {
        type: 'doc',
        label: 'Cookbook',
        id: 'jest/cookbook',
      },
      {
        type: 'link',
        label: 'GitHub',
        href: 'https://github.com/KnapsackPro/knapsack-pro-jest',
      },
      {
        type: 'link',
        label: 'FAQ',
        href: 'https://knapsackpro.com/faq/knapsack_pro_client/knapsack_pro_jest',
      },
      {
        type: 'link',
        label: 'Changelog',
        href: 'https://github.com/KnapsackPro/knapsack-pro-jest/blob/master/CHANGELOG.md#changelog',
      },
    ]
  }, {
    type: 'category',
    label: 'JavaScript / TypeScript',
    collapsible: true,
    collapsed: true,
    items: [
      {
        type: 'doc',
        label: 'Reference',
        id: 'javascript-typescript/reference',
      },
      {
        type: 'doc',
        label: 'Troubleshooting',
        id: 'javascript-typescript/troubleshooting',
      },
      {
        type: 'link',
        label: 'Guide',
        href: 'https://docs.knapsackpro.com/2020/how-to-build-native-integration-with-knapsack-pro-api-to-run-tests-in-parallel-for-any-test-runner-testing-framework',
      },
      {
        type: 'link',
        label: 'GitHub',
        href: 'https://github.com/KnapsackPro/knapsack-pro-core-js',
      },
      {
        type: 'link',
        label: 'FAQ',
        href: 'https://knapsackpro.com/faq/knapsack_pro_client/knapsack_pro_cypress#knapsack_pro_core_js',
      },
      {
        type: 'link',
        label: 'Changelog',
        href: 'https://github.com/KnapsackPro/knapsack-pro-core-js/blob/master/CHANGELOG.md#changelog',
      },
    ]
  }, {
    type: 'category',
    label: 'Other Language',
    collapsible: true,
    collapsed: true,
    items: [
      {
        type: 'link',
        label: 'Guide',
        href: 'https://docs.knapsackpro.com/2021/how-to-build-knapsack-pro-api-client-from-scratch-in-any-programming-language',
      },
    ]
  }],
};

module.exports = sidebars;
