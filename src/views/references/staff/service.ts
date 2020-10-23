import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { UserModule } from '@/store/modules/user'
import store from '@/store'
import base_ds from '@/services/base_datasource_service'

export const route_ns = 'users'
export const table_name = 'public.user'

export class User {
  id = null
  phone = ''
  password = ''
  shop_id = UserModule.shopId
  full_name = ''
  position = ''
}

@Module({ dynamic: true, store, name: 'users', namespaced: true })
class StaffService extends VuexModule {
  public editVisible = false;
  public editMode = false;
  public editTitle = '';
  public currentRow = new User();

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
  private SET_CURRENT(value: User) {
    this.currentRow = { ...value }
  }

  @Action
  public SetCurrentRow(value: User) {
    this.SET_CURRENT(value)
  }

  @Mutation
  private RESET_CURRENT() {
    this.currentRow = new User()
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

export const StaffModule = getModule(StaffService)
