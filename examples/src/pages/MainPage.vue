<script setup lang="ts">
import BaseCheckbox from '@/components/base-checkbox/BaseCheckbox.vue'

function onChange(evt) {
  console.log(evt)
}
</script>

<template>
  <BaseCheckbox @keydown="onChange" @update:model-value="console.log('evt update model', $event)" />
  <h3>Главная страница</h3>
</template>
