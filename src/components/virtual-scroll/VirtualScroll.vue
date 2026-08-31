<script setup lang="ts" generic="T extends Record<string, any> | string | number">
import { computed, ref } from 'vue'

interface VirtualScrollProps<T> {
  /**
   * Высота одного элемента списка в пикселях
   * (Height of a single list item in pixels)
   */
  itemHeight: number
  /**
   * Полный массив элементов для отображения
   * (Full array of items to display)
   */
  items: T[]

  /**
   * Количество элементов за пределами видимости
   * (Number of items rendered outside the viewport)
   */
  buffer?: number
  /**
   * Ключ объекта или функция-генератор уникального ключа
   * (Object key or a generator function of a unique key)
   */
  itemKey?: keyof T | ((item: T, index: number) => string | number)
  /**
   * Количество одновременно видимых строк в окне просмотра
   * (Number of simultaneously visible rows in the viewport)
   */
  visibleCount?: number
}

const {
  buffer = 5,
  itemHeight,
  itemKey = (_, index) => index,
  items,
  visibleCount = 10,
} = defineProps<VirtualScrollProps<T>>()

defineSlots<{
  default?: (props: {
    /**
     * Глобальный индекс элемента в исходном массиве
     * (Global item index in the source array)
     */
    index: number
    /**
     * Данные элемента исходного массива
     * (Item data from the source array)
     */
    item: T
  }) => unknown
}>()

const containerRef = ref<HTMLDivElement | null>(null)
const scrollTop = ref(0)

/** Высота контейнера (окна просмотра) */
const containerHeightPx = computed(() => {
  const count = Math.min(items.length, visibleCount)
  return `${count * itemHeight}px`
})

/** Высота полосы прокрутки (всех элементов) */
const scrollHeightPx = computed(() => `${items.length * itemHeight}px`)

/** Высота элемента */
const itemHeightPx = computed(() => `${itemHeight}px`)

/** Диапазон индексов для отображения */
const displayRange = computed(() => {
  const startIdx = Math.floor(scrollTop.value / itemHeight)

  const bufferedStart = Math.max(0, startIdx - buffer)
  const bufferedEnd = Math.min(items.length, startIdx + visibleCount + buffer)

  return {
    start: bufferedStart,
    end: bufferedEnd,
  }
})

/** Видимый массив элементов */
const visibleItems = computed(() => {
  const { end, start } = displayRange.value
  const sliced = items.slice(start, end)

  return sliced.map((data, localIndex) => ({
    index: start + localIndex,
    data,
  }))
})

/** Величина смещения контейнера (обеспечивает видимость элементов в области просмотра) */
const offsetYPx = computed(() => `translateY(${displayRange.value.start * itemHeight}px)`)

/** Обработка прокрутки */
const handleScroll = (evt: Event) => {
  const target = evt.target as HTMLElement | null
  if (target !== null) {
    scrollTop.value = target.scrollTop
  }
}

/** Стабильный ключ для каждого элемента списка */
const getKey = (item: T, globalIndex: number): string | number => {
  if (typeof itemKey === 'function') {
    return itemKey(item, globalIndex)
  }

  if (item && typeof item === 'object') {
    const record = item as Record<PropertyKey, unknown>

    if (itemKey && itemKey in record) {
      const value = record[itemKey as PropertyKey]
      if (typeof value === 'string' || typeof value === 'number') {
        return value
      }
    }

    if ('id' in record) {
      const idValue = record.id
      if (typeof idValue === 'string' || typeof idValue === 'number') {
        return idValue
      }
    }
  }

  return globalIndex
}
</script>

<template>
  <div ref="containerRef" class="virtual-scroll__container" @scroll.passive="handleScroll">
    <div class="virtual-scroll_height"></div>
    <div class="virtual-scroll__list">
      <div v-for="item in visibleItems" :key="getKey(item.data, item.index)" class="virtual-scroll__list-item">
        <slot :index="item.index" :item="item.data"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.virtual-scroll__container {
  position: relative;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  height: v-bind(containerHeightPx);
}

.virtual-scroll_height {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: -1;
  height: v-bind(scrollHeightPx);
}

.virtual-scroll__list {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  transform: v-bind(offsetYPx);
  will-change: transform;
}

.virtual-scroll__list-item {
  box-sizing: border-box;
  height: v-bind(itemHeightPx);
}
</style>
