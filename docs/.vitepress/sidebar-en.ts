import type { DefaultTheme } from 'vitepress'

export const sidebarConfigEnglish: DefaultTheme.Sidebar = {
  '/en/components': [
    { text: 'Overview', link: '/en/components/' },
    { text: 'BaseCheckbox', link: '/en/components/base-checkbox' },
    { text: 'BaseInput', link: '/en/components/base-input' },
    { text: 'BaseTable', link: '/en/components/base-table' },
    { text: 'BaseTextarea', link: '/en/components/base-textarea' },
    // { text: 'BaseToggle', link: '/en/components/base-toggle' },
    // { text: 'SegmentedControl', link: '/en/components/segmented-control' },
  ],

  '/en/composables': [
    { text: 'useValidate', link: '/en/composables/use-validate-seq' },
  ],
}
