# `useValidate`

<script setup>
import { data } from '../composables.data.ts'
import { ref } from 'vue'

const error1 = ref(false)
const inputModel = ref('admin')
</script>

<ComposableTable class="mt-3" :data="data.useValidateSeq"/>

## Примеры

::: info Информация
Каждый пример ниже использует массив правил `rules` имеющий одно синхронное правило (проверяет поле ввода на наличие непустого значения) и одно асинхронное правило (имитирует запрос на сервер). Массив правил может быть передан через параметр компонента, но в примерах для удобства отображения он объявлен непосредственно в блоке `<script>` примеров.
:::

### Синхронная и асинхронная проверка поля через вызов функции validate

<details>
<summary class="select-none cursor-pointer">Код</summary>

<<< @/../examples/src/components/Example1UseValidateSeq.vue#example-1-use-validate-seq {28vue}

</details>

В примере ниже асинхронное правило возвращает ошибку, в том случае если поле содержит значение `'admin'`.

<ExampleContainer #default="{ modelValue, updateModelValue }" v-model="inputModel">
<Example1UseValidateSeq
label="Логин"
:model-value="modelValue"
placeholder="Обязательное поле"
@update:model-value="updateModelValue"
/>
</ExampleContainer>

<!-- <ExampleContainer> <div>
    <ExampleUseValidateSeq placeholder="Обязательное поле" label="Логин" :error="error1" />
    {{error1}}
    <button @click="error1 = !error1">Внешний триггер ошибки</button>
    </div>
</ExampleContainer> -->
