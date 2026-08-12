<script setup lang="ts">
import type { CheckboxItem } from '@/index.ts'

import BaseCheckbox from '../../../src/components/base-checkbox/BaseCheckbox.vue'

defineProps<{
  values: [CheckboxItem, CheckboxItem]
}>()

const model = defineModel<CheckboxItem[]>()
</script>

<template>
  <div>
    <div>model: {{ model }}</div>
    <BaseCheckbox v-model="model" :classes="{ input: 'first' }" :value="values[0]" />
    <BaseCheckbox v-model="model" :classes="{ input: 'last' }" :value="values[1]" />
  </div>
</template>
