import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store'
import base_ds from '@/services/base_datasource_service'
import { UserModule } from '@/store/modules/user'

export const product_route_ns = 'product'
export const category_route_ns = 'product_category'

export class ProductCategory {
  id: string | null = null
  shop_id: string = UserModule.shopId
  name: string = ''
  description: string = ''
  show_on_store = true
}

export class Product {
  id: string | null = null
  category_id: string | null = null
  shop_id: string = UserModule.shopId
  name = ''
  description = ''
  url = ''
  images = []
  price = 0.00
  old_price: number | null = null
  quantity = 0
  show_on_store = true
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

  public items: Array<any> = []

  @Action
  public async initItems() {
    const newItems: Array<any> = []
    const categories: any = await this.crudCategory.load()
    categories.data.forEach((category: any) => {
      newItems.push({
        id: category.id,
        label: category.name,
        children: category.products
      })
    })
    this.SET_ITEMS(newItems)
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
  private SET_CURRENT_PRODUCT(value: Product) {
    this.currentProduct = { ...value }
  }

  @Action
  public SetCurrentProduct(value: Product) {
    this.SET_CURRENT_PRODUCT(value)
  }

  @Mutation
  private SET_CURRENT_CATEGORY(value: ProductCategory) {
    this.currentCategory = { ...value }
  }

  @Action
  public SetCurrentCategory(value: ProductCategory) {
    this.SET_CURRENT_CATEGORY(value)
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
}

export const ProductsModule = getModule(ProductsService)
