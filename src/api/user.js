import request from '@/utils/request'
import API from '@/api/url'
// import { data } from 'autoprefixer'

export function login(data) {
  return request({
    url: API.LoginUrl,
    method: 'post',
    data
  })
}

export function ownerPermission(data) {
  return request({
    url: API.OwnerPermissionurl,
    method: 'get',
    data
  })
}
// export function getInfo(token) {
//   return request({
//     url: API.UserInfoUrl,
//     method: 'post',
//     data:{token}
//   })
// }

export function personnelsUrl(method, id, data = {}) {
  const obj = {
    url: id ? API.PersonnelsUrl + id + '/' : API.PersonnelsUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

// 修改密码
export function changePassword(method, data = {}) {
  const obj = {
    url: API.ChangePasswordUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
