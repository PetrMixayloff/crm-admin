import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store'
import base_ds from '@/services/base_datasource_service'
import { UserModule } from '@/store/modules/user'
import _ from 'lodash'

export const route_ns = 'invoice'

export const table_name = 'public.invoice'

export class Invoice {
  id: string | null = null
  shop_id: string = UserModule.shopId
  number: string | null = null
  date: Date = new Date()
  remark: string | null = null
  supplier: string | null = null
  payment_method: string | null = null
  records: Array<InvoiceRecord> = []
}

export class InvoiceRecord {
  id: string | null = null
  shop_id: string = UserModule.shopId
  invoice_id: string | null = null
  raw_id: string| null = null
  price: number = 0
  quantity: number = 0
}

@Module({ dynamic: true, store, name: 'invoice', namespaced: true })
class InvoiceService extends VuexModule {
  public editVisible = false
  public editMode = false
  public currentInvoice = new Invoice()

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
  private SET_CURRENT_INVOICE(value: Invoice) {
    this.currentInvoice = { ...value }
  }

  @Action
  public SetCurrentInvoice(value: Invoice) {
    this.SET_CURRENT_INVOICE(value)
  }

  @Mutation
  private RESET_CURRENT_INVOICE() {
    this.currentInvoice = new Invoice()
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

export const InvoiceModule = getModule(InvoiceService)
