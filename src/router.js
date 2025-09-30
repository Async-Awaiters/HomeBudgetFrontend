import { createRouter, createWebHistory } from 'vue-router'

import MainPage from './components/pages/MainPage.vue'
import AccountPage from './components/pages/AccountPage.vue'

const routes = [
  { 
    path: '/',
    name: 'home',
    component: MainPage 
  },
  { 
    path: '/account/:id', 
    name: 'account', 
    component: AccountPage,
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router;