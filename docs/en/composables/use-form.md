# `useForm`

<script setup>
import { data } from '../../types.data.ts'
</script>

<div class="mt-3 flex flex-col gap-y-5">
  <ComposableTable
    :return-values="data.UseFormReturn"
  >
<template #description>
<h3 class="mt-2! mb-0!">Composable function for form field validation</h3>
</template>
</ComposableTable>

</div>

## Example

<details>
<summary class="select-none cursor-pointer">Form component code</summary>

<<< @/../examples/src/composables/use-form/ExampleEnUseForm.vue#example-en-use-form {10vue}

</details>

<details>
<summary class="select-none cursor-pointer">Field component code</summary>

<<< @/../examples/src/composables/use-form/ExampleValidatedInput.vue#example-validated-input {18-21vue}

</details>

<ExampleContainer simple>
    <ExampleEnUseForm />
</ExampleContainer>

## Component architecture notes

::: warning
The `useForm` composable function works in tandem with the `useValidateSeq` composable function.
:::

If the validated form contains errors, the first invalid field from the top can receive focus once the validation process is complete. To enable this behavior, you must pass the unique identifier `uid` returned by the `useValidateSeq` composable function into the `id` attribute of the validated field. <br />
Form fields are cleared during the `clearForm` function call by invoking the `onResetValue` callbacks provided in the `options` parameter of the `useValidateSeq` composable. The logic for clearing field values is user-defined for each individual field. The `clearForm` function merely triggers the execution of these `onResetValue` functions.
