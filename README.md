# unstyled-vue

Библиотека базовых Vue‑компонентов и составных функций (composables) для построения пользовательских интерфейсов. Компоненты не содержат встроенных стилей и спроектированы как атомарные элементы, позволяющие формировать произвольную структуру и оформление в рамках требуемой дизайн‑системы.

### Ссылки

- [Документация](https://ak-dvlp.github.io/unstyled-vue/)

### Установка пакетов

```bash
yarn install
```

### Интерактивное обновление пакетов

```bash
yarn upgrade-interactive --latest
```

<!--
### Запуск демонстрационной версии

```bash
yarn demo
``` -->

### Локальное развёртывание документации

```bash
yarn docs:dev
```

### Запуск тестов компонентов в режиме UI mode

```bash
yarn test-ct
```

---

<details>
<summary style="font-size: 1.25em; font-weight: 600;">🗄️ Структура проекта</summary>

```bash
├── .github/ - проектные настройки для VS Code
│   └── workflows/
│   │   └── deploy.yml - файл конфигурации страниц GitHub
├── .vscode/ - проектные настройки для VS Code
├── docs/ - документация
├── examples/
│   ├── public/ - статические ресурсы, которые не участвуют в сборке
│   ├── src/
│   │   ├── assets/ - статические ресурсы, которые участвуют в сборке
│   │   ├── plugins/
│   │   │   └── global-components.ts - глобальная регистрация компонентов библиотеки
│   │   ├── router/ - маршрутизатор
│   │   ├── styles/
│   │   │   ├── app.css - стили приложения
│   │   │   ├── base.css - семантические переменные, стили светлой и тёмной темы, пользовательские классы Tailwind
│   │   │   └── main.css - импорт стилей Tailwind и стилей файлов app.css и base.css
│   │   ├── types/
│   │   │   └── components.d.ts - определения типов TypeScript для глобально зарегистрированных компонентов библиотеки
│   │   ├── utils / - вспомогательные функции
│   │   ├── components/ - пользовательские компоненты
│   │   ├── views/ - представления
│   │   ├── App.vue - корневой компонент Vue-приложения
│   │   └── main.ts - точка входа во Vue-приложение
│   └── index.html - веб-страница для отображения Vue-приложения
├── playwright
│   ├── index.html
│   └── index.ts
├── src/
│   ├── components/ - компоненты библиотеки
│   ├── composables/ - составные функции библиотеки компонентов
│   ├── types/
│   │   ├── base-emits.ts - базовые типы событий для компонентов библиотеки
│   │   └── base-props.ts - базовые типы свойств для компонентов библиотеки
│   └── index.ts - экспорты компонентов библиотеки
├── tests/
│   ├── ui-components/ - тесты компонентов библиотеки
│   └── example-components/ - тесты пользовательских компонентов
├── .editorconfig - файл конфигурации среды разработки
├── .eslintcache - кэш результатов проверки ESLint
├── .gitattributes - файл установки правил обработки файлов в репозитории для конкретных путей или расширений
├── .gitignore - файл, который указывает Git, какие файлы и папки не нужно отслеживать в репозитории.
├── .nvmrc - файл, который указывает требуемую версию Node.js для проекта
├── .prettierrc - настройка правил форматирования для Prettier
├── env.d.ts - файл объявлений TypeScript, обеспечивающий безопасность типов, автозаполнение и распознавание компилятором переменных среды и импорта некодируемых ресурсов.
├── eslint.config.ts - файл конфигурации ESLint
├── package.json - главный файл конфигурации проекта на Node.js
├── playwright-ct.config.ts - файл конфигурации Playwright для тестов компонентов
├── playwright.config.ts - файл конфигурации Playwright для сквозных тестов (e2e)
├── README.md - главный файл документации проекта
├── tsconfig.app.json - файл конфигурации TypeScript, в котором задаются правила компиляции основного кода приложения
├── tsconfig.json - основной файл конфигурации TypeScript
├── tsconfig.node.json - отдельный конфигурационный файл TypeScript для кода, который выполняется в Node.js
├── tsconfig.vitest.json - отдельный конфигурационный файл TypeScript специально для тестов на Vitest.
├── vite.config.ts - файл конфигурации сборщика Vite
├── vitest.config.ts - файл конфигурации Vitest для модульных тестов (unit)
└── yarn.lock - файл, фиксирующий точные версии всех зависимостей (включая транзитивные), который гарантирует воспроизводимость окружения при установке пакетов.
```

</details>

<details>
<summary style="font-size: 1.25em; font-weight: 600;">⚙️ Конфигурация среды разработки и инструментов по форматированию</summary>

### .editorconfig

```python
[*.{js,jsx,mjs,cjs,ts,tsx,mts,cts,vue,css,scss,sass,less,styl}]
# Указание среде разработки сохранять целевые файлы в кодировке UTF-8.
charset = utf-8
# Добавление перевода строки в конце файла (если его нет).
insert_final_newline = true
# Задаёт стиль перевода строки LF
end_of_line = lf
# Удаление пробелов и табуляций в конце строк.
trim_trailing_whitespace = true
```

### settings.json

```ts
{
  // Запуск форматирования при каждом явном сохранении (Ctrl + S).
  "editor.formatOnSave": true,
  /**
   * Назначение Prettier в качестве основного средства форматирования кода для всего
   * проекта для всех типов файлов.
   */
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[vue]": {
    // Явное назначение Prettier в качестве основного средства форматирования Vue файлов.
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    /**
     * Явное назначение Prettier в качестве основного средства форматирования TypeScript
     * файлов.
     */
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.codeActionsOnSave": {
    /**
     * Исправляет все ошибки которые могут быть исправлены автоматически
     * при явном сохранении (Ctrl + S).
     */
    "source.fixAll.eslint": "explicit"
  },
  /**
   * Даёт расширению ESLint разрешение просматривать файлы JavaScript, TypeScript и Vue.
   * Без этой строки ESLint просматривал бы только исходные файлы JavaScript
   * и полностью игнорировал бы шаблоны .vue.
   */
  "eslint.validate": ["javascript", "typescript", "vue"],

  // Взаимодействие с расширением cSpell для проверки орфографии.
  "cSpell.words": ["..."]
}
```

### eslint.config.ts

```ts
export default defineConfigWithVueTs(
  {
    /**
     * Указывает ESLint на необходимость просматривать и проверять все файлы
     * с расширениями .vue и .ts в любом месте проекта.
     */
    files: ['**/*.{vue,ts}'],
    /**
     * Присваивает имя данному блоку настроек, чтобы его можно было легко найти,
     * если понадобится отладить конфигурацию.
     */
    name: 'app/files-to-lint',
  },

  /**
   * Указывает ESLint на необходимость полностью игнорировать перечисленные в
   * массиве папки.
   */
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  /**
   * Включает основные правила для Vue. Это позволяет выявлять серьёзные ошибки в шаблонах
   * Vue. Пример: конфликт директив v-if и v-for, использованных в одном HTML‑теге.
   */
  ...pluginVue.configs['flat/essential'],
  /**
   * Включает рекомендуемые правила для TypeScript. Они позволяют выявлять
   * распространённые ошибки. Пример: использование переменной до её объявления.
   */
  vueTsConfigs.recommended,

  /**
   * В этом блоке настраиваются плагины и определяется, как именно должен быть
   * организован и структурирован код проекта.
   */
  {
    // Присваивает имя данному блоку настроек.
    name: 'app/sorting-rules',
    // Регистрация плагинов.
    plugins: {
      perfectionist,
      'simple-import-sort': simpleImportSort,
      'sort-destructure-keys': sortDestructureKeys,
    },
    rules: {
      // Автоматическая сортировка структуры интерфейсов TypeScript.
      'perfectionist/sort-interfaces': [
        /**
         * Если интерфейс отсортирован неправильно, то это будет считаться критической
         * ошибкой.
         */
        'error',
        {
          // Сортировка свойств от A до Z.
          type: 'alphabetical',
          order: 'asc',

          // Добавляет одну пустую строку между группами свойств.
          newlinesBetween: 1,

          /**
           * Разделяет интерфейс на две части: все обязательные свойства располагаются в
           * самом верху (в алфавитном порядке от A до Z), а все необязательные — внизу
           * (также в алфавитном порядке от A до Z).
           */
          groups: ['required-properties', 'optional-properties', 'unknown'],
          customGroups: [
            {
              groupName: 'required-properties',
              selector: 'property',
              modifiers: ['required'],
            },
            {
              groupName: 'optional-properties',
              selector: 'property',
              modifiers: ['optional'],
            },
          ],
        },
      ],

      /**
       * Отключает общую сортировку объектов: обычные объекты не будут упорядочиваться по
       * алфавиту. Пример: const user = { x: 1, a: 0 };
       */
      'perfectionist/sort-objects': 'off',
      //
      //
      /**
       * Включает плагин для деструктуризации. Гарантирует сортировку извлечённых
       * переменных по алфавиту (без учёта регистра). Пример:
       * const { disabled, readonly } = defineProps(...)
       * переменные disabled и readonly в деструктуризации будут отсортированы от A до Z.
       */
      'sort-destructure-keys/sort-destructure-keys': ['error', { caseSensitive: false }],

      // Гарантирует алфавитный порядок импортов и экспортов вверху файла.
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': 'error',

      /**
       * Группирует атрибуты HTML и Vue по категориям и упорядочивает по приоритету:
       * v-if — в начале, события (@click и др.) — в конце, контентные атрибуты — в самом
       * конце. Внутри категорий — алфавитная сортировка.
       */
      'vue/attributes-order': [
        'error',
        {
          alphabetical: true,
          order: [
            'DEFINITION',
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            'UNIQUE',
            'SLOT',
            'TWO_WAY_BINDING',
            'OTHER_DIRECTIVES',
            'OTHER_ATTR',
            'EVENTS',
            'CONTENT',
          ],
        },
      ],
    },
  },

  /**
   * Применяет рекомендуемые правила тестирования от Playwright, но только к файлам в
   * папке для сквозного тестирования (e2e), которые заканчиваются на .test или .spec.
   */
  {
    ...pluginPlaywright.configs['flat/recommended'],
    files: ['e2e/**/*.{test,spec}.{js,ts,jsx,tsx}'],
  },

  /**
   * Применяет рекомендуемые правила тестирования от Vitest, но только к файлам модульных
   * тестов, которые находятся в папках src/**/__tests__.
   */
  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },

  /**
   * Правило безопасности от Prettier которое отключает все правила оформления ESLint
   * (например, правила, связанные с пробелами или табуляцией), которые могут конфликтовать
   * с средством форматирования Prettier. Таким образом, ESLint отвечает только за
   * логическую сортировку и ошибки в коде, а Prettier — за визуальное оформление.
   */
  skipFormatting,
)
```

`ESLint` выполняет сортировку:

а) Vue-атрибутов блока `<template>` (`eslint-plugin-vue`);  
б) импортов и экспортов (`eslint-plugin-simple-import-sort`);  
в) свойств интерфейсов, с разделением на свойства две группы: обязательные и опциональные  
(`eslint-plugin-perfectionist`);  
г) деструктурированных свойств объектов (`eslint-plugin-sort-destructure-keys`).

`Prettier` выполняет сортировку:

а) Служебных классов Tailwind в значении атрибута class и classes (`prettier-plugin-tailwindcss`);  
б) CSS-правил блока `<style>` однофайловых Vue-компонентов (`prettier-plugin-css-order`).

</details>
