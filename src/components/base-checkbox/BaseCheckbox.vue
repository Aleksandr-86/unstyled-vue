<script setup lang="ts" generic="T extends CheckboxItem = boolean">
import type { BaseCheckboxEmits } from '../../types/base-emits'
import type { BaseCheckboxProps, CheckboxItem } from '.'

// #region base-checkbox-model
const model = defineModel<T | T[]>()
// #endregion base-checkbox-model

const {
  ariaDescribedby = undefined,
  ariaInvalid = undefined,
  ariaLabel = undefined,
  classes = undefined,
  disabled = false,
  falseValue = false,
  label = '',
  name = undefined,
  readonly = false,
  required = false,
  trueValue = true,
  value = undefined,
} = defineProps<BaseCheckboxProps<T>>()

const emit = defineEmits<BaseCheckboxEmits>()

function onInputClick(evt: PointerEvent) {
  if (readonly) {
    evt.preventDefault()
    evt.stopPropagation()
    return
  }

  emit('click', evt)
}

function onInputKeydownSpace(evt: KeyboardEvent) {
  if (readonly) {
    evt.preventDefault()
    evt.stopPropagation()
  }
}
</script>

<template>
  <!-- #region base-checkbox-template -->
  <label :class="classes?.root" @click.stop>
    <input
      v-model="model"
      :aria-describedby
      :aria-invalid
      :aria-label
      :aria-readonly="readonly"
      :class="classes?.input"
      :disabled
      :false-value
      :name
      :required
      :true-value
      type="checkbox"
      :value
      @click="onInputClick"
      @keydown.space="onInputKeydownSpace"
    />

    <slot name="control"></slot>

    <span :class="classes?.label">
      <slot>{{ label }}</slot>
    </span>
  </label>
  <!-- #endregion base-checkbox-template -->
</template>
