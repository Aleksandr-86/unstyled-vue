<!-- #region example-en-use-validate-seq -->
<script setup lang="ts">
import { ref } from 'vue'

import type { ExampleState } from '../../../../docs/.vitepress/theme/components/ExampleContainer.vue'
import BaseInput from '../../../../src/components/base-input/BaseInput.vue'
import { useValidateSeq } from '../../../../src/composables/useValidateSeq'
import type { BaseInputModel } from '../../../../src/index'
import type { ValidationError } from '../../../../src/types/common-types.ts'
import { delay } from '../../utils/delay.ts'
import BaseClear from '../base/BaseClear.vue'
import BaseLoader from '../base/BaseLoader.vue'
import ExampleButton from '../ExampleButton.vue'

const model = defineModel<BaseInputModel>()

interface ExampleUseValidateSeqProps extends ExampleState {
  label: string
  placeholder: string

  timeout?: {
    ms: number
    message?: string
  }
}

const { timeout } = defineProps<ExampleUseValidateSeqProps>()

/** Synchronous rule */
const isRequiredSync = (value: string) => !!value || 'Field is required'

/** Asynchronous rule */
const checkRemoteAsync = async (value: string) => {
  await delay(2000)
  return value !== 'admin' || 'This login is already taken'
}

/** Array of rules */
const rules = [isRequiredSync, checkRemoteAsync]

const disabled = ref(false)
const error = ref(false)
const errorMessage = ref<string>('')

function onValidationError(evt: ValidationError) {
  console.log('onValidationError', evt)
}

const { errorExist, errorMsg, isValidating, resetError, uid, validate } = useValidateSeq(model, {
  rules,
  timeout,
  error,
  errorMessage,
  disabled,

  onValidationError,
})

function invokeValidate() {
  validate()
    .then((evt) => {
      console.warn('invokeValidate evt', evt)
    })
    .catch((err) => {
      console.warn('invokeValidate err', err)
    })
}
</script>

<template>
  <div class="flex w-full flex-col items-end gap-y-3">
    <div class="flex flex-wrap gap-2 text-sm">
      <button
        class="rounded-md p-1"
        :class="error ? 'bg-my-error/30 text-my-error' : 'bg-my-divider/30'"
        @click="error = !error"
      >
        error: {{ error }}
      </button>
      <BaseInput
        v-model="errorMessage"
        class="w-40 rounded-md px-2 py-1 text-ellipsis"
        :class="error ? 'bg-my-error/30 text-my-error' : 'bg-my-divider/30'"
        placeholder="errorMessage"
      />
      <button
        class="rounded-md p-1"
        :class="disabled ? 'bg-my-divider/30' : 'bg-my-success/30'"
        @click="disabled = !disabled"
      >
        validation: {{ disabled ? 'disabled' : 'enabled' }}
      </button>
    </div>

    <div class="flex w-full flex-col gap-y-1">
      <label class="text-xs" :for="uid">{{ label }}</label>

      <div
        class="bg-my-body-background flex items-center gap-x-2 rounded-lg pe-3 transition-all duration-150 outline-none"
        :class="errorExist ? 'text-my-error ring' : 'text-my-label focus-within:ring hover:ring'"
      >
        <BaseInput
          :id="uid"
          v-model="model"
          class="selection:text-my-body-background w-full py-2.5 ps-4 text-ellipsis outline-none"
          :class="
            errorExist
              ? 'selection:bg-my-error placeholder:text-my-error/50'
              : 'selection:bg-my-label placeholder:text-my-label/50'
          "
          :placeholder
          @keydown.enter="invokeValidate"
        />
        <BaseLoader v-if="isValidating" :class="errorExist ? 'text-my-error' : 'text-my-label'" />
        <BaseClear
          v-if="model && model !== ''"
          :class="errorExist ? 'fill-my-error' : 'fill-my-label'"
          @click="model = ''"
        />
      </div>

      <div class="text-my-error h-4 text-xs">{{ errorMsg }}</div>
    </div>

    <div class="flex flex-wrap gap-3">
      <ExampleButton color="green" label="Reset error" @click="resetError" />
      <ExampleButton label="Validate manually" @click="invokeValidate" />
    </div>
  </div>
</template>
<!-- #endregion example-en-use-validate-seq -->
