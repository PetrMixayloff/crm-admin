import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
// import {login, logout, getUserInfo} from '@/api/users'
import store from '@/store'
import request from '@/utils/request'
import base_ds from '@/services/base_datasource_service'

export const route_ns = 'users'
export const table_name = 'public.user'

export class User {
  id = null;
  login = ''
  password = ''
  shopId = ''
  full_name = ''
  position = ''
  roles = ['user']
}

@Module({ dynamic: true, store, name: 'users', namespaced: true })
class StaffService extends VuexModule {
  public edit_visible = false;
  public edit_mode = false;
  public edit_title = '';
  public current_row = new User();

  public dataSource = base_ds.getBaseDataSource(route_ns);
  public crud = base_ds.getBaseCrud(route_ns);

  @Mutation
  private SET_EDIT_VISIBLE(value: boolean) {
    this.edit_visible = value
  }

  @Action
  public SetEditVisible(value: boolean) {
    this.SET_EDIT_VISIBLE(value)
  }

  @Mutation
  private SET_EDIT_TITLE(value: string) {
    this.edit_title = value
  }

  @Action
  public SetEditTitle(value: string) {
    this.SET_EDIT_TITLE(value)
  }

  @Mutation
  private SET_CURRENT(value: User) {
    this.current_row = { ...value }
  }

  @Action
  public SetCurrentRow(value: User) {
    this.SET_CURRENT(value)
  }

  @Mutation
  private RESET_CURRENT() {
    this.current_row = new User()
  }

  @Action
  public ResetCurrentRow() {
    this.RESET_CURRENT()
  }

  @Mutation
  private SET_EDIT_MODE(value: boolean) {
    this.edit_mode = value
  }

  @Action
  public SetEditMode(value: boolean) {
    this.SET_EDIT_MODE(value)
  }
}

export const StaffModule = getModule(StaffService)
