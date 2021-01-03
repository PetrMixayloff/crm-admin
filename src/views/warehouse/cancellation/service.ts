import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store'
import base_ds from '@/services/base_datasource_service'
import { UserModule } from '@/store/modules/user'


export const route_ns = 'cancellation'

export const table_name = 'public.cancellation'


export class Cancellation {
  id: string | null = null
  shop_id: string = UserModule.shopId
  number: string | null = null
  date: Date = new Date()
  remark: string | null = null
  supplier: string | null = null
  records: Array<CancellationRecord> = []
}

export class CancellationRecord {
  id: string | null = null
  shop_id: string = UserModule.shopId
  cancellation_id: string | null = null
  rawremainsdetail_id: string| null = null
  quantity: number = 0
}

@Module({ dynamic: true, store, name: 'cancellation', namespaced: true })
class CancellationService extends VuexModule {
  public editVisible = false
  public editMode = false
  public currentCancellation = new Cancellation()

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
  private SET_CURRENT_INVOICE(value: Cancellation) {
    this.currentCancellation = { ...value }
  }

  @Action
  public SetCurrentInvoice(value: Cancellation) {
    this.SET_CURRENT_INVOICE(value)
  }

  @Mutation
  private RESET_CURRENT_INVOICE() {
    this.currentCancellation = new Cancellation()
  }

  @Action
  public ResetCurrentInvoice() {
    this.RESET_CURRENT_INVOICE()
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

export const CancellationModule = getModule(CancellationService)
