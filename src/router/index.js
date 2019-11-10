import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // @别名：代表src目录的绝对路径名地址
  { path: '/login', name: 'login', component: () => import('@/views/login') },
  { path: '/home', name: 'home', component: () => import('@/views/home') }
]

const router = new VueRouter({
  // mode: 'history',
  routes
})

export default router
