import request from '@/utils/request'
import API from '@/api/url'

export function equip(method, data = { params: { all: 1 }}) {
  const obj = {
    url: API.EquipUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function palletFeedBacks(method, data = {}) {
  const obj = {
    url: API.PalletFeedBackUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function delPalletFeedBacks(id) {
  return request({
    url: API.PalletFeedBackUrl + id + '/',
    method: 'DELETE'
  })
}

export function issuedPlan(params) {
  return request({
    url: API.IssuedPlanUrl,
    method: 'get',
    params
  })
}

export function stopPlan(params) {
  return request({
    url: API.StopPlanUrl,
    method: 'get',
    params
  })
}

export function retransmissionpPlan(params) {
  return request({
    url: API.RetransmissionpPlanUrl,
    method: 'get',
    params
  })
}

export function upRegulation(data, id) {
  return request({
    url: API.UpRegulationUrl + id + '/',
    method: 'put',
    data
  })
}

export function downRegulation(data, id) {
  return request({
    url: API.DownRegulationUrl + id + '/',
    method: 'put',
    data
  })
}

export function updateTrains(data, id) {
  return request({
    url: API.UpdateTrainsUrl + id + '/',
    method: 'put',
    data
  })
}

export function productDayPlanManycreate(method, data = {}) {
  const obj = {
    url: API.ProductDayPlanManycreateUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function productbatching(method, data = {}) {
  const obj = {
    url: API.ProductbatchingUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function globalCodes(method, data = {}) {
  const obj = {
    url: API.GlobalCodesUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function getRubberMateria(params) {
  return request({
    url: API.RubberMaterialUrl,
    method: 'get',
    params
  })
}

export function getWorkSchedules(params) {
  return request({
    url: API.WorkSchedulesUrl,
    method: 'get',
    params
  })
}

export function getPlanSchedules(params) {
  return request({
    url: API.PlanScheduleUrl,
    method: 'get',
    params
  })
}

export function postProductDayPlanManyCreate(data) {
  return request({
    url: API.ProductDayPlanManyCreateUrl,
    method: 'post',
    data
  })
}

