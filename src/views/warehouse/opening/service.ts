import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store'
import base_ds from '@/services/base_datasource_service'
import { UserModule } from '@/store/modules/user'

export const route_ns = 'opening'

export class Opening {
  id: string | null = null
  shop_id: string = UserModule.shopId
  number: number | null = null
  date: Date = new Date()
  remark: string | null = null
  raw_remains_details_id: string | null = null
  raw_id: string | null = null
}


@Module({ dynamic: true, store, name: 'opening', namespaced: true })
class OpeningService extends VuexModule {
  public editVisible = false
  public currentRow = new Opening()

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
  private SET_CURRENT_INVOICE(value: Opening) {
    this.currentRow = { ...value }
  }

  @Action
  public SetCurrentInvoice(value: Opening) {
    this.SET_CURRENT_INVOICE(value)
  }

  @Mutation
  private RESET_CURRENT_INVOICE() {
    this.currentRow= new Opening()
  }

  @Action
  public ResetCurrentInvoice() {
    this.RESET_CURRENT_INVOICE()
  }
}

export const OpeningModule = getModule(OpeningService)
