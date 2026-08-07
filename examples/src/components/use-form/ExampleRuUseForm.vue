<script setup lang="ts">
import { computed, ref } from 'vue'

import { useForm } from '../../../../src/composables/useForm.ts'
import type { Rule } from '../../../../src/types/common-types.ts'
import { delay } from '../../../src/utils/delay.ts'
import ExampleButton from '../ExampleButton.vue'
import ExampleValidatedInput from './ExampleValidatedInput.vue'

const { clearForm, isSubmitting, resetErrors, validateForm } = useForm()

const formHasErrors = ref<boolean | undefined>(undefined)

const validationState = computed(() => {
  if (formHasErrors.value === undefined) {
    return 'валидация не выполнялась'
  } else if (formHasErrors.value === true) {
    return 'валидация выполнена - есть ошибки'
  } else {
    return 'валидация выполнена - ошибок нет'
  }
})

async function onSubmit() {
  const isValid = await validateForm()

  if (isValid) {
    formHasErrors.value = false
  } else {
    formHasErrors.value = true
  }
}

function onResetErrors() {
  resetErrors()
  formHasErrors.value = undefined
}

function onResetForm() {
  clearForm()
  formHasErrors.value = undefined
}

/** Синхронные правила */
const isRequiredSync: Rule<string> = (value) => !!value || 'Поле обязательно для заполнения'
const hasMinLength: Rule<string> = (value) => value.length >= 4 || 'Требуется ввести не менее 4 символов'

/** Асинхронное правило */
const checkRemoteAsync: Rule<string> = async (value: string) => {
  await delay(2000)
  return value !== 'admin' || 'Этот логин уже занят'
}
</script>

<template>
  <div class="flex grow flex-col items-end gap-y-4">
    <form id="auth-form" class="flex w-full flex-col gap-4" @submit.prevent="onSubmit">
      <h3 class="text-lg font-semibold">
        Статус валидации формы:
        <span
          :class="{
            'text-my-success': formHasErrors === false,
            'text-my-error': formHasErrors === true,
          }"
          >{{ validationState }}</span
        >
      </h3>

      <div>
        <ExampleValidatedInput label="Логин" :rules="[isRequiredSync, hasMinLength, checkRemoteAsync]" />
        <ExampleValidatedInput label="Пароль" :rules="[isRequiredSync, hasMinLength]" />
      </div>
    </form>

    <div class="flex flex-wrap gap-4">
      <ExampleButton class="w-32" color="green" label="Сбросить ошибки" @click="onResetErrors" />
      <ExampleButton class="w-32" color="green" label="Сбросить форму" @click="onResetForm" />
      <ExampleButton
        class="w-32"
        :disabled="isSubmitting"
        form="auth-form"
        :label="isSubmitting ? 'Проверка...' : 'Отправить'"
        :loading="isSubmitting"
        type="submit"
      />
    </div>
  </div>
</template>
