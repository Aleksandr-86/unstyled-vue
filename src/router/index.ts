import { createRouter, createWebHistory } from 'vue-router'

import FieldPage from '../views/FieldPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/input',
      name: 'input',
      component: FieldPage,
    },
    {
      path: '/field',
      name: 'field',
      component: () => import('../views/InputPage.vue'),
    },
  ],
})

export default router
