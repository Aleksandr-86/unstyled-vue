<script setup lang="ts">
import { useData } from 'vitepress'
import { computed, type Ref } from 'vue'

import type { TableCol } from '@/index'

const { lang } = useData() as unknown as { lang: Ref<'en' | 'ru'> }

const headers = computed(() =>
  lang.value === 'ru' ? ['Инструмент', 'Тип', 'Звучание'] : ['Instrument', 'Type', 'Sound'],
)

type Row = {
  instrument: string
  type: string
  sound: string
}

const rows = computed((): Row[] => {
  return lang.value === 'ru'
    ? [
        { instrument: 'Гитара', type: 'Струнный щипковый', sound: 'Тёплый, универсальный тембр' },
        {
          instrument: 'Фортепиано',
          type: 'Клавишно‑ударный',
          sound: 'Широкий диапазон, сочетает мелодичность и мощь аккордов',
        },
        {
          instrument: 'Харди‑гарди (колёсная лира)',
          type: 'Струнный фрикционный',
          sound: 'Гудящий, монотонный, «средневековый» звук',
        },
        {
          instrument: 'Дульцимер',
          type: 'Струнный щипковый/ударный',
          sound: 'Мягкий, звенящий, слегка «хрустальный» тембр',
        },
      ]
    : [
        { instrument: 'Guitar', type: 'Plucked string instrument', sound: 'Warm, versatile timbre' },
        {
          instrument: 'Piano',
          type: 'Keyboard percussion instrument',
          sound: 'Wide range, combining melodic quality and powerful chords',
        },
        {
          instrument: 'Hurdy-gurdy',
          type: 'Friction string instrument',
          sound: 'Droning, monotonous, "medieval" sound',
        },
        {
          instrument: 'Dulcimer',
          type: 'Plucked/hammered string instrument',
          sound: 'Soft, ringing, slightly "crystalline" timbre',
        },
      ]
})

const COLS: TableCol<(typeof rows.value)[number]>[] = [
  { key: 'instrument', width: '10rem' },
  { key: 'type', width: '14rem' },
  { key: 'sound', minWidth: '12rem' },
]
</script>

<template>
  <!-- #region example-table-template -->
  <BaseTable
    :classes="{
      root: 'border-my-label overflow-x-auto rounded-xl border',
      table: 'text-my-label w-full text-left text-sm',
      header: 'bg-my-label border-b text-xs font-semibold tracking-wider uppercase',
      headerCell: 'text-my-label-inverse px-6 py-3.5 font-semibold',
      body: 'divide-my-label divide-y',
      row: 'hover:bg-my-label hover:text-my-label-inverse transition-colors duration-150',
      cell: 'px-6 py-4 align-middle',
      emptyCell: 'px-6 py-4 text-sm',
    }"
    :cols="COLS"
    :headers
    :rows="rows"
  >
    <!-- #endregion example-table-template -->
    <template #empty>Таблица пуста</template>
  </BaseTable>
</template>
