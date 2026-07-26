<script setup lang="ts">
import ExampleUseValidateSeq from '../components/ExampleUseValidateSeq.vue'
</script>

<template>
  <div class="flex flex-col gap-y-5">
    <h3>Главная страница</h3>
    <ExampleUseValidateSeq
      label="Логин"
      placeholder="Введите логин"
      @validation-error="console.log('validation-error', $event)"
    />
  </div>
</template>
