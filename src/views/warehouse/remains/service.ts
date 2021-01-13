import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store'
import base_ds from '@/services/base_datasource_service'
import { UserModule } from '@/store/modules/user'


export const route_ns = 'remains'

export const table_name = 'public.remains'


export class Remains {
  id: string | null = null
  shop_id: string = UserModule.shopId
  raw_id: string | null = null
  invoice_id: string | null = null
  price: number = 0
  quantity: number = 0
}


@Module({ dynamic: true, store, name: 'remains', namespaced: true })
class RemainsService extends VuexModule {
  public editVisible = false
  public editMode = false
  public currentRemains = new Remains()

  public dataSource = base_ds.getBaseDataSource(route_ns)
  public crud = base_ds.getBaseCrud(route_ns)

  @Mutation
  private SET_EDIT_VISIBLE(value: boolean) {
    this.editVisible = value
  }

  @Action
  public SetEditVisible(value: boolean) {
    this.SET_EDIT_VISIBLE(value)
  }

  @Mutation
  private SET_CURRENT_REMAINS(value: Remains) {
    this.currentRemains = { ...value }
  }

  @Action
  public SetCurrentRemains(value: Remains) {
    this.SET_CURRENT_REMAINS(value)
  }

  @Mutation
  private RESET_CURRENT_REMAINS() {
    this.currentRemains = new Remains()
  }

  @Action
  public ResetCurrentRemains() {
    this.RESET_CURRENT_REMAINS()
  }

  @Action
  public SetEditMode(value: boolean) {
    this.SET_EDIT_MODE(value)
  }

  @Mutation
  private SET_EDIT_MODE(value: boolean) {
    this.editMode = value
  }
}

export const RemainsModule = getModule(RemainsService)
