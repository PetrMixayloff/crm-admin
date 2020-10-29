import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store'
import base_ds from '@/services/base_datasource_service'

export const route_ns = 'product'
export const table_name = 'public.product'

export class Product {
  id = null
  category_id = ''
  shop_id = ''
  name = ''
  description = ''
  url = ''
  images = []
  price = 0.00
  old_price: number | null = null
  quantity = 0
  show_on_store = true
}

@Module({ dynamic: true, store, name: 'product', namespaced: true })
class StaffService extends VuexModule {
  public editVisible = false;
  public editMode = false;
  public editTitle = '';
  public currentRow = new Product();

  public dataSource = base_ds.getBaseDataSource(route_ns);
  public crud = base_ds.getBaseCrud(route_ns);

  @Mutation
  private SET_EDIT_VISIBLE(value: boolean) {
    this.editVisible = value
  }

  @Action
  public SetEditVisible(value: boolean) {
    this.SET_EDIT_VISIBLE(value)
  }

  @Mutation
  private SET_EDIT_TITLE(value: string) {
    this.editTitle = value
  }

  @Action
  public SetEditTitle(value: string) {
    this.SET_EDIT_TITLE(value)
  }

  @Mutation
  private SET_CURRENT(value: Product) {
    this.currentRow = { ...value }
  }

  @Action
  public SetCurrentRow(value: Product) {
    this.SET_CURRENT(value)
  }

  @Mutation
  private RESET_CURRENT() {
    this.currentRow = new Product()
  }

  @Action
  public ResetCurrentRow() {
    this.RESET_CURRENT()
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

export const ProductsModule = getModule(StaffService)
