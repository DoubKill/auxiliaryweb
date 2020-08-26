import request from '@/utils/request'
import API from '@/api/url'

export function weighCb(method, data = {}) {
    let obj = {
        url: API.WeighCbUrl,
        method: method
    }
    Object.assign(obj, data)
    return request(obj)
}

export function weighOil(method, data = {}) {
    let obj = {
        url: API.WeighOilUrl,
        method: method
    }
    Object.assign(obj, data)
    return request(obj)
}


export function materials(method, data = {}) {
    let obj = {
        url: API.MaterialsUrl,
        method: method
    }
    Object.assign(obj, data)
    return request(obj)
}

export function equip(method, data = { params: { all: 1 } }) {
    let obj = {
        url: API.EquipUrl,
        method: method
    }
    Object.assign(obj, data)
    return request(obj)
}