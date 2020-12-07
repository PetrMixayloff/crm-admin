import request from '@/utils/request'

export const getClients = (params: any) =>
  request({
    url: '/clients',
    method: 'get',
    params
  })

export const getClientInfo = () =>
  request({
    url: '/client',
    method: 'get'
  })

export const getClientByName = (clientname: string) =>
  request({
    url: `/clients/${clientname}`,
    method: 'get'
  })

export const updateClient = (clientname: string, data: any) =>
  request({
    url: `/clients/${clientname}`,
    method: 'put',
    data
  })

export const deleteClient = (clientname: string) =>
  request({
    url: `/clients/${clientname}`,
    method: 'delete'
  })
