# `useValidate`

<script setup>
import { data } from '../composables.data.ts'
import { ref } from 'vue'

const error1 = ref(false)
</script>

<ComposableTable class="mt-3" :data="data.useValidateSeq"/>

## Примеры

Каждый пример ниже содержит одно синхронное правило проверяющее поле на пустоту и одно асинхронное правило имитирующее запрос на сервер длительностью 

<details>
<summary class="select-none cursor-pointer">Example1UseValidateSeq</summary>

<<< @/../examples/src/components/Example1UseValidateSeq.vue#example-1-use-validate-seq {vue}

</details>

<ExampleContainer>
  <Example1UseValidateSeq label="Логин" placeholder="Обязательное поле" />
</ExampleContainer>

<!-- <ExampleContainer> <div>
    <ExampleUseValidateSeq placeholder="Обязательное поле" label="Логин" :error="error1" />
    {{error1}}
    <button @click="error1 = !error1">Внешний триггер ошибки</button>
    </div>
</ExampleContainer> -->
