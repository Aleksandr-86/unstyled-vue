<script setup lang="ts">
import BaseCheckbox from '@/components/base-checkbox/BaseCheckbox.vue'

function onKeydown(evt) {
  console.log('onKeydown', evt)
}

function onClick(evt) {
  console.log('onClick', evt)
}

function onUpdate(evt) {
  console.log('onUpdate', evt)
}
</script>

<template>
  <BaseCheckbox @click="onClick" @keydown="onKeydown" @update:model-value="onUpdate" />
  <h3>Главная страница</h3>
</template>
