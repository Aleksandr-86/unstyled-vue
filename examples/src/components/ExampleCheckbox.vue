<script setup lang="ts">
// import BaseCheckbox from '@/components/base-checkbox/index.ts'
import { computed } from 'vue'

import type { BaseCheckboxProps } from '@/index'

interface ExampleCheckboxProps extends BaseCheckboxProps {
  /** Наличие ошибки */
  error?: boolean
  /** Категория примера */
  kind?: 'basic' | 'advanced' | 'states-tailwind' | 'states-classes' | 'icons' | 'switch'
}

const model = defineModel<string | number | boolean | null>()

const { disabled, error, readonly, required } = defineProps<ExampleCheckboxProps>()

//  #region example-checkbox-states-classes
const statesClasses = computed(() => {
  let input =
    'peer border-my-input-border bg-my-input-bg h-3 w-3 cursor-pointer appearance-none rounded-[3px] border bg-clip-content p-px'

  if (disabled) {
    input += ' checked:bg-my-label/70 checked:border-my-label/70 cursor-not-allowed'
  } else if (error) {
    input += ' checked:border-my-error group-hover:border-my-error checked:bg-my-error focus:border-my-error'
  } else if (readonly) {
    input += ' checked:border-my-label/70 checked:bg-my-label/70 cursor-not-allowed'
  } else {
    input +=
      ' checked:border-my-label checked:bg-my-label group-hover:border-my-label group-hover:required:not-checked:border-my-required'

    if (required) {
      input += ' focus:not-checked:border-my-required'
    } else {
      input += ' focus:border-my-label'
    }
  }

  if (readonly) {
    input += ' border-dashed'
  } else {
    input += ' border-solid'
  }

  let label = ''

  if (disabled || readonly) {
    label = 'text-my-label/70'
  } else if (error) {
    label = 'text-my-error'
  } else {
    label = 'text-my-label peer-required:peer-invalid:text-my-required'
  }

  let root = 'group flex cursor-pointer items-center gap-1 select-none'

  if (disabled || readonly) {
    root += ' cursor-not-allowed'
  }

  return {
    root,
    input,
    label,
  }
})
//  #endregion example-checkbox-states-classes
</script>

<template>
  <!-- #region example-checkbox-advanced-template -->
  <BaseCheckbox
    v-if="kind === 'advanced'"
    v-model="model"
    :classes="{
      root: 'border-my-label/60 hover:border-my-label has-focus:border-my-label has-checked:bg-my-label/10 flex h-fit cursor-pointer items-center gap-1 rounded-lg border bg-transparent p-2 transition-colors duration-150 select-none',
      input: 'accent-my-label peer',
      label: 'text-my-label/70 peer-hover:text-my-label peer-checked:text-my-label',
    }"
    :label
    name="example-checkbox-advanced"
    @click="console.log($event)"
    @keydown="console.log($event)"
  />
  <!-- #endregion example-checkbox-advanced-template -->

  <!-- #region example-checkbox-states-tailwind-template -->
  <BaseCheckbox
    v-else-if="kind === 'states-tailwind'"
    v-model="model"
    :aria-invalid="error"
    :classes="{
      root: 'group flex cursor-pointer items-center gap-1 select-none has-disabled:cursor-not-allowed has-aria-readonly:cursor-not-allowed',
      input:
        'peer aria-invalid:checked:border-my-error enabled:checked:border-my-label border-my-input-border group-hover:required:border-my-required focus:required:border-my-required group-hover:enabled:not-aria-readonly:not-aria-invalid:not-required:border-my-label focus:enabled:not-aria-readonly:not-aria-invalid:not-required:border-my-label aria-readonly:checked:border-my-label/70 aria-readonly:checked:bg-my-label/70 group-hover:aria-invalid:border-my-error bg-my-input-bg checked:bg-my-label disabled:checked:bg-my-label/70 disabled:checked:border-my-label/70 aria-invalid:focus:border-my-error aria-invalid:checked:bg-my-error h-3 w-3 cursor-pointer appearance-none rounded-[3px] border border-solid bg-clip-content p-px disabled:cursor-not-allowed aria-readonly:cursor-not-allowed aria-readonly:border-dashed',
      label:
        'text-my-label peer-aria-invalid:text-my-error peer-required:peer-invalid:text-my-required peer-disabled:text-my-label/70 peer-aria-readonly:text-my-label/70',
    }"
    :disabled
    :label
    name="example-checkbox-states"
    :readonly
    :required
    @click="console.log($event)"
    @keydown="console.log($event)"
  />
  <!-- #endregion example-checkbox-states-tailwind-template -->

  <BaseCheckbox
    v-else-if="kind === 'states-classes'"
    v-model="model"
    :aria-invalid="error"
    :classes="statesClasses"
    :disabled
    :label
    name="example-checkbox-states"
    :readonly
    :required
    @click="console.log($event)"
    @keydown="console.log($event)"
  />

  <!-- #region example-checkbox-icons-template -->
  <BaseCheckbox
    v-else-if="kind === 'icons'"
    v-model="model"
    :aria-invalid="error"
    :classes="{
      root: 'group flex cursor-pointer items-center gap-1 select-none has-disabled:cursor-not-allowed',
      input: 'group/input peer sr-only',
      label:
        'text-my-label peer-aria-invalid:text-my-error peer-required:peer-invalid:text-my-required peer-disabled:text-my-label/70',
    }"
    :disabled
    :label
    name="example-checkbox-icons"
    :readonly
    :required
    @click="console.log($event)"
    @keydown="console.log($event)"
  >
    <template #control>
      <div
        class="border-my-label before:bg-my-label/10 relative h-3 w-3 rounded-[3px] border before:absolute before:-inset-2 before:scale-0 before:rounded-full before:transition-transform before:duration-300 before:content-[''] group-hover:before:scale-100 peer-focus:before:scale-100"
      >
        <svg class="stroke-my-label fill-none stroke-3" viewBox="0 0 24 24">
          <path
            class="duration-300 ease-in-out [stroke-dasharray:24]"
            :class="model ? '[stroke-dashoffset:0]' : '[stroke-dashoffset:24]'"
            d="M5.5 12 L10 16.5 L18.5 6.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </template>
  </BaseCheckbox>
  <!-- #endregion example-checkbox-icons-template -->

  <!-- #region example-checkbox-switch-template -->
  <BaseCheckbox
    v-else-if="kind === 'switch'"
    v-model="model"
    :classes="{
      root: 'group has-focus:ring-my-label/30 inline-flex cursor-pointer items-center gap-x-1.25 rounded-xl p-0.75 select-none has-focus:ring',
      input: 'peer sr-only',
      label: 'text-my-label',
    }"
    :label
    name="example-checkbox-switch"
    @click="console.log($event)"
    @keydown="console.log($event)"
  >
    <template #control>
      <div
        class="ease bg-my-switch-body peer-checked:bg-my-primary block h-2 w-6.25 min-w-6.25 rounded-full transition-all duration-150 after:relative after:top-[-0.15rem] after:left-0 after:block after:h-3.25 after:w-3.25 after:rounded-full after:border after:border-slate-400 after:bg-white after:transition-all after:duration-200 after:ease-linear peer-checked:after:left-3"
      ></div>
    </template>
  </BaseCheckbox>
  <!-- #endregion example-checkbox-switch-template -->

  <!-- #region example-checkbox-basic-template -->
  <BaseCheckbox
    v-else
    v-model="model"
    :classes="{
      root: 'flex cursor-pointer items-center gap-1 select-none',
      input: 'accent-my-label cursor-pointer',
      label: 'text-my-label',
    }"
    :label
    name="example-checkbox-basic"
    @click="console.log($event)"
    @keydown="console.log($event)"
  />
  <!-- #endregion example-checkbox-basic-template -->
</template>
