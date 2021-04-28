import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store'
import base_ds from '@/services/base_datasource_service'
import { UserModule } from '@/store/modules/user'
import { Raw } from "@/views/references/materials/service";


export const route_ns = 'remains'


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
  public showRemainsDetails = false
  public currentRow = new Raw()

  public dataSource = base_ds.getBaseDataSource(route_ns)
  public crud = base_ds.getBaseCrud(route_ns)

  @Mutation
  private SET_SHOW_REMAINS_DETAILS(value: boolean) {
    this.showRemainsDetails = value
  }

  @Action
  public ShowRemainsDetails(value: boolean) {
    this.SET_SHOW_REMAINS_DETAILS(value)
  }

  @Mutation
  private SET_CURRENT_ROW(value: Raw) {
    this.currentRow = { ...value }
  }

  @Action
  public SetCurrentRow(value: Raw) {
    this.SET_CURRENT_ROW(value)
  }

  @Mutation
  private RESET_CURRENT_ROW() {
    this.currentRow = new Raw()
  }

  @Action
  public ResetCurrentRow() {
    this.RESET_CURRENT_ROW()
  }
}

export const RemainsModule = getModule(RemainsService)
