import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store'
import base_ds from '@/services/base_datasource_service'
import { UserModule } from '@/store/modules/user'
import _ from 'lodash'

export const route_ns = 'invoice'

export const table_name = 'public.invoice'

export interface IInvoiceRecord {
  invoice_id: string,
  invoice: Array<Invoice>
  category_id: string,
  raw_id: string,
  price: number,
  quantity: number,
  total: number
}

export class Invoice {
  id: string | null = null
  number: string | null = null
  date: Date = new Date()
  remark: string | null = null
  payment_method: string | null = null
  records: Array<IInvoiceRecord> = []
}

@Module({ dynamic: true, store, name: 'invoice', namespaced: true })
class InvoiceService extends VuexModule {
  public invoiceEditVisible = false
  public editMode = false
  public currentInvoice = new Invoice()

  public dataSource = base_ds.getBaseDataSource(route_ns)
  public crud = base_ds.getBaseCrud(route_ns)

  @Mutation
  private SET_INVOICE_EDIT_VISIBLE(value: boolean) {
    this.invoiceEditVisible = value
  }

  @Action
  public SetInvoiceEditVisible(value: boolean) {
    this.SET_INVOICE_EDIT_VISIBLE(value)
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
