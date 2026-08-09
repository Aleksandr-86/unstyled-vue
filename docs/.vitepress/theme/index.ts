/// <reference types="vite/client" />
/* eslint-disable simple-import-sort/imports */

import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

// Порядок имеет значение. В данном случае пользовательские стили должны импортироваться после стилей по умолчанию.
import './main.css'

import ExampleContainer from './components/ExampleContainer.vue'
import PropsTable from './components/PropsTable.vue'
import ComposableTable from './components/ComposableTable.vue'

import ExampleButton from '../../../examples/src/components/ExampleButton.vue'

import BaseCheckbox from '../../../src/components/base-checkbox/BaseCheckbox.vue'
import ExampleCheckbox from '../../../examples/src/components/ExampleCheckbox.vue'
import ExampleRuUseForm from '../../../examples/src/composables/use-form/ExampleRuUseForm.vue'
import ExampleEnUseForm from '../../../examples/src/composables/use-form/ExampleEnUseForm.vue'
import ExampleValidatedInput from '../../../examples/src/composables/use-form/ExampleValidatedInput.vue'
import BaseInput from '../../../src/components/base-input/BaseInput.vue'
import ExampleInput from '../../../examples/src/components/ExampleInput.vue'
import ExampleRuUseValidateSeq from '../../../examples/src/composables/use-validate-seq/ExampleRuUseValidateSeq.vue'
import ExampleEnUseValidateSeq from '../../../examples/src/composables/use-validate-seq/ExampleEnUseValidateSeq.vue'
import BaseTable from '../../../src/components/base-table/BaseTable.vue'
import ExampleTable from '../../../examples/src/components/ExampleTable.vue'
import BaseTextarea from '../../../src/components/base-textarea/BaseTextarea.vue'
import ExampleTextarea from '../../../examples/src/components/ExampleTextarea.vue'

export default {
  extends: DefaultTheme,

  enhanceApp({ app }) {
    // Глобальная регистрация компонентов
    app.component('PropsTable', PropsTable)
    app.component('ComposableTable', ComposableTable)
    app.component('ExampleContainer', ExampleContainer)

    app.component('ExampleButton', ExampleButton)

    app.component('BaseCheckbox', BaseCheckbox)
    app.component('ExampleCheckbox', ExampleCheckbox)
    app.component('ExampleRuUseForm', ExampleRuUseForm)
    app.component('ExampleEnUseForm', ExampleEnUseForm)
    app.component('ExampleValidatedInput', ExampleValidatedInput)
    app.component('BaseInput', BaseInput)
    app.component('ExampleInput', ExampleInput)
    app.component('ExampleRuUseValidateSeq', ExampleRuUseValidateSeq)
    app.component('ExampleEnUseValidateSeq', ExampleEnUseValidateSeq)
    app.component('BaseTable', BaseTable)
    app.component('ExampleTable', ExampleTable)
    app.component('BaseTextarea', BaseTextarea)
    app.component('ExampleTextarea', ExampleTextarea)
  },
} satisfies Theme
