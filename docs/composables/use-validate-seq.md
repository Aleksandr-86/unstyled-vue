# `useValidate`

<script setup>
import { data } from '../composables.data.ts'
import { ref } from 'vue'

const exampleModel1 = ref('admin')
const exampleModel2 = ref('admin')
</script>

<ComposableTable class="mt-3" :data="data.useValidateSeq"/>

<<< @/../src/types/common-types.ts#use-validate-options

## Примеры

<details>
<summary class="select-none cursor-pointer">Код используемого компонента</summary>

<<< @/../examples/src/components/use-validate-seq/ExampleRuUseValidateSeq.vue#example-ru-use-validate-seq {47-55vue}

</details>

### Синхронная и асинхронная валидация поля через вызов функции `validate`

В данном примере массив правил `rules` содержит два правила:

- синхронное — проверяет, что поле не пустое;
- асинхронное — имитирует запрос к серверу длительностью `2` секунды.

Асинхронное правило возвращает ошибку, если значение поля равно `'admin'`.

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

Это значение ограничивает время асинхронной проверки `1` секундой и определяет возвращаемое сообщение. Поскольку имитация асинхронного правила длится `2` секунды, проверка прервётся через `1` секунду.

<ExampleContainer #default="{ modelValue, updateModelValue }" v-model="exampleModel2">
<ExampleRuUseValidateSeq
label="Логин"
:model-value="modelValue"
placeholder="Обязательное поле"
:timeout="{ ms: 1000, message: 'Превышено время запроса к серверу валидации' }"
@update:model-value="updateModelValue"
/>
</ExampleContainer>
