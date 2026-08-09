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

If the validated form contains errors, the first field from the top can receive focus upon completion of the validation process. For this focusing to be possible, the unique identifier `uid` returned by the `useValidateSeq` function should be passed to the `id` attribute of the validated field. <br />
Clearing the form fields via the `clearForm` function is executed by calling the `onResetValue` field cleanup functions from the `options` parameter of the `useValidateSeq` composable. The logic for clearing field values is defined by the user for each individual field. The `clearForm` function merely initiates the execution of these field cleanup functions.
