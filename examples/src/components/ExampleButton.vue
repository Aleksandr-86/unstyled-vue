<script setup lang="ts">
interface ExampleButton {
  label: string

  kind?: 'label' | 'success'
}

const { kind = 'label' } = defineProps<ExampleButton>()
</script>

<template>
  <button
    class="w-fit rounded-md border px-2 py-1 text-xs"
    :class="{
      'text-my-btn-label bg-my-btn-label-bg': kind === 'label',
      'text-my-btn-success bg-my-btn-success-bg': kind === 'success',
    }"
  >
    {{ label }}
  </button>
</template>
