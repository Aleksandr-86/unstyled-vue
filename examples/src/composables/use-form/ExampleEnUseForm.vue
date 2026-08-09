<!-- #region example-en-use-form -->
<script setup lang="ts">
import { computed, ref } from 'vue'

import { useForm } from '../../../../src/composables/useForm.ts'
import type { Rule } from '../../../../src/types/common-types.ts'
import { delay } from '../../../src/utils/delay.ts'
import ExampleButton from '../../components/ExampleButton.vue'
import ExampleValidatedInput from './ExampleValidatedInput.vue'

const { clearForm, isFormValidating, resetErrors, validateForm } = useForm()

const formHasErrors = ref<boolean | undefined>(undefined)

const validationState = computed(() => {
  if (formHasErrors.value === undefined) {
    return 'not performed'
  } else if (formHasErrors.value === true) {
    return 'performed with errors'
  } else {
    return 'performed without errors'
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
const isRequiredSync: Rule<string> = (value) => !!value || 'Field is required'
const hasMinLength: Rule<string> = (value) => value.length >= 4 || 'Must enter at least 4 characters '

/** Асинхронное правило */
const checkRemoteAsync: Rule<string> = async (value) => {
  await delay(4000)
  return value !== 'admin' || 'This login is already taken'
}
</script>

<template>
  <div class="flex grow flex-col items-end gap-y-4">
    <form id="auth-form" class="flex w-full flex-col gap-4" @submit.prevent="onSubmit">
      <h3 class="text-lg font-semibold">
        Form validation:
        <span
          :class="{
            'text-my-success': formHasErrors === false,
            'text-my-error': formHasErrors === true,
          }"
          >{{ validationState }}</span
        >
      </h3>

      <div>
        <ExampleValidatedInput label="Login" :rules="[isRequiredSync, hasMinLength, checkRemoteAsync]" />
        <ExampleValidatedInput label="Password" :rules="[isRequiredSync, hasMinLength]" />
      </div>
    </form>

    <div class="flex flex-wrap gap-4">
      <ExampleButton
        class="w-32"
        color="green"
        :disabled="isFormValidating"
        label="Reset errors"
        @click="onResetErrors"
      />
      <ExampleButton
        class="w-32"
        color="green"
        :disabled="isFormValidating"
        label="Reset form"
        @click="onResetForm"
      />
      <ExampleButton
        class="w-32"
        :disabled="isFormValidating"
        form="auth-form"
        :label="isFormValidating ? 'Submitting...' : 'Submit'"
        type="submit"
      />
    </div>
  </div>
</template>
<!-- #endregion example-en-use-form -->
