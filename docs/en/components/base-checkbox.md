# BaseCheckbox

## Model

The component uses the following generic model type:

```ts
T | T[]

```

where `T` extends `CheckboxItem`:

<<< @/../src/components/base-checkbox/index.ts#checkbox-item {ts}

::: info
The model is not required
:::

## Props

<script setup>
import { data } from '../../props.data.ts'
</script>

<PropsTable :rows="data.BaseCheckboxProps"  />

## Template

<<< @/../src/components/base-checkbox/BaseCheckbox.vue#base-checkbox-template {1,8,22html}

## Examples

### Checkbox with basic styling

<ExampleContainer>
  <template #default="{ modelValue, updateModelValue }">
    <ExampleCheckbox label="Label" :model-value="modelValue" @update:model-value="updateModelValue" />
  </template>
</ExampleContainer>

<<< @/../examples/src/components/ExampleCheckbox.vue#example-checkbox-basic-template {5-7html}

### Checkbox with advanced styling

<ExampleContainer>
  <template #default="{ modelValue, updateModelValue }">
    <ExampleCheckbox kind="advanced" label="Label" :model-value="modelValue" @update:model-value="updateModelValue" />
  </template>
</ExampleContainer>

<<< @/../examples/src/components/ExampleCheckbox.vue#example-checkbox-advanced-template {5-7html}

### Checkbox with states

In this example, the custom class `accent-my-label` (previously used to tint the checkbox color to `my-label`) is replaced with the utility class `appearance-none`. This class provides full freedom when styling the checkbox border and background.

<ExampleContainer disabled error readonly required>
  <template #default="{ disabled, error, readonly, required, modelValue, updateModelValue }">
    <ExampleCheckbox
      :disabled
      :error
      kind="states"
      label="Label"
      :model-value="modelValue"
      :readonly
      :required
      @update:model-value="updateModelValue"
    />
  </template>
</ExampleContainer>

<<< @/../examples/src/components/ExampleCheckbox.vue#example-checkbox-states-tailwind-template {6-10html}

In the example above, styling is handled as follows: the corresponding attributes (`disabled`, `aria-invalid`, `readonly`, `required`) are passed to the `<input>` element, while `Tailwind` classes with state modifiers react to these attributes and apply the necessary styles. <br />
Alternatively, you can combine state modifiers with `Vue` dynamic classes, placing the main emphasis on the dynamic classes. Example:

<ExampleContainer disabled error readonly required>
  <template #default="{ disabled, error, readonly, required, modelValue, updateModelValue }">
    <ExampleCheckbox
      :disabled
      :error
      kind="states-classes"
      label="Label"
      :model-value="modelValue"
      :readonly
      :required
      @update:model-value="updateModelValue"
    />
  </template>
</ExampleContainer>

<<< @/../examples/src/components/ExampleCheckbox.vue#example-checkbox-states-classes {ts}

### Checkbox with an Icon

::: warning
In this example, the `input` element is visually hidden but remains accessible to screen readers using the `sr-only` class, which consists of the following `CSS rules`:

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

This is necessary because a `div` element, serving as a container for an `SVG image`, is used to display the selection field instead of the `input` element.
:::

<ExampleContainer>
  <template #default="{ modelValue, updateModelValue }">
    <ExampleCheckbox kind="icons" label="Label" :model-value="modelValue" @update:model-value="updateModelValue" />
  </template>
</ExampleContainer>

<<< @/../examples/src/components/ExampleCheckbox.vue#example-checkbox-icons-template {6-9,21,23-29html}

### Switch

<ExampleContainer>
  <template #default="{ modelValue, updateModelValue }">
    <ExampleCheckbox kind="switch" label="Текст" :model-value="modelValue" @update:model-value="updateModelValue" />
  </template>
</ExampleContainer>

<<< @/../examples/src/components/ExampleCheckbox.vue#example-checkbox-switch-template {5-7,16html}

## Component architecture notes

The generic type allows the model to be either a single value or an array of values. A single `boolean` type is used by default. This typing ensures basic type safety. The examples below illustrate errors successfully intercepted by the `TypeScript` compiler.

```vue
<!-- BaseCheckbox standalone usage -->
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
<!-- BaseCheckbox group usage -->
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

However, this check is not exhaustive. If the `trueValue`, `falseValue`, or `value` parameters accept `null` or `undefined` values, the `TypeScript` compiler will not flag an error. Example:

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
