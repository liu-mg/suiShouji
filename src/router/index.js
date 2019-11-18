import Vue from 'vue'
import VueRouter from 'vue-router'

// 引入nprogress相关的js和css文件
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
Vue.use(VueRouter)

const routes = [
  // @别名：代表src目录的绝对路径名地址
  { path: '/login', name: 'login', component: () => import('@/views/login') },
  { path: '/home',
    name: 'home',
    component: () => import('@/views/home'),
    redirect: '/welcome',
    children: [
      // 欢迎页面子路由配置
      { path: '/welcome', name: 'welcome', component: () => import('@/views/welcome') },
      { path: '/fans', name: 'fans', component: () => import('@/views/fans/fans.vue') },
      { path: '/material', name: 'material/', component: () => import('@/views/material/material.vue') },
      { path: '/article', name: 'article', component: () => import('@/views/article') },
      { path: '/articleadd', name: 'articleadd', component: () => import('@/views/articleadd/articleadd.vue') },
      { path: '/articleedit/:aid', name: 'articleedit', component: () => import('@/views/articleedit/articleedit.vue') },
      { path: '/account', name: 'account', component: () => import('@/views/account/account') }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 设置前置路由守卫
router.beforeEach((to, from, next) => {
  var userinfo = window.sessionStorage.getItem('userinfo')
  if (!userinfo && to.path !== '/login') {
    // 路由导航到登录页面
    return next('/login')
  }
  next()
  // 开启进度条
  NProgress.inc()
})
// 设置后置路由
router.afterEach(() => {
  // 关闭进度条
  NProgress.done()
})

export default router
