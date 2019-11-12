import Vue from 'vue'
// 引入axios
import axios from 'axios'
// 配置后端服务器接口公共跟地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
Vue.prototype.$http = axios

// 配置请求拦截器
axios.interceptors.request.use(function (config) {
  var userinfo = window.sessionStorage.getItem('userinfo')
  if (userinfo) {
    let token = JSON.parse(userinfo).token
    // 给axios请求配置token
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
}, function (error) {
  return Promise.reject(error)
})
Vue.prototype.$http = axios
