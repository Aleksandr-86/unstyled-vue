import type { DefaultTheme } from 'vitepress'

export const sidebarConfigRussian: DefaultTheme.Sidebar = {
  '/components': [
    { text: 'Обзор', link: '/components/' },
    { text: 'BaseCheckbox', link: '/components/base-checkbox' },
    { text: 'BaseInput', link: '/components/base-input' },
    { text: 'BaseTable', link: '/components/base-table' },
    { text: 'BaseTextarea', link: '/components/base-textarea' },
    // { text: 'BaseToggle', link: '/components/base-toggle' },
    // { text: 'SegmentedControl', link: '/components/segmented-control' },
  ],

  '/composables': [
    { text: 'useCheckbox', link: '/composables/use-checkbox' },
    { text: 'useValidate', link: '/composables/use-validate-seq' },
  ],
}
