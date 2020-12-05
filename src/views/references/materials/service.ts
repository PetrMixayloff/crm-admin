import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store'
import base_ds from '@/services/base_datasource_service'
import { UserModule } from '@/store/modules/user'
import _ from 'lodash'

export const raw_route_ns = 'raw'
export const raw_category_route_ns = 'raw_category'
export const raw_details_route_ns = 'raw/details'

export const table_name = 'public.raw'

export class RawCategory {
  id: string | null = null
  parent_id: string | null = null
  shop_id: string = UserModule.shopId
  name: string = ''
  description: string = ''
}

export class Raw {
  id: string | null = null
  category_id: string | null = null
  shop_id: string = UserModule.shopId
  name = ''
  description = ''
  image: string | null = ''
  cost = 0.00
  quantity = 0
  per_pack = 0
  green_signal = 0
  yellow_signal = 0
  red_signal = 0
  unit = 'шт'
}

@Module({ dynamic: true, store, name: 'raw', namespaced: true })
class RawService extends VuexModule {
  public showRemainsDetails = false
  public categoryEditVisible = false
  public categoryEditMode = false
  public rawEditVisible = false
  public rawEditMode = false
  public currentCategory = new RawCategory()
  public currentRaw = new Raw()
  public currentRow: Raw | RawCategory | null = null

  public rawDataSource = base_ds.getBaseDataSource(raw_route_ns)
  public crudRaw = base_ds.getBaseCrud(raw_route_ns)

  public rawCategoryDataSource = base_ds.getBaseDataSource(raw_category_route_ns)
  public crudRawCategory = base_ds.getBaseCrud(raw_category_route_ns)

  public items: Array<any> = []

  @Action
  public async initItems() {
    const categories: any = await this.crudRawCategory.load()
    categories.data.sort((a: any, b: any) => a.name > b.name ? 1 : -1)
    this.SET_ITEMS(categories.data)
  }

  @Mutation
  private SET_ITEMS(items: Array<any>) {
    this.items = items
  }

  @Mutation
  private SET_CATEGORY_EDIT_VISIBLE(value: boolean) {
    this.categoryEditVisible = value
  }

  @Action
  public SetCategoryEditVisible(value: boolean) {
    this.SET_CATEGORY_EDIT_VISIBLE(value)
  }

  @Mutation
  private SET_SHOW_REMAINS_DETAILS(value: boolean) {
    this.showRemainsDetails = value
  }

  @Action
  public ShowRemainsDetails(value: boolean) {
    this.SET_SHOW_REMAINS_DETAILS(value)
  }

  @Mutation
  private SET_RAW_EDIT_VISIBLE(value: boolean) {
    this.rawEditVisible = value
  }

  @Action
  public SetRawEditVisible(value: boolean) {
    this.SET_RAW_EDIT_VISIBLE(value)
  }

  @Mutation
  private SET_CURRENT_RAW(value: Raw) {
    this.currentRaw = { ...value }
  }

  @Action
  public SetCurrentRaw(value: Raw) {
    this.SET_CURRENT_RAW(value)
  }

  @Mutation
  private SET_CURRENT_CATEGORY(value: RawCategory) {
    this.currentCategory = { ...value }
  }

  @Action
  public SetCurrentCategory(value: RawCategory) {
    this.SET_CURRENT_CATEGORY(value)
  }

  @Mutation
  private SET_CURRENT_ROW(value: RawCategory | Raw | null) {
    if (!_.isNull(value)) {
      this.currentRow = _.cloneDeep(value)
    } else {
      this.currentRow = null
    }
  }

  @Action
  public SetCurrentRow(value: RawCategory | Raw | null) {
    this.SET_CURRENT_ROW(value)
  }

  @Mutation
  private RESET_CURRENT() {
    this.currentRaw = new Raw()
    this.currentCategory = new RawCategory()
  }

  @Action
  public ResetCurrentRow() {
    this.RESET_CURRENT()
  }

  @Action
  public ResetCurrentRaw() {
    this.RESET_CURRENT_RAW()
  }

  @Mutation
  private RESET_CURRENT_RAW() {
    this.currentRaw = new Raw()
  }

  @Action
  public ResetCurrentCategory() {
    this.RESET_CURRENT_CATEGORY()
  }

  @Mutation
  private RESET_CURRENT_CATEGORY() {
    this.currentCategory = new RawCategory()
  }

  @Mutation
  private SET_CATEGORY_EDIT_MODE(value: boolean) {
    this.categoryEditMode = value
  }

  @Action
  public SetCategoryEditMode(value: boolean) {
    this.SET_CATEGORY_EDIT_MODE(value)
  }

  @Mutation
  private SET_RAW_EDIT_MODE(value: boolean) {
    this.rawEditMode = value
  }

  @Action
  public SetRawEditMode(value: boolean) {
    this.SET_RAW_EDIT_MODE(value)
  }
}

export const RawModule = getModule(RawService)
