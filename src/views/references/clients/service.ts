import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store'
import base_ds from '@/services/base_datasource_service'
import {UserModule} from '@/store/modules/user'

export const route_ns = 'clients'
export const table_name = 'public.client'

export class Client {
  id: string | null = null
  shop_id = UserModule.shopId
  name: string | null = null
  phone: string | null = null
  address: string | null = null
  discount: string | null = null
  comment: string | null = null
  orders: Array<Orders> = []
}
export class Orders {
  id: string | null = null
  shop_id = UserModule.shopId
  total_cost: string | null = null
  prepay: string | null = null
  prepay_type: string | null = null
  amount: string | null = null
  amount_type: string | null = null
  discount: string | null = null
  rating: string | null = null
  status: string | null = null
  date_created: string | null = null
  date_of_order: string | null = null
}

@Module({ dynamic: true, store, name: 'clients', namespaced: true })
class ClientService extends VuexModule {
  public currentRow = new Client();
  public dataSource = base_ds.getBaseDataSource(route_ns);
  public crud = base_ds.getBaseCrud(route_ns);

  @Mutation
  private SET_CURRENT(value: Client) {
    this.currentRow = { ...value }
  }

  @Action
  public SetCurrentRow(value: Client) {
    this.SET_CURRENT(value)
  }

  @Mutation
  private RESET_CURRENT() {
    this.currentRow = new Client()
  }

  @Action
  public ResetCurrentRow() {
    this.RESET_CURRENT()
  }
}

export const Clients = getModule(ClientService)
