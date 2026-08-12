# `useForm`

<script setup>
import { data } from '../types.data.ts'
</script>

<div class="mt-3 flex flex-col gap-y-5">
  <ComposableTable
    :return-values="data.UseFormReturn"
  >
<template #description>
<h3 class="mt-2! mb-0!">Составная функция для валидации полей формы</h3>
</template>
</ComposableTable>

</div>

## Пример

<details>
<summary class="select-none cursor-pointer">Код компонента формы</summary>

<<< @/../examples/src/composables/use-form/ExampleRuUseForm.vue#example-ru-use-form {10vue}

</details>

<details>
<summary class="select-none cursor-pointer">Код компонента поля</summary>

<<< @/../examples/src/composables/use-form/ExampleValidatedInput.vue#example-validated-input {18-21vue}

</details>

<ExampleContainer simple>
    <ExampleRuUseForm />
</ExampleContainer>

## Комментарии к устройству компонента

::: warning Предупреждение
Составная функция `useForm` работает в связке с составной функцией `useValidateSeq`.
:::

Если валидируемая форма содержит ошибки, то по окончанию процесса валидации первое сверху поле с ошибкой может получить фокус. Для того чтобы такая фокусировка была возможна следует передать в атрибут `id` валидируемого поля уникальный идентификатор `uid` возвращаемый функцией `useValidateSeq`. <br />
Очистка полей формы при вызове функции `clearForm` выполняется через вызов функций `onResetValue` параметра `options` составной функции `useValidateSeq`. Логика очистки значений полей определяется пользователем для каждого поля. Функция `clearForm` лишь инициирует вызов функций `onResetValue`.
