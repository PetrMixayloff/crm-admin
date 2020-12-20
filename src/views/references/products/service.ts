import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store'
import base_ds from '@/services/base_datasource_service'
import { UserModule } from '@/store/modules/user'
import {Raw, RawCategory} from "@/views/references/materials/service";

export const product_route_ns = 'product'
export const category_route_ns = 'product_category'

export const table_name = 'public.product'

export class ProductCategory {
  id: string | null = null
  shop_id: string = UserModule.shopId
  name: string = ''
  description: string = ''
  show_on_store = true
}

export class ProductRawRelation {
  id: string | null = null
  product_id: string | null = null
  raw_id: string | null = null
  quantity: number = 0
}

export class Product {
  id: string | null = null
  category_id: string | null = null
  shop_id: string = UserModule.shopId
  name = ''
  description = ''
  image: string | null = null
  price = 0.00
  old_price: number | null = null
  show_on_store = true
  raw: Array<ProductRawRelation> = []
}

@Module({ dynamic: true, store, name: 'products', namespaced: true })
class ProductsService extends VuexModule {
  public categoryEditVisible = false
  public categoryEditMode = false
  public productEditVisible = false
  public productEditMode = false
  public currentCategory = new ProductCategory()
  public currentProduct = new Product()

  public productDataSource = base_ds.getBaseDataSource(product_route_ns)
  public crudProduct = base_ds.getBaseCrud(product_route_ns)

  public categoryDataSource = base_ds.getBaseDataSource(category_route_ns)
  public crudCategory = base_ds.getBaseCrud(category_route_ns)

  @Mutation
  private SET_CATEGORY_EDIT_VISIBLE(value: boolean) {
    this.categoryEditVisible = value
  }

  @Action
  public SetCategoryEditVisible(value: boolean) {
    this.SET_CATEGORY_EDIT_VISIBLE(value)
  }

  @Mutation
  private SET_PRODUCT_EDIT_VISIBLE(value: boolean) {
    this.productEditVisible = value
  }

  @Action
  public SetProductEditVisible(value: boolean) {
    this.SET_PRODUCT_EDIT_VISIBLE(value)
  }

  @Mutation
  private SET_CURRENT_PRODUCT(value: Product) {
    this.currentProduct = { ...value }
  }

  @Action
  public SetCurrentProduct(value: Product) {
    this.SET_CURRENT_PRODUCT(value)
  }

  @Action
  public ResetCurrentProduct() {
    this.RESET_CURRENT_PRODUCT()
  }

  @Mutation
  private RESET_CURRENT_PRODUCT() {
    this.currentProduct = new Product()
  }

  @Mutation
  private SET_CURRENT_CATEGORY(value: ProductCategory) {
    this.currentCategory = { ...value }
  }

  @Action
  public SetCurrentCategory(value: ProductCategory) {
    this.SET_CURRENT_CATEGORY(value)
  }

  @Action
  public ResetCurrentCategory() {
    this.RESET_CURRENT_CATEGORY()
  }

  @Mutation
  private RESET_CURRENT_CATEGORY() {
    this.currentCategory = new ProductCategory()
  }

  @Mutation
  private RESET_CURRENT() {
    this.currentProduct = new Product()
    this.currentCategory = new ProductCategory()
  }

  @Action
  public ResetCurrentRow() {
    this.RESET_CURRENT()
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
  private SET_PRODUCT_EDIT_MODE(value: boolean) {
    this.productEditMode = value
  }

  @Action
  public SetProductEditMode(value: boolean) {
    this.SET_PRODUCT_EDIT_MODE(value)
  }
}

export const ProductsModule = getModule(ProductsService)
