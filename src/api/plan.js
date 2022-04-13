import request from '@/utils/request'
import API from '@/api/url'

export function equip(method, data = { params: { all: 1, category_name: '密炼设备' }}) {
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

export function issuedPlan(data) {
  return request({
    url: API.IssuedPlanUrl,
    method: 'post',
    data
  })
}

export function stopPlan(params) {
  return request({
    url: API.StopPlanUrl,
    method: 'get',
    params
  })
}

export function retransmissionpPlan(data) {
  return request({
    url: API.IssuedPlanUrl,
    method: 'put',
    data
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

export function getPlanSchedule(id) {
  return request({
    url: API.PlanScheduleUrl + id + '/',
    method: 'get'
  })
}

export function postProductDayPlanManyCreate(data) {
  return request({
    url: API.ProductDayPlanManyCreateUrl,
    method: 'post',
    data
  })
}

export function getPlanStatusList(params) {
  return request({
    url: API.PlanStatusListUrl,
    method: 'get',
    params
  })
}

export function productClassesPlan(method, data = {}) {
  const obj = {
    url: API.ProductClassesPlanUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function productClassesPlanPanycreateUrl(method, data = {}) {
  const obj = {
    url: API.ProductClassesPlanPanycreateUrl,
    method: method
  }
  Object.assign(obj, data)
  return request(obj)
}

export function hfRecipeList(params) {
  return request({
    url: API.HfRecipeList,
    method: 'get',
    params
  })
}
export function schedulingResult(params) {
  return request({
    url: API.SchedulingResult,
    method: 'get',
    params
  })
}
export function schedulingResultPost(data) {
  return request({
    url: API.SchedulingResult,
    method: 'post',
    data
  })
}

export function productTechParams(params) {
  return request({
    url: API.ProductTechParams,
    method: 'get',
    params
  })
}

export function currentFactoryDate(params) {
  return request({
    url: API.CurrentFactoryDate,
    method: 'get',
    params
  })
}

export function manualInputTrains(params) {
  return request({
    url: API.ManualInputTrains,
    method: 'get',
    params
  })
}
export function manualInputTrainsPost(type, data) {
  return request({
    url: API.ManualInputTrains,
    method: type,
    data
  })
}

