import DataSource from 'devextreme/data/data_source'
import CustomStore from 'devextreme/data/custom_store'
import * as _ from 'lodash'
import request from '@/utils/request'
import {UserModule} from '@/store/modules/user'

class CrudOperates {
  public url: string;

  constructor(route_url: string) {
    this.url = route_url
  }

  public async get(entity_id: number | string | null) {
    if (_.isNil(entity_id)) return

    return request({
      url: `${this.url}/${entity_id}`,
      method: 'get'
    })
  }

  public async load() {
    return request({
      url: `${this.url}/`,
      method: 'get'
    })
  }

  public async save(entity: any) {
    console.log(entity)
    if (_.isNil(entity.id)) {
      return request({
        url: `${this.url}/`,
        method: 'post',
        data: entity
      })
    } else {
      return request({
        url: `${this.url}/${entity.id}`,
        method: 'put',
        data: entity
      })
    }
  }

  public async delete(entity_id: number | string | null) {
    if (_.isNil(entity_id)) return

    return request({
      url: `${this.url}/${entity_id}`,
      method: 'delete'
    })
  }
}

export default {
  getBaseDataSource(api_route: string) {
    return new DataSource({
      store: new CustomStore({
        key: 'id',
        loadMode: 'raw',
        async byKey(key) {
          const resp = await request({
            url: `${api_route}/${key}`,
            method: 'get'
          })

          return resp
        },
        async insert(values) {
          console.log(values)
          const resp = await request({
            url: `${api_route}`,
            data: values,
            method: 'post'
          })

          if (resp && resp.data) {
            //
          } else {
            //
          }

          return resp
        },
        async update(key, values) {
          const resp = await request({
            url: `${api_route}/${key}`,
            data: values,
            method: 'put'
          })

          return resp
        },
        async load(loadOptions: any) {
          let params = '?';

          [
            'skip',
            'take',
            'sort',
            'filter'
          ].forEach((i) => {
            if (i in loadOptions && !_.isNil(loadOptions[i]) && loadOptions[i] !== '' && loadOptions[i] !== ['raw_id', 'not_in', []]) {
              params += `${i}=${JSON.stringify(loadOptions[i])}&`
            }
          })
          params = params.slice(0, -1)

          const resp = await request({
            url: `${api_route}/${params}`,
            method: 'get'
          })

          if (resp && resp.data) {
            //
          } else {
            //
          }

          return resp.data
        }
      })
    })
  },

  getBaseCrud(api_route: string) {
    return new CrudOperates(api_route)
  }
}
