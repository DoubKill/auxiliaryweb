import axios from 'axios'
import {
  Message
} from 'element-ui'
import store from '@/store'
import {
  getToken
} from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: '/api', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000000000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // if (config.method === 'get') {
    // let urlTest = config.url
    // console.log(urlTest.match(/\{[\S\s]+\}/g)[0], '11111111111')
    // let params_ = urlTest.match(/\{[\S\s]+\}/g)[0]
    // let result = params_.substring(1, params_.length - 1)
    // }
    if (store.getters.token) {
      config.headers['Authorization'] = 'JWT ' + getToken()
    }
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
    const res = response.data
    return Promise.resolve(res)
  },
  error => {
    console.log(error.response.data)
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
      //       0: {}
      // 1:
      // non_field_errors: ["当天该机台已有相同的胶料计划数据，请修改后重试!"]
      // __proto__: Object
      // 2:
      // non_field_errors: ["当天该机台已有相同的胶料计划数据，请修改后重试!"]
      // __proto__: Object
      // length: 3
      // __proto__: Array(0)

      // let str = error.response.data.join(',')
      // if (error.response.data[0] && error.response.data[0].non_field_errors) {
      //   str = error.response.data[0].non_field_errors.join(',')
      // }

      let str = ''
      let row = 0
      error.response.data.forEach(errorData => {
        if (errorData && errorData.non_field_errors) {
          str += (`${row++} : ${errorData.non_field_errors.join(',')}\n`)
        }
      })
      Message({
        message: str,
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(error.response.data)
    } else {
      Message({
        message: error.message,
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject()
    }
  }
)

export default service
