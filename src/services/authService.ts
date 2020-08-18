import request from '@/utils/request'

export default {
  login(data: any) {
    return request({
      url: '/login',
      method: 'POST',
      data
    })
  },
  async logout() {
    await request({
      url: '/logout',
      method: 'POST'
    })
  }
}
