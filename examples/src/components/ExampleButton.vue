<script setup lang="ts">
interface ExampleButton {
  label: string

  color?: 'primary' | 'green'
  disabled?: boolean
  form?: string
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const { color = 'primary', type = 'button' } = defineProps<ExampleButton>()
</script>

<template>
  <button
    class="gap-1 rounded-md border px-2 py-1 text-xs transition-transform duration-100 outline-none focus:ring"
    :class="[
      loading ? 'justify-between' : 'justify-center',
      {
        'active:scale-[0.98]': !disabled,
        'text-my-btn-label bg-my-btn-label-bg disabled:text-my-btn-label/70 disabled:bg-my-btn-label-bg/70 focus:ring-my-label':
          color === 'primary',
        'text-my-btn-success bg-my-btn-success-bg disabled:text-my-btn-success/70 disabled:bg-my-btn-success-bg/70 focus:ring-my-success':
          color === 'green',
      },
    ]"
    :disabled
    :form
    :type
  >
    {{ label }}
  </button>
</template>
