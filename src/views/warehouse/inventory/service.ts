import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store'
import base_ds from '@/services/base_datasource_service'
import { UserModule } from '@/store/modules/user'


export const route_ns = 'inventory'

export const table_name = 'public.inventory'


export class Inventory {
  id: string | null = null
  shop_id: string = UserModule.shopId
  number: string | null = null
  date: Date = new Date()
  remark: string | null = null
  supplier: string | null = null
  records: Array<InventoryRecord> = []
}

export class InventoryRecord {
  id: string | null = null
  shop_id: string = UserModule.shopId
  inventory_id: string | null = null
  rawremainsdetail_id: string| null = null
  quantity: number = 0
}

@Module({ dynamic: true, store, name: 'inventory', namespaced: true })
class InventoryService extends VuexModule {
  public editVisible = false
  public editMode = false
  public currentInventory = new Inventory()

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
  private SET_CURRENT_INVENTORY(value: Inventory) {
    this.currentInventory = { ...value }
  }

  @Action
  public SetCurrentInventory(value: Inventory) {
    this.SET_CURRENT_INVENTORY(value)
  }

  @Mutation
  private RESET_CURRENT_INVENTORY() {
    this.currentInventory = new Inventory()
  }

  @Action
  public ResetCurrentInventory() {
    this.RESET_CURRENT_INVENTORY()
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

export const InventoryModule = getModule(InventoryService)
