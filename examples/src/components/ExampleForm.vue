<script setup lang="ts">
import { ref } from 'vue'

import { useForm } from '../../../src/composables/useForm.ts'
import ExampleInput from './ExampleInput.vue'

const username = ref('')
const email = ref('')

const { isSubmitting, validateForm } = useForm()

async function handleSubmit() {
  const isValid = await validateForm()

  if (isValid) {
    console.log('Форма прошла валидацию.')
  } else {
    console.log('Форма содержит ошибку.')
  }
}
</script>

<template>
  <form class="form" @submit.prevent="handleSubmit">
    <h2>Регистрация нового пользователя</h2>

    <ExampleInput v-model="username" label="Логин" />
    <ExampleInput v-model="email" label="Email" />

    <button :disabled="isSubmitting" type="submit">
      {{ isSubmitting ? 'Проверка...' : 'Отправить форму' }}
    </button>
  </form>
</template>
