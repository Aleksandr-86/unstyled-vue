<script lang="ts" setup>
export interface InputProps {
  /** Область текста вместо поля ввода */
  area?: boolean
  /** Автозаполнение */
  autocomplete?: string
  /** Отключённое состояние поля ввода */
  disabled?: boolean
  /** Идентификатор поля ввода */
  id?: string
  /** Максимальная длина строки поля ввода */
  maxlength?: string | number
  /** Максимальная длина строки поля ввода */
  minlength?: string | number
  /** Имя поля ввода */
  name?: string
  /** Строка отображаемая в случае отсутствия какого-либо значения в поле ввода */
  placeholder?: string
  /** Состояние поля ввода "только для чтения" */
  readonly?: boolean
  /** Тип поля ввода */
  type?: 'email' | 'hidden' | 'number' | 'password' | 'search' | 'tel' | 'text'
}

const model = defineModel({ type: String })

const {
  area,
  autocomplete = 'off',
  disabled,
  id,
  maxlength,
  minlength,
  name,
  placeholder,
  readonly,
  type = 'text',
} = defineProps<InputProps>()

export interface InputEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'input', value: string): void
}

defineEmits<InputEmits>()
</script>

<template>
  <component
    :is="area ? 'textarea' : 'input'"
    :id
    v-model="model"
    :autocomplete
    :disabled
    :maxlength
    :minlength
    :name
    :placeholder
    :readonly
    :type
  />
</template>
