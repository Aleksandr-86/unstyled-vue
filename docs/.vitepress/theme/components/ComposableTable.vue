<script setup lang="ts">
import { useData } from 'vitepress'
import { computed, Ref } from 'vue'

import BaseTable from '../../../../src/components/base-table/BaseTable.vue'
import type { TableCol } from '../../../../src/components/base-table/index'
import type { ComposableData, ComposableParameter, LocalizedString } from '../../../types'
import type { InterfaceItem, PropertyData } from '../../../types.ts'
import { codeString } from './utils.ts'

interface ComposableTableProps {
  composable?: ComposableData
  interfaces?: InterfaceItem[]
  returnValues?: InterfaceItem
}

const { composable, interfaces, returnValues } = defineProps<ComposableTableProps>()

const { lang } = useData() as unknown as { lang: Ref<'en' | 'ru'> }

const composableHeaders = computed(() =>
  lang.value === 'ru' ? ['Параметр', 'Описание и тип'] : ['Parameter', 'Description and Type'],
)

const interfaceHeaders = computed(() =>
  lang.value === 'ru' ? ['Свойство', 'Описание и тип'] : ['Property', 'Description and Type'],
)

const returnValuesHeaders = computed(() =>
  lang.value === 'ru' ? ['Значение', 'Описание и тип'] : ['Value', 'Description and Type'],
)

const composableCols: TableCol<ComposableParameter>[] = [
  { key: 'name', width: '14rem' },
  { key: 'description', minWidth: '14rem' },
]

const propertyCols: TableCol<PropertyData>[] = [
  { key: 'name', width: '14rem' },
  { key: 'description', minWidth: '14rem' },
]

function transformDescription(description: LocalizedString) {
  if (!description) {
    return description
  }

  if (lang.value === 'en') {
    return description.en.replace(/^\(|\)$/g, '')
  }

  return description.ru
}
</script>

<template>
  <template v-if="composable">
    <h3 class="my-0!">{{ composable.description }}</h3>

    <div class="flex flex-col gap-2">
      <h6 class="my-0!">{{ lang === 'ru' ? 'Параметры' : 'Parameters' }}</h6>

      <BaseTable
        :classes="{
          root: 'props-table overflow-x-auto',
        }"
        :cols="composableCols"
        :headers="composableHeaders"
        :rows="composable.parameters"
      >
        <template #description="{ row }">
          <div>
            <div>{{ row.description.replace(/\.$/, '') }}</div>
            <div class="text-code">{{ row.type }}</div>
          </div>
        </template>
      </BaseTable>
    </div>
  </template>

  <template v-if="interfaces">
    <template v-for="iface in interfaces" :key="iface.interfaceName">
      <div class="flex flex-col gap-2">
        <div class="text-code">{{ iface.interfaceName }}</div>

        <BaseTable
          :classes="{
            root: 'props-table overflow-x-auto',
          }"
          :cols="propertyCols"
          :headers="interfaceHeaders"
          :rows="iface.properties"
        >
          <template #description="{ row }">
            <div>
              <div>{{ transformDescription(row.description) }}</div>
              <div v-if="row.type.startsWith('{')" class="text-code">
                <pre class="my-font">{{ codeString(row.type) }}</pre>
              </div>
              <div v-else class="text-code">{{ row.type }}</div>
            </div>
          </template>
        </BaseTable>
      </div>
    </template>
  </template>

  <template v-if="returnValues">
    <div class="flex flex-col gap-2">
      <h6 class="my-0!">{{ lang === 'ru' ? 'Возвращаемые значения' : 'Returned values' }}</h6>

      <BaseTable
        :classes="{
          root: 'props-table overflow-x-auto',
        }"
        :cols="propertyCols"
        :headers="returnValuesHeaders"
        :rows="returnValues.properties"
      >
        <template #description="{ row }">
          <div>
            <div>{{ transformDescription(row.description) }}</div>
            <div class="text-code">{{ row.type }}</div>
          </div>
        </template>
      </BaseTable>
    </div>
  </template>
</template>

<style scoped>
/* Данный класс необходим чтобы перебить определяемые VitePress классы для элементы table */
.props-table :deep(table) {
  display: table !important;
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
}

.type-color {
  color: var(--vp-c-brand-1);
}

.highlighted-text {
  color: var(--highlighted-text);
}
</style>
