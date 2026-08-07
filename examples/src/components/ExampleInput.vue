<script setup lang="ts">
import type { ExampleState } from '@docs/.vitepress/theme/components/ExampleContainer.vue'
import { computed } from 'vue'

import type { BaseInputModel } from '@/index.ts'

import type { Rule } from '../../../src/types/common-types'

const model = defineModel<BaseInputModel>()

interface ExampleInput extends ExampleState {
  kind?: 'base' | 'use-check'
  label?: string
  placeholder?: string
  rules?: Rule[]
  withStates?: boolean
}

const { error } = defineProps<ExampleInput>()

// #region example-input-basic-classes
const basicClasses =
  'text-my-label bg-my-body-background selection:bg-my-label selection:text-my-body-background w-full rounded-lg px-4 py-2.5 transition-all duration-150 outline-none hover:ring focus:ring'
// #endregion example-input-basic-classes

// #region example-input-state-classes
const stateClasses = computed(() => ({
  'disabled:text-my-label/60 read-only:text-my-label/60 peer selection:text-my-body-background bg-my-body-background w-full rounded-lg border px-4 py-2.5 transition-all duration-150 outline-none read-only:cursor-not-allowed read-only:border-dashed disabled:cursor-not-allowed disabled:border-transparent': true,
  'selection:bg-my-label text-my-label hover:not-invalid:border-my-label focus:not-invalid:border-my-label invalid:placeholder:text-my-required invalid:border-my-required not-read-only:border-transparent':
    !error,
  'selection:bg-my-error text-my-error border-my-error': error,
}))
// #endregion example-input-state-classes
</script>

<template>
  <!-- #region example-input-template -->
  <div class="relative w-full">
    <label class="text-sm empty:hidden">{{ label }}</label>
    <BaseInput
      v-model="model"
      :class="withStates ? stateClasses : basicClasses"
      :disabled
      name="example-input"
      :placeholder
      :readonly
      :required
    />
    <div
      class="absolute inset-0 hidden cursor-not-allowed bg-transparent peer-read-only:block peer-disabled:block"
    ></div>
  </div>
  <!-- #endregion example-input-template -->
</template>
