<script setup lang="ts">
import { useData } from 'vitepress'
import { computed, Ref } from 'vue'

import BaseTable from '../../../../src/components/base-table/BaseTable.vue'
import type { TableCol } from '../../../../src/components/base-table/index'
import type { ComposableData, ComposableParameter, ComposableReturnValue } from '../../../types'

const { data } = defineProps<{
  data: ComposableData
}>()

const { lang } = useData() as unknown as { lang: Ref<'en' | 'ru'> }

const paramsHeaders = computed(() =>
  lang.value === 'ru' ? ['Параметр', 'Описание и тип'] : ['Parameter', 'Description and Type'],
)

const returnsHeaders = computed(() =>
  lang.value === 'ru'
    ? ['Возвращаемое значение', 'Описание, параметры и возвращаемое значение']
    : ['Returned value', 'Description, type, and return value'],
)

const paramsCols: TableCol<ComposableParameter>[] = [
  { key: 'name', width: '14rem' },
  { key: 'description', minWidth: '14rem' },
]

const returnsCols: TableCol<ComposableReturnValue>[] = [
  { key: 'name', width: '14rem' },
  { key: 'description', minWidth: '14rem' },
]
</script>

<template>
  <div class="composable-table">
    <div>{{ data.description[lang] }}</div>

    <BaseTable :cols="paramsCols" :headers="paramsHeaders" :rows="data.parameters">
      <template #description="{ row }">
        <div>
          <div>{{ row.description[lang].replace(/\.$/, '') }}</div>
          <div class="text-code">{{ row.type }}</div>
        </div>
      </template>
    </BaseTable>

    <BaseTable :cols="returnsCols" :headers="returnsHeaders" :rows="data.returns">
      <template #description="{ row }">
        <div>
          <div>
            {{ row.description[lang].replace(/\.$/, '')
            }}{{ row.parameters.length > 0 ? (lang === 'ru' ? '. Параметры:' : '. Parameters:') : '' }}
          </div>

          <template v-if="row.parameters.length > 0">
            <div v-for="(param, i) in row.parameters" :key="i">
              <span>{{ param.name }}:</span>
              <span class="text-code">
                {{ ` ${param.type} ` }}
              </span>
              <span>
                {{ `- ${param.description[lang].toLocaleLowerCase()}${i === row.parameters.length - 1 ? '.' : ';'}` }}
              </span>
            </div>
          </template>
          <div class="text-code">{{ row.returnValue }}</div>
        </div>
      </template>
    </BaseTable>
  </div>
</template>

<style scoped>
/* Данный класс необходим чтобы перебить определяемые VitePress классы для элементы table */
.props-table :deep(table) {
  display: table !important;
  width: 100% !important;
}

.type-color {
  color: var(--vp-c-brand-1);
}

.highlighted-text {
  color: var(--highlighted-text);
}
</style>
