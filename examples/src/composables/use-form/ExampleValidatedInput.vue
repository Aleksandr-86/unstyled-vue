<!-- #region example-validated-input -->
<script setup lang="ts">
import type { ExampleState } from '../../../../docs/.vitepress/theme/components/ExampleContainer.vue'
import type { BaseInputModel } from '../../../../src/components/base-input/index.ts'
import { useValidateSeq } from '../../../../src/composables/useValidateSeq'
import type { Rule } from '../../../../src/types/common-types'
import BaseClear from '../../components/base/BaseClear.vue'
import BaseLoader from '../../components/base/BaseLoader.vue'

const model = defineModel<BaseInputModel>()

interface ExampleInput extends ExampleState {
  label?: string
  rules?: Rule<string>[]
}

const { rules } = defineProps<ExampleInput>()

const { errorExist, errorMsg, isValidating, uid, validate } = useValidateSeq(model, {
  rules,
  onResetValue: () => (model.value = ''),
})
</script>

<template>
  <div class="flex w-full flex-col gap-y-1">
    <label class="text-xs" :for="uid">{{ label }}</label>

    <div
      class="bg-my-body-background relative flex items-center gap-x-2 rounded-lg pe-3 transition-all duration-150 outline-none"
      :class="{
        'text-my-error ring': errorExist,
        'text-my-label': !errorExist,
        'focus-within:ring hover:ring': !isValidating,
      }"
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
        @blur="validate"
      />
      <BaseLoader v-if="isValidating" :class="errorExist ? 'text-my-error' : 'text-my-label'" />
      <BaseClear
        v-if="model && model !== ''"
        :class="errorExist ? 'fill-my-error' : 'fill-my-label'"
        @click="model = ''"
      />

      <div v-if="isValidating" class="absolute inset-0 cursor-not-allowed bg-transparent"></div>
    </div>
    <div class="text-my-error h-4 text-xs">{{ errorMsg }}</div>
  </div>
</template>
<!-- #endregion example-validated-input -->
