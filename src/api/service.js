import request from '@/utils/request'

export function serviceList(params) {
  return request({
    url: '/service/service_list',
    method: 'get',
    params
  })
}

export function serviceDelete(params) {
  return request({
    url: '/service/service_delete',
    method: 'get',
    params
  })
}

export function serviceAddHttp(data) {
  return request({
    url: '/service/service_add_http',
    method: 'post',
    data
  })
}

export function serviceUpdateHttp(data) {
  return request({
    url: '/service/service_update_http',
    method: 'post',
    data
  })
}

export function serviceDetail(params) {
  return request({
    url: '/service/service_detail',
    method: 'get',
    params
  })
}

export function serviceAddTcp(data) {
  return request({
    url: '/service/service_add_tcp',
    method: 'post',
    data
  })
}

export function serviceUpdateTcp(data) {
  return request({
    url: '/service/service_update_tcp',
    method: 'post',
    data
  })
}

