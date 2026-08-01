# `useValidate`

<script setup>
import { data } from '../../composables.data.ts'
import { ref } from 'vue'

const exampleModel1 = ref('admin')
const exampleModel2 = ref('admin')
</script>

<ComposableTable class="mt-3" :data="data.useValidateSeq"/>

<<< @/../src/types/common-types.ts#use-validate-options

## Examples

<details>
<summary class="select-none cursor-pointer">Used component code</summary>

<<< @/../examples/src/components/use-validate-seq/ExampleEnUseValidateSeq.vue#example-en-use-validate-seq {47-55vue}

</details>

### Synchronous and asynchronous field validation via `validate` function call

In this example, the `rules` array contains two rules:

- a synchronous one: checks that the field is not empty;
- an asynchronous one: simulates a 2-second server request.

The asynchronous rule returns an error if the field value equals `'admin'`.

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
    message: 'Validation server request timeout exceeded'
}
```

This value limits the asynchronous validation time to `1` second and defines the returned message. Since the simulated asynchronous rule takes `2` seconds to complete, the validation will time out after `1` second.

<ExampleContainer #default="{ modelValue, updateModelValue }" v-model="exampleModel2">
<ExampleEnUseValidateSeq
label="Login"
:model-value="modelValue"
placeholder="Required field"
:timeout="{ ms: 1000, message: 'Validation server request timeout exceeded' }"
@update:model-value="updateModelValue"
/>
</ExampleContainer>
