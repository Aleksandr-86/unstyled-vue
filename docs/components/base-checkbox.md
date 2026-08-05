# BaseCheckbox

## Модель

В компоненте используется следующий обобщённый тип модели:

```ts
T | T[]

```

где `T` является типом `CheckboxItem`:

<<< @/../src/components/base-checkbox/index.ts#checkbox-item {ts}

::: info Информация
Модель не является обязательной
:::

## Входные параметры

<script setup>
import { data } from '../props.data.ts'
</script>

<PropsTable :rows="data.BaseCheckboxProps"  />

## Шаблон

<<< @/../src/components/base-checkbox/BaseCheckbox.vue#base-checkbox-template {1,8,22html}

## Примеры

### Поле выбора с простым набором стилей

<ExampleContainer>
  <template #default="{ modelValue, updateModelValue }">
    <ExampleCheckbox label="Текст" :model-value="modelValue" @update:model-value="updateModelValue" />
  </template>
</ExampleContainer>

<<< @/../examples/src/components/ExampleCheckbox.vue#example-checkbox-basic-template {5-7html}

### Поле выбора с расширенным набором стилей

<ExampleContainer>
  <template #default="{ modelValue, updateModelValue }">
    <ExampleCheckbox kind="advanced" label="Текст" :model-value="modelValue" @update:model-value="updateModelValue" />
  </template>
</ExampleContainer>

<<< @/../examples/src/components/ExampleCheckbox.vue#example-checkbox-advanced-template {5-7html}

### Поле выбора с состояниями

В данном примере пользовательский класс `accent-my-label` (использовавшийся для окраски поля выбора в цвет `my-label`) заменён на служебный класс `appearance-none`. Этот класс даёт свободу в стилизации границы и фона поля выбора.

<ExampleContainer disabled error readonly required>
  <template #default="{ disabled, error, readonly, required, modelValue, updateModelValue }">
    <ExampleCheckbox
      :disabled
      :error
      kind="states-tailwind"
      label="Текст"
      :model-value="modelValue"
      :readonly
      :required
      @update:model-value="updateModelValue"
    />
  </template>
</ExampleContainer>

<<< @/../examples/src/components/ExampleCheckbox.vue#example-checkbox-states-tailwind-template {6-10html}

В примере выше стилизация выполняется следующим образом: в элемент передаются соответствующие атрибуты (`disabled`, `aria-invalid`, `readonly`, `required`), а классы `Tailwind` с модификаторами состояний реагируют на эти атрибуты и применяют нужные стили. <br />
Также возможно использование модификаторов состояний и динамических классов `Vue` с акцентом на динамические классы. Пример:

<ExampleContainer disabled error readonly required>
  <template #default="{ disabled, error, readonly, required, modelValue, updateModelValue }">
    <ExampleCheckbox
      :disabled
      :error
      kind="states-classes"
      label="Текст"
      :model-value="modelValue"
      :readonly
      :required
      @update:model-value="updateModelValue"
    />
  </template>
</ExampleContainer>

<<< @/../examples/src/components/ExampleCheckbox.vue#example-checkbox-states-classes {ts}

### Поле выбора с иконкой

::: warning Предупреждение
В данном примере элемент `input` визуально скрыт, но доступен для программ экранного доступа при помощи класса `sr-only`, который является набором следующих `CSS-правил`:

```css
.your-class-name {
  position: absolute;
  clip-path: inset(50%);
  margin: -1px;
  border-width: 0;
  padding: 0;
  width: 1px;
  height: 1px;
  overflow: hidden;
  white-space: nowrap;
}
```

Это необходимо, так как для отображения поля выбора вместо элемента `input` используется элемент `div` являющийся контейнером для `SVG-изображения`.
:::

<ExampleContainer>
  <template #default="{ modelValue, updateModelValue }">
    <ExampleCheckbox kind="icons" label="Текст" :model-value="modelValue" @update:model-value="updateModelValue" />
  </template>
</ExampleContainer>

<<< @/../examples/src/components/ExampleCheckbox.vue#example-checkbox-icons-template {6-9,21,23-29html}

### Переключатель

<ExampleContainer>
  <template #default="{ modelValue, updateModelValue }">
    <ExampleCheckbox kind="switch" label="Текст" :model-value="modelValue" @update:model-value="updateModelValue" />
  </template>
</ExampleContainer>

<<< @/../examples/src/components/ExampleCheckbox.vue#example-checkbox-switch-template {5-7,16html}

## Комментарии к устройству компонента

Обобщённый тип позволяет модели быть как одиночным значением, так и массивом значений. По умолчанию используется одиночный логический тип (`boolean`). Такая типизация обеспечивает базовую безопасность типов. Примеры ниже демонстрируют ошибки, перехваченные компилятором TypeScript. <br />

```vue
<!-- Одиночное использование BaseCheckbox -->
<script setup lang="ts">
import { ref } from 'vue'

import BaseCheckbox from '@/components/base-checkbox/BaseCheckbox.vue'

const parentModel = ref<string>('')
</script>

<template>
  <BaseCheckbox v-model="parentModel" :false-value="0" :true-value="1" />
</template>
```

```bash
examples/src/App.vue:10:17 - error TS2322: Type 'string' is not assignable to type '0 | 0[] | undefined'.

10   <BaseCheckbox v-model="parentModel" :false-value="0" :true-value="1" />
                   ~~~~~~~
```

```vue
<!-- Групповое использование BaseCheckbox -->
<script setup lang="ts">
import { ref } from 'vue'

import BaseCheckbox from '@/components/base-checkbox/BaseCheckbox.vue'

const parentModel = ref<string[]>([])
</script>

<template>
  <BaseCheckbox v-model="parentModel" :value="5" />
  <BaseCheckbox v-model="parentModel" :value="10" />
</template>
```

```bash [.terminal]
examples/src/App.vue:10:17 - error TS2322: Type 'string[]' is not assignable to type '5 | 5[] | undefined'.
  Type 'string[]' is not assignable to type '5[]'.
    Type 'string' is not assignable to type '5'.

10   <BaseCheckbox v-model="parentModel" :value="5" />
                   ~~~~~~~


examples/src/App.vue:11:17 - error TS2322: Type 'string[]' is not assignable to type '10 | 10[] | undefined'.
  Type 'string[]' is not assignable to type '10[]'.
    Type 'string' is not assignable to type '10'.

11   <BaseCheckbox v-model="parentModel" :value="10" />
                   ~~~~~~~
```

Однако проверка работает не во всех случаях. Если параметры `trueValue`, `falseValue` или `value` примут значения `null` или `undefined`, компилятор `TypeScript` не выдаст ошибку. Пример:

```vue
<script setup lang="ts">
import { ref } from 'vue'

import BaseCheckbox from '@/components/base-checkbox/BaseCheckbox.vue'

const parentModel = ref<string>('')
</script>

<template>
  <BaseCheckbox v-model="parentModel" :true-value="null" />
</template>
```
