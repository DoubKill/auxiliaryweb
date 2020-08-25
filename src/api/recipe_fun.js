import request from '@/utils/request'
import API from '@/api/url'
import url from '@/api/url'

export function recipe_list(method, id=null, data={}) {
    if(id){
        var v_url = API.RubberMaterialUrl + id + '/'
    }else{
        var v_url = API.RubberMaterialUrl
    }
    let obj = {
        url: v_url,
        method: method
    }
    Object.assign(obj, data)
    return request(obj)
    
    }

export function rubber_process_url(method, id=null, data={}) {
    if(id){
        var v_url = API.RubberProcessStepUrl + id + '/'
    }else{
        var v_url = API.RubberProcessStepUrl
    }
    let obj = {
        url: v_url,
        method: method
    }
    Object.assign(obj, data)
    return request(obj)
}


export function equip_url(method, data={}) {
    let obj = {
        url: API.EquipUrl,
        method: method
    }
    Object.assign(obj, data)
    return request(obj)
}


export function site_url(method, data={}) {
    let obj = {
        url: API.SiteUrl,
        method: method
    }
    Object.assign(obj, data)
    return request(obj)
}


export function recipe_no_url(method, data={}) {
    let obj = {
        url: API.RecipeNoUrl,
        method: method
    }
    Object.assign(obj, data)
    return request(obj)
}


export function stage_url(method, data={}) {
    let obj = {
        url: API.StageUrl,
        method: method
    }
    Object.assign(obj, data)
    return request(obj)
}


export function dev_type_url(method, data={}) {
    let obj = {
        url: API.DevTypeUrl,
        method: method
    }
    Object.assign(obj, data)
    return request(obj)
}

export function global_SITE_url(method, data={}) {
    let obj = {
        url: API.GlobalSITEUrl,
        method: method
    }
    Object.assign(obj, data)
    return request(obj)
}


// 原材料接口
export function raw_material_url(method, id=null, data={}) {
    if(id){
        var v_url = API.MaterialsUrl + id + '/'
    }else{
        var v_url = API.MaterialsUrl
    }

    let obj = {
        url: v_url,
        method: method
    }
    Object.assign(obj, data)
    return request(obj)
    
    }
// 原材料类别接口
export function material_type_url(method, data={}) {
    let obj = {
        url: API.MaterialTypelUrl,
        method: method
    }
    Object.assign(obj, data)
    return request(obj)
}
// 状态接口函数
export function condition_url(method, data={}) {
        let obj = {
            url: API.ConditionUrl,
            method: method
        }
        Object.assign(obj, data)
        return request(obj)
    }
// 动作接口函数
export function action_url(method, data={}) {
        let obj = {
            url: API.ActionUrl,
            method: method
        }
        Object.assign(obj, data)
        return request(obj)
    }

