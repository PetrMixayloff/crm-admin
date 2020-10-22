import request from '@/utils/request'
import { AppModule } from '@/store/modules/app'

export const getDbSchema = () => {
  return request({
    url: '/meta',
    method: 'get'
  }).then(resp => {
    AppModule.SetDbSchema(resp.data)
  })
}
