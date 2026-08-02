# `useValidateSeq`

<script setup>
import { data } from '../../types.data.ts'
import { ref } from 'vue'

const exampleModel1 = ref('admin')
const exampleModel2 = ref('admin')

const composableData = {
  description: 'A composable function for sequential field validation',
  parameters: [
    {
      name: 'model',
      type: 'MaybeRefOrGetter<T>',
      description: 'Target component model',
    },
    {
      name: 'options',
      type: 'UseValidateOptions',
      description: 'Parameters',
    },
  ],
}
</script>

<div class="mt-3 flex flex-col gap-y-5">
  <ComposableTable
    :composable="composableData"
    :interfaces="[data.UseValidateOptions, data.Rule, data.ValidationError]"
    :return-values="data.UseValidateReturn"
  />
</div>

## Examples

<details>
<summary class="select-none cursor-pointer">Used component code</summary>

<<< @/../examples/src/components/use-validate-seq/ExampleEnUseValidateSeq.vue#example-en-use-validate-seq {47-55vue}

</details>

### Synchronous and asynchronous field validation via `validate` function call

In this example, the `rules` array contains two rules:

- A synchronous rule that checks that the field is not empty.
- An asynchronous rule that simulates a 2-second server request and returns an error if the field value equals `'admin'`.

<ExampleContainer #default="{ modelValue, updateModelValue }" v-model="exampleModel1">
<ExampleEnUseValidateSeq
label="Login"
:model-value="modelValue"
placeholder="Required field"
@update:model-value="updateModelValue"
/>
</ExampleContainer>

### Asynchronous Validation Timeout

In the following example, the `timeout` property is passed to the `options` object:

```ts
{
    ms: 1000,
    message: 'Validation server request timed out'
}
```

This value limits the asynchronous validation time to `1` second and defines the returned message. Since the asynchronous rule simulation takes longer than `1` second, an error with the text `Validation server request timed out` will be returned.

<ExampleContainer #default="{ modelValue, updateModelValue }" v-model="exampleModel2">
<ExampleEnUseValidateSeq
label="Login"
:model-value="modelValue"
placeholder="Required field"
:timeout="{ ms: 1000, message: 'Validation server request timed out' }"
@update:model-value="updateModelValue"
/>
</ExampleContainer>

## Component architecture notes

The `disabled` property of the `options` parameter has the highest priority, while `error` and `errorMessage` take priority over the `rules` array.

Rules within the `rules` array must return either boolean values (`true` or `false`) or a string (the error message text). To enforce these constraints, it is recommended to explicitly specify the `Rule` type provided by the library. Examples:

```ts
const isRequired: Rule<string> = (value) => !!value || 'Field is required'
const isChecked: Rule<boolean> = (value) => value || 'Selection is required'
const isEqual100: Rule<number> = (value) => value === 100 || 'Value is not equal to 100'

const isUsernameUnique: Rule<string> = async (username) => {
  try {
    const response = await fetch(`/api/check-username?username=${encodeURIComponent(username)}`)
    const data = await response.json()

    return data.isAvailable === true ? true : 'Username is already taken'
  } catch {
    return 'Server error, please try again'
  }
}
```
