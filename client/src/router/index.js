import { createRouter, createWebHistory } from 'vue-router'
import ReviewDSLRTestView from '../views/ReviewDSLRTestView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ReviewDSLRTestView,
    },
  ]
})

export default router
