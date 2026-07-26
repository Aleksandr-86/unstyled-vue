# Composables

::: danger
Candidate for deletion
:::

<script setup>
import { data } from '../../composables.data.ts'
</script>

<ComposableTable :data="data.useCheckbox"/>

<<< @/../src/composables/useCheckbox.ts#use-checkbox-composable{ts}
