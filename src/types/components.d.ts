import '@vue/runtime-core'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    /** Элементы управления вводом */
    VInput: (typeof import('@/components/input-controls/input/VInput.vue'))['default']
    VField: (typeof import('@/components/input-controls/field/VField.vue'))['default']
  }
}
