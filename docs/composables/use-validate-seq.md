# `useValidate`

<script setup>
import { data } from '../composables.data.ts'
import { ref } from 'vue'

const error1 = ref(false)
const inputModel = ref('admin')
</script>

<ComposableTable class="mt-3" :data="data.useValidateSeq"/>

<<< @/../src/types/common-types.ts#use-validate-options

## Примеры

<details>
<summary class="select-none cursor-pointer">Код используемого компонента</summary>

<<< @/../examples/src/components/use-validate-seq/ExampleRu1UseValidateSeq.vue#example-ru-1-use-validate-seq {47-55vue}

</details>

### Синхронная и асинхронная проверка поля через вызов функции validate

Данный пример использует массив правил `rules` имеющий одно синхронное правило проверяющее поле ввода на наличие непустого значения и одно асинхронное правило имитирующее запрос на сервер. Для примера асинхронное правило возвращает ошибку, в том случае если поле содержит значение `'admin'`. Массив правил может быть передан через параметр компонента, но для удобства отображения он объявлен непосредственно в блоке `<script>`.

В примере ниже

<ExampleContainer #default="{ modelValue, updateModelValue }" v-model="inputModel">
<ExampleRu1UseValidateSeq
label="Логин"
:model-value="modelValue"
placeholder="Обязательное поле"
@update:model-value="updateModelValue"
/>
</ExampleContainer>

### Ограничение времени асинхронной проверки

Следующий пример отличается от предыдущего установленным значением свойства `timeout` объекта `options`:

```ts
{
    ms: 500,
    message: 'Превышено время запроса к серверу валидации.'
}
```

Данное значение ограничивает время асинхронной проверки до `0,5` секунды. А так как в нашем примере имитация работы асинхронного правила длится `1` секунду, мы получаем ошибку уже через `0,5` секунды не дожидаясь ответа асинхронного правила.

<ExampleContainer #default="{ modelValue, updateModelValue }" v-model="inputModel">
<ExampleRu1UseValidateSeq
label="Логин"
:model-value="modelValue"
placeholder="Обязательное поле"
:timeout="{ ms: 500, message: 'Превышено время запроса к серверу валидации.' }"
@update:model-value="updateModelValue"
/>
</ExampleContainer>
