import { defineConfig } from 'vitepress'

import { sidebarConfigEnglish } from './sidebar-en'
import { sidebarConfigRussian } from './sidebar-ru'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/unstyled-vue/',
  title: 'Unstyled-vue',
  description: 'Базовые Vue‑компоненты и составные функции: без встроенных стилей, под свою дизайн‑систему.',

  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/unstyled-vue/favicon.ico',
      },
    ],
  ],

  locales: {
    root: {
      label: 'Русский',
      lang: 'ru',

      themeConfig: {
        notFound: {
          title: 'СТРАНИЦА НЕ НАЙДЕНА',
          quote: 'Нажмите на кнопку ниже чтобы вернуться на главную страницу.',
          linkText: 'Вернуться',
        },

        nav: [
          {
            text: 'Навигация',
            activeMatch: '^/(components|composables)/',
            items: [
              { text: 'Компоненты', link: '/components/' },
              { text: 'Составные функции', link: '/composables/use-checkbox' },
            ],
          },
        ],

        // Левое навигационное меню
        sidebar: sidebarConfigRussian,

        // Метка времени последнего обновления для каждой страницы.
        lastUpdated: {
          text: 'Обновлено',
          formatOptions: {
            dateStyle: 'short',
            timeStyle: 'short',
          },
        },

        // Навигация по странице
        outline: {
          label: 'На этой странице',
        },

        // Ссылки подвала сайта
        docFooter: {
          prev: 'Предыдущая страница',
          next: 'Следующая страница',
        },

        // Локализация всплывающего окна
        search: {
          provider: 'local',
          options: {
            translations: {
              button: {
                buttonText: 'Поиск',
                buttonAriaLabel: 'Поиск',
              },
              modal: {
                noResultsText: 'Ничего не найдено',
                resetButtonTitle: 'Сбросить поиск',
                footer: {
                  selectText: 'Выбрать',
                  navigateText: 'Навигация',
                  closeText: 'Закрыть',
                },
              },
            },
          },
        },

        // Локализация переключателя темы
        darkModeSwitchLabel: 'Оформление',
        lightModeSwitchTitle: 'Переключить на светлую тему',
        darkModeSwitchTitle: 'Переключить на тёмную тему',

        // Локализация мобильного меню
        sidebarMenuLabel: 'Меню',
        returnToTopLabel: 'Вернуться к началу',
      },
    },

    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',

      themeConfig: {
        nav: [
          {
            text: 'Navigation',
            activeMatch: '^/en/(components|composables)/',
            items: [
              { text: 'Components', link: '/en/components/' },
              { text: 'Composables', link: '/en/composables/use-checkbox' },
            ],
          },
        ],

        sidebar: sidebarConfigEnglish,
      },
    },
  },

  themeConfig: {
    socialLinks: [{ icon: 'github', link: 'https://github.com/ak-dvlp/unstyled-vue' }],
  },
})
