<script setup lang="ts">
import { onMounted, ref } from 'vue'

import VirtualScroll from '@/components/virtual-scroll/VirtualScroll.vue'

const items = ref<{ id: number; title: string }[]>([])

const loremText =
  'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit animi id est laborum'
// const loremText =
// 'невероятный восхитительный оптимальный монолитный колоссальный прозрачный глянцевый бархатный безупречный грандиозный лаконичный монументальный динамичный контрастный масштабный изящный феноменальный тривиальный абстрактный лазурный элегантный светлый'

// 2. Создаем массив уникальных слов (очищаем от возможных дублей для разнообразия)
const words = [...new Set(loremText.split(' '))]
const wordsCount = words.length

function generateTitle() {
  const phraseLength = Math.floor(Math.random() * 2) + 3 // Выдаст 3 или 4
  const selectedWords = []

  for (let i = 0; i < phraseLength; i++) {
    const randomIndex = Math.floor(Math.random() * wordsCount)
    selectedWords.push(words[randomIndex])
  }

  const phrase = selectedWords.join(' ')
  return phrase.charAt(0).toUpperCase() + phrase.slice(1)
}

onMounted(() => {
  Array.from({ length: 100000 }, (_, i) => {
    items.value.push({
      id: i,
      title: generateTitle(),
    })
  })
})
</script>

<template>
  <h3>Главная страница</h3>

  <VirtualScroll class="bg-red-800/40" :item-height="20" :items>
    <template #default="{ item, index }">
      <div class="my-custom-row">id: {{ index }}, title: {{ item.title }}</div>
    </template>
  </VirtualScroll>
</template>
