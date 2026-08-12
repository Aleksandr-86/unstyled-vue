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
    <input data-testid="first" />
    <BaseCheckbox :disabled label="Согласен с условиями" :readonly />
    <input data-testid="last" />
  </div>
</template>
