<script setup lang="ts">
import { ref } from 'vue'

import BaseCheckbox from '../../../src/components/base-checkbox/BaseCheckbox.vue'

const model = ref<string[]>([])
</script>

<template>
  <div>
    <div>model: {{ model }}</div>
    <BaseCheckbox v-model="model" data-testid="apple" value="apple" />
    <BaseCheckbox v-model="model" data-testid="banana" value="banana" />
  </div>
</template>
