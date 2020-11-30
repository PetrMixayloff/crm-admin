import DataSource from 'devextreme/data/data_source'
import CustomStore from 'devextreme/data/custom_store'
import * as _ from 'lodash'
import request from '@/utils/request'
import { AppModule } from '@/store/modules/app'

const EXCLUDED_COLUMNS: string[] = ['date_created',
  'date_modified', 'deleted', 'created_by_id', 'modified_by_id'
]

export default {

  getExcludedColumns(): string[] {
    return EXCLUDED_COLUMNS
  },

  prepareGridColumns(schema_table: string, included: string[] = []): any {
    const columns: any[] = []
    const empty_entity: any = {}

    // @ts-ignore
    const schema: any[] = AppModule.db_schema[schema_table]

    if (schema) {
      included.forEach((field: any) => {
        const item = schema.filter((item) => {
          return item.name === field
        })[0]

        empty_entity[item.name] = null
        if (item.type === 'boolean') empty_entity[item.name] = false

        const obj: any = {
          dataField: item.name,
          caption: item.comment
        }

        if (item.name === 'id') {
          obj.visible = false
        }
        if (item.name === 'category_id' && schema_table === 'public.raw') {
          obj.dataType = 'string'
          obj.caption = 'Категория'
          obj.visible = false
        }
        if (item.name === 'image') {
          obj.allowFiltering = false
          obj.width = '15%'
        } else if (item.type === 'number') {
          obj.dataType = 'number'
          obj.filterOperations = ['=']
        } else if (item.type === 'boolean') {
          obj.dataType = 'boolean'
          obj.filterOperations = ['=']
        } else if (item.type === 'date') {
          obj.dataType = 'datetime'
          obj.filterOperations = ['=', '>', '<']
        } else {
          obj.dataType = 'string'
          obj.filterOperations = ['contains']
        }
        columns.push(obj)
      })
    }
    return [columns, empty_entity]
  }
}
