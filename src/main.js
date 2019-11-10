import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入全局样式文件
import '@/assets/css/global.css'
// 引入组件库模块
import ElementUI from 'element-ui'
// 引入axios
import axios from 'axios'
// 配置后端服务器接口公共跟地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
Vue.prototype.$http = axios

// 注册
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
