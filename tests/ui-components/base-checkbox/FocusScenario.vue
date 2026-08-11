<script setup lang="ts">
import BaseCheckbox from '../../../src/components/base-checkbox/BaseCheckbox.vue'

interface BaseCheckboxWrapperProps {
  disabled?: boolean
  readonly?: boolean
}

defineProps<BaseCheckboxWrapperProps>()
</script>

<template>
  <div>
    <input data-testid="first-input" />
    <BaseCheckbox :disabled label="Согласен с условиями" :readonly />
    <input data-testid="second-input" />
  </div>
</template>
