import axios, { AxiosRequestHeaders, AxiosResponse } from 'axios'
// import { useRouter } from 'vue-router'
import { createDiscreteApi } from 'naive-ui'
import status from './status'
import { BASE_URL } from '../config'
import { toCamelCase } from '../utils'

const { message } = createDiscreteApi(
  ['message'],
)

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 3600 * 1000,
  // withCredentials: true
})

// 添加请求拦截器
http.interceptors.request.use(config => {
  // 在发送请求之前做些什么
  const token = localStorage.getItem('token')
  
  if (token) {
    config.headers = {
      ...config.headers,
      token: token
    } as unknown as AxiosRequestHeaders
  }

  return config
}, (err: any) => {
  console.log(err)
  // 对请求错误做些什么
  Promise.reject(err)
})

http.interceptors.response.use(res => {
  // 对响应数据做点什么
  if (res.status === 200 || res.status === 201 && res.data.code === 200) {
    return toCamelCase(res.data)
  } else {
    message.warning(res.data.message)
    return Promise.reject(res.data)
  }
}, err => {
  console.log(err)
  if (err.response) {
    if (err.response.status === 401) {
      localStorage.removeItem('userInfo')
      localStorage.removeItem('token')
      location.href = '/login'

    } else {
      if (status.has(err.response.code)) {

      } else {
        message.warning(err.response.message)
      }
    }
  } else {
    console.log('-------')
    return Promise.reject(err.response)
  }
})

export default http
