import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import router from '@/router'
import { getToken, removeToken } from '@/utils/token'
const http = axios.create({
  baseURL: '/admin',
  timeout: 3000
})

http.interceptors.request.use(
  config => {
    config.headers['token'] = getToken()
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
/**
 * 错误处理的几种情况：
 * 1. http状态码错误
 * 2. 返回值状态码错误
 * 2.1 身份错误
 * 2.2 其他错误
 */
http.interceptors.response.use(
  response => {
    if (response.status !== 200) {
      return Promise.reject(response)
    }
    // 处理状态码
    const data = response.data
    if (data.code === 10000) {
      // setToken(cookies)
      return data
    }
    // 1006为用户未登录
    if (data.code === 10006) {
      MessageBox.alert('登录状态异常，请重新登录', '确认登录信息', {
        confirmButtonText: '重新登录',
        type: 'warning',
        callback: () => {
          removeToken()
          router.replace({ name: 'login' })
        }
      })
      return Promise.reject(new Error(data))
    }
    // 其他错误码，提示信息并返回信息
    Message({
      message: data,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(new Error(data))
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default http
