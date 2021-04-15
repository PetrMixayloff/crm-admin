import {Action, getModule, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import store from '@/store'
import base_ds from '@/services/base_datasource_service'
import {UserModule} from '@/store/modules/user'

export const route_ns = 'orders'
export const table_name = 'public.orders'

export type PaymentMethod = 'Наличные' | 'Перевод на карту' | 'Эквайринг' | 'Наличными курьеру' | 'Расчетный счет';
export type OrderStatus = 'Новый' | 'Подготовлен' | 'На доставке' | 'Выполнен' | 'Отменен';

export class Client {
  id: string | null = null
  shop_id: string = UserModule.shopId
  phone: string | null = null
  name: string | null = null
  address: Address | null = new Address()
  orders: Array<Order> = []
  discount: string | null = null
  comment: string | null = null
}

export class Address {
  id: string | null = null
  shop_id: string = UserModule.shopId
  street: string = ''
  house: string = ''
  entrance: string = ''
  floor: string = ''
  flat: string = ''
}

export class OrderProduct {
  id: string | null = null
  product_id: string | null = null
  image: string | null = null
  name: string = ''
  price: number = 0
  order_id: string | null = null
  quantity: number = 0
  raw: Array<OrderProductRaw> = []
}

export class OrderProductRaw {
  id: string | null = null
  order_product_id: string | null = null
  raw_id: string | null = null
  standard_id: string | null = null
  quantity: number | null = null
}

export class Order {
  id: string | null = null
  order_number: number | null = null
  created_by_id: string | null = null
  make_by_id: string | null = null
  shop_id: string = UserModule.shopId
  client_id: string | null = null
  client: Client = new Client()
  products: Array<OrderProduct> = []
  delivery: boolean = false
  delivery_cost: number = 0
  decoration_cost: number = 0
  courier_id: string | null = null
  total_cost: number | null = null
  prepay: number = 0
  prepay_type: PaymentMethod = 'Наличные'
  amount: number | null = null
  amount_type: PaymentMethod | null = null
  discount: number = 0
  rating: number | null = null
  status: OrderStatus = 'Новый'
  date_created: Date = new Date()
  date_of_order: Date | null = null
  reason: any | null = null
  sales_channel: any | null = null
  remark: string = ''
}

@Module({dynamic: true, store, name: 'orders', namespaced: true})
class OrdersService extends VuexModule {
  public editVisible = false
  public amountVisible = false
  public editMode = false
  public currentRow = new Order()

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
  private SET_AMOUNT_VISIBLE(value: boolean) {
    this.amountVisible = value
  }

  @Action
  public SetAmountVisible(value: boolean) {
    this.SET_AMOUNT_VISIBLE(value)
  }

  @Mutation
  private SET_CURRENT_ROW(value: Order) {
    this.currentRow = {...value}
  }

  @Action
  public SetCurrentRow(value: Order) {
    this.SET_CURRENT_ROW(value)
  }

  @Action
  public ResetCurrentRow() {
    this.RESET_CURRENT_ROW()
  }

  @Mutation
  private RESET_CURRENT_ROW() {
    this.currentRow = new Order()
  }

  @Mutation
  private SET_EDIT_MODE(value: boolean) {
    this.editMode = value
  }

  @Action
  public SetEditMode(value: boolean) {
    this.SET_EDIT_MODE(value)
  }
}

export const OrdersModule = getModule(OrdersService)
