import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/input',
      name: 'input',
      component: () => import('@/views/InputPage.vue'),
    },
    {
      path: '/field',
      name: 'field',
      component: () => import('@/views/FieldPage.vue'),
    },
  ],
})

export default router
