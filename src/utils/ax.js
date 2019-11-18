// 引入Vue
import Vue from 'vue'

// 引入axios
import axios from 'axios'

// 引入路由
import router from '@/router'

// 引入json-bigint
import JSONbig from 'json-bigint'

// 配置后端服务器接口公共跟地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'

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

// 配置响应拦截器  删token进行测试
axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error.response.status === 401) {
    // 强制登录
    router.push({ name: '/login' })
  }
  return Promise.reject(error)
})

// 对服务器端返回来的数据信息做处理(尤其是大数字的处理)
// axios配置"数据转换器"
axios.defaults.transformResponse = [function (data) {
  if (data) {
    return JSONbig.parse(data)
  } else {
    return data
  }
}]

Vue.prototype.$http = axios
