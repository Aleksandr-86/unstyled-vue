<script lang="ts" setup>
import VInput from '@/components/input/VInput.vue'

import { computed } from 'vue'

import type { InputEmits, InputProps } from '@/components/input/VInput.vue'

export interface FieldProps extends InputProps {
  /** Текст перед полем ввода */
  prefix?: string
  /** Текст после поля ввода */
  suffix?: string
}

const { suffix } = defineProps<FieldProps>()

interface FieldEmits extends InputEmits {
  (e: 'input', value: string): void
}

const emit = defineEmits<FieldEmits>()

const model = defineModel({ type: String })

const hasError = computed(() => true)
</script>

<template>
  <div class="v-field__container">
    <div v-if="!!$slots.prepend" class="v-field__slot_prepend">
      <slot :has-error="hasError" name="prepend"></slot>
    </div>

    <div v-if="prefix" class="v-field__prefix">
      <p>{{ prefix }}</p>
    </div>

    <VInput v-model="model" maxlength="5" minlength="3" :id />

    <div v-if="suffix" class="v-field__suffix">
      <p>{{ suffix }}</p>
    </div>

    <div v-if="!!$slots.append" class="v-field__slot_append">
      <slot :has-error="hasError" name="append"></slot>
    </div>
  </div>
</template>

<style lang="scss">
.v-field {
  &__container {
    display: flex;
    align-items: center;
    background-color: blueviolet;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  &__input {
    outline: none;
    background-color: transparent;
    background-color: wheat;
    width: 100%;
    height: 100%;
  }

  &__slot_prepend,
  &__prefix,
  &__suffix,
  &__slot_append {
    display: flex;
    align-items: center;
    height: 100%;
  }

  &__slot_prepend:empty,
  &__slot_append:empty {
    display: none;
  }
}
</style>
