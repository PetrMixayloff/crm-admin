import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store'
import base_ds from '@/services/base_datasource_service'
import {UserModule} from '@/store/modules/user'
import {raw_route_ns} from "@/views/references/materials/service";

export const route_ns = 'rawusagestandards'
export const table_name = 'public.rawusagestandards'

export class RawUsageStandards {
  id: string | null = null
  shop_id: string = UserModule.shopId
  raw_id: string | null = null
  name: string | null = null
  quantity: string | null = null
}

@Module({ dynamic: true, store, name: 'rawusagestandards', namespaced: true })
class RawUsageStandardsService extends VuexModule {
  public currentStandards = new RawUsageStandards();
  public dataSource = base_ds.getBaseDataSource(route_ns);
  public crudStandards = base_ds.getBaseCrud(route_ns);
  public editVisible = false
  public editMode = false



  @Mutation
  private SET_CURRENT(value: RawUsageStandards) {
    this.currentStandards = { ...value }
  }

  @Action
  public SetCurrentRow(value: RawUsageStandards) {
    this.SET_CURRENT(value)
  }

  @Mutation
  private RESET_CURRENT() {
    this.currentStandards = new RawUsageStandards()
  }

  @Action
  public ResetCurrentRow() {
    this.RESET_CURRENT()
  }

  @Mutation
  private SET_EDIT_VISIBLE(value: boolean) {
    this.editVisible = value
  }

  @Action
  public SetEditVisible(value: boolean) {
    this.SET_EDIT_VISIBLE(value)
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

export const RawUsageStandardsModule = getModule(RawUsageStandardsService)
