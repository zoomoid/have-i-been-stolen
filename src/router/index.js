import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import Disclaimer from '../views/Disclaimer.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Main,
  },
  {
    path: '/disclaimer',
    component: Disclaimer,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
