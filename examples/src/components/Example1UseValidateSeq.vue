<!-- #region example-1-use-validate-seq -->
<script setup lang="ts">
import type { ExampleState } from '../../../docs/.vitepress/theme/components/ExampleContainer.vue'
import { useValidateSeq } from '../../../src/composables/useValidateSeq'
import type { BaseInputModel } from '../../../src/index'
import ExampleButton from './ExampleButton.vue'

const model = defineModel<BaseInputModel>()

interface ExampleUseValidateSeqProps extends ExampleState {
  label: string
  placeholder: string
}

defineProps<ExampleUseValidateSeqProps>()

/** Синхронное правило */
const isRequiredSync = (value: string) => !!value || 'Поле обязательно для заполнения'

/** Асинхронная правило */
const checkRemoteAsync = async (value: string) => {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  return value !== 'admin' || 'Этот логин уже занят'
}

const { errExist, errMessage, reset, uid, validate } = useValidateSeq(model, {
  rules: [isRequiredSync, checkRemoteAsync],
})
</script>

<template>
  <div class="flex w-full flex-col items-end gap-y-3">
    <div class="flex w-full flex-col gap-y-1">
      <label class="text-xs" :for="uid">{{ label }}</label>
      <BaseInput
        :id="uid"
        v-model="model"
        class="bg-my-body-background selection:bg-my-label selection:text-my-body-background w-full rounded-lg px-4 py-2.5 transition-all duration-150 outline-none"
        :class="errExist ? 'text-my-error ring' : 'text-my-label hover:ring focus:ring'"
        :placeholder
      />
      <div class="text-my-error text-xs">{{ errMessage }}</div>
    </div>

    <div class="flex flex-wrap gap-3">
      <ExampleButton kind="success" label="Сбросить" @click="reset" />
      <ExampleButton label="Проверить вручную" @click="validate" />
    </div>
  </div>
</template>
<!-- #endregion example-1-use-validate-seq -->
