import axios from 'axios'
import router from '../router'

import {
  Message
} from 'element-ui'
import store from '@/store'
import {
  getToken
} from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/' : '/api', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000000000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (getToken()) {
      config.headers['Authorization'] = 'JWT ' + getToken()
    }
    config.headers['Accept'] = 'application/json; version=' + store.getters.editionNo
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    if (response.status < 300) {
      const res = response.data
      return Promise.resolve(res)
    } else {
      Message({
        message: '请求失败' + response.status,
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(response)
    }
  },
  error => {
    if (error.response.status && (error.response.status === 403 ||
        error.response.status === 401)) {
      Message({
        message: '身份信息已过期',
        type: 'error',
        duration: 3 * 1000
      })
      store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject()
    }
    if (Object.prototype.toString.call(error.response.data) === '[object Object]') {
      const obj = error.response.data
      let str = ''
      for (const key in obj) {
        if (!(obj[key] instanceof Array)) {
          str += obj[key]
        } else {
          obj[key].forEach(element => {
            str += element + ';'
          })
        }
      }
      Message({
        message: str,
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(error.response.data)
    } else if (Object.prototype.toString.call(error.response.data) === '[object Array]') {
      let str = ''
      error.response.data.forEach(errorData => {
        let obj = null
        if (errorData) {
          try {
            obj = JSON.parse(errorData)
          } catch (e) {
            obj = errorData
          }
        }
        if (errorData && Object.prototype.hasOwnProperty.call(obj, 'non_field_errors')) {
          str += (`${obj.non_field_errors.join(',')}\n`)
        } else {
          str += errorData
        }
      })
      Message({
        message: str,
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(error.response.data)
    } else {
      let errorStr = error.message
      if (error.response.status === 400) {
        errorStr = error.response.data
      }
      Message({
        message: errorStr,
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject()
    }
  }
)

export default service
