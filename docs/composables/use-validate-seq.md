# `useValidateSeq`

<script setup>
import { data } from '../types.data.ts'
import { ref } from 'vue'

const exampleModel1 = ref('admin')
const exampleModel2 = ref('admin')

const composableData = {
  parameters: [
    {
      name: 'model',
      type: 'MaybeRefOrGetter<T>',
      description: 'Модель целевого компонента',
    },
    {
      name: 'options',
      type: 'UseValidateOptions',
      description: 'Параметры',
    },
  ],
}
</script>

<div class="mt-3 flex flex-col gap-y-5">
  <ComposableTable
    :composable="composableData"
    :interfaces="[data.UseValidateOptions, data.Rule, data.ValidationError]"
    :return-values="data.UseValidateSeqReturn"
  >
<template #description>
<h3 class="mt-2! mb-0!">Составная функция для последовательной валидации поля</h3>
</template>

<template #subDescription>

<h6 class="my-0!">Под последовательной валидацией понимается порядок проверки, при котором значение поля поочерёдно проверяется каждым правилом массива <span class="text-code">rules</span>. Проверка останавливается после первой найденной ошибки или успешного выполнения всех проверок.</h6>
</template>
</ComposableTable>

</div>

## Примеры

<details>
<summary class="select-none cursor-pointer">Код используемого компонента</summary>

<<< @/../examples/src/composables/use-validate-seq/ExampleRuUseValidateSeq.vue#example-ru-use-validate-seq {59-67vue}

</details>

### Синхронная и асинхронная валидация поля через вызов функции `validate`

В данном примере массив правил `rules` содержит два правила:

- синхронное — проверяет, что поле не пустое;
- асинхронное — имитирует запрос к серверу длительностью `2` секунды и возвращает ошибку, если значение поля равно `'admin'`.

<ExampleContainer #default="{ modelValue, updateModelValue }" v-model="exampleModel1">
<ExampleRuUseValidateSeq
label="Логин"
:model-value="modelValue"
placeholder="Обязательное поле"
@update:model-value="updateModelValue"
/>
</ExampleContainer>

### Ограничение времени асинхронной проверки

В следующем примере в объект `options` передано свойство `timeout`:

```ts
{
    ms: 1000,
    message: 'Превышено время запроса к серверу валидации'
}
```

Этот объект ограничивает время асинхронной проверки `1` секундой и задаёт текст сообщения, которое вернётся при его превышении. Так как в данном примере асинхронное правило длится `2` секунды, то возвращаемые составной функцией `useValidateSeq` вычисляемые свойства `error` и `errorMessage` будут иметь значения `true` и `Превышено время запроса к серверу валидации` соответственно.

<ExampleContainer #default="{ modelValue, updateModelValue }" v-model="exampleModel2">
<ExampleRuUseValidateSeq
label="Логин"
:model-value="modelValue"
placeholder="Обязательное поле"
:timeout="{ ms: 1000, message: 'Превышено время запроса к серверу валидации' }"
@update:model-value="updateModelValue"
/>
</ExampleContainer>

## Комментарии к устройству компонента

Свойство `disabled` параметра `options` имеет наивысший приоритет, в то время как свойства `error` и `errorMessage` имеют приоритет над массивом правил `rules`.

Правила массива `rules` должны возвращать либо логические значения (`true` или `false`), либо строку (текст сообщения об ошибке). Для того чтобы проконтролировать данные условия, рекомендуется явно указывать тип `Rule` предоставляемый библиотекой. Примеры:

```ts
const isRequired: Rule<string> = (value) => !!value || 'Поле обязательно для заполнения'
const isChecked: Rule<boolean> = (value) => value || 'Поле обязательно для выбора'
const isEqual100: Rule<number> = (value) => value === 100 || 'Значение не равно 100'

const isUsernameUnique: Rule<string> = async (username) => {
  try {
    const response = await fetch(`/api/check-username?username=${encodeURIComponent(username)}`)
    const data = await response.json()

    return data.isAvailable === true ? true : 'Это имя пользователя уже занято'
  } catch {
    return 'Ошибка сервера при проверке имени'
  }
}
```
