<!-- #region example-1-use-validate-seq -->
<script setup lang="ts">
import type { ExampleState } from '../../../docs/.vitepress/theme/components/ExampleContainer.vue'
import { useValidateSeq } from '../../../src/composables/useValidateSeq'
import type { BaseInputModel } from '../../../src/index'
import BaseClear from './base/BaseClear.vue'
import BaseLoader from './base/BaseLoader.vue'
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
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return value !== 'admin' || 'Этот логин уже занят'
}

const rules = [isRequiredSync, checkRemoteAsync]

const { errExist, errMessage, isValidating, reset, uid, validate } = useValidateSeq(model, { rules })
</script>

<template>
  <div class="flex w-full flex-col items-end gap-y-3">
    <div class="flex w-full flex-col gap-y-1">
      <label class="text-xs" :for="uid">{{ label }}</label>

      <div
        class="bg-my-body-background flex items-center gap-x-2 rounded-lg pe-3 transition-all duration-150 outline-none"
        :class="errExist ? 'text-my-error ring' : 'text-my-label focus-within:ring hover:ring'"
      >
        <BaseInput
          :id="uid"
          v-model="model"
          class="selection:text-my-body-background w-full py-2.5 ps-4 text-ellipsis outline-none"
          :class="errExist ? 'selection:bg-my-error selection:' : 'selection:bg-my-label'"
          :placeholder
        />
        <BaseLoader v-if="isValidating" :class="errExist ? 'text-my-error' : 'text-my-label'" />
        <BaseClear
          v-if="model && model !== ''"
          :class="errExist ? 'fill-my-error' : 'fill-my-label'"
          @click="model = ''"
        />
      </div>

      <div v-if="errExist" class="text-my-error text-xs">{{ errMessage }}</div>
      <div v-else class="h-4"></div>
    </div>

    <div class="flex flex-wrap gap-3">
      <ExampleButton kind="success" label="Сбросить ошибку" @click="reset" />
      <ExampleButton label="Проверить вручную" @click="validate" />
    </div>
  </div>
</template>
<!-- #endregion example-1-use-validate-seq -->
