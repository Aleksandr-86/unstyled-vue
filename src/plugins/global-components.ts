import VField from '@/components/input-controls/field/VField.vue'
import VInput from '@/components/input-controls/input/VInput.vue'

import type { App } from 'vue'

export default {
  install: (app: App) => {
    app.component('VInput', VInput)
    app.component('VField', VField)
  },
}
