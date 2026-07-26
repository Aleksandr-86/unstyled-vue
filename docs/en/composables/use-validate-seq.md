# Составная функция `useValidate`

<script setup>
import { data } from '../../composables.data.ts'
import { ref } from 'vue'

const error1 = ref(false)
</script>

<ComposableTable :data="data.useValidateSeq"/>

<!-- <<< @/../src/composables/useCheckbox.ts#use-checkbox-composable{ts} -->

<ExampleContainer>
    <div>
    <ExampleUseValidateSeq placeholder="Обязательное поле" label="Логин" :error="error1" />
    {{error1}}
    <button @click="error1 = !error1">Внешний триггер ошибки</button>
    </div>
</ExampleContainer>
