# `useForm`

<script setup>
import { data } from '../types.data.ts'
</script>

<div class="mt-3 flex flex-col gap-y-5">
  <ComposableTable
    :interfaces="[data.UseValidateOptions, data.Rule, data.ValidationError]"
    :return-values="data.UseValidateReturn"
  >
<template #description>
<h3 class="mt-2! mb-0!">Составная функция для валидации полей формы</h3>
</template>
</ComposableTable>

</div>

## Примеры

<ExampleContainer simple>
    <ExampleRuUseForm />
</ExampleContainer>
