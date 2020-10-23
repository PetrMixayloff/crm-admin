<template>
  <d-edit-popup
    :title="state.editMode ? 'Изменение данных сотрудника' : 'Добавление нового сотрудника'"
    default-width="450"
    default-height="500"
    :visible="state.editVisible"
    @hidden="onClose"
    @ok="onOk"
    @cancel="onCancel"
    @shown="onShow"
  >
    <div id="form-container">
      <DxForm
        id="form"
        :on-content-ready="validateForm"
        :form-data.sync="entity"
        validation-group="entityData"
      >
        <DxItem
          data-field="login"
          :validation-rules="validationRules.required"
          :label="{text: 'Логин'}"
        />
        <DxItem
          data-field="password"
          :editor-options="{mode: 'password'}"
          :validation-rules="validationRules.required"
          :label="{text: 'Пароль'}"
        />
        <DxItem
          data-field="full_name"
          :validation-rules="validationRules.required"
          :label="{text: 'ФИО'}"
        />
        <DxItem
          data-field="position"
          :validation-rules="validationRules.required"
          :label="{text: 'Должность'}"
          editor-type="dxSelectBox"
          :editor-options="{dataSource: positionsDataSource, displayExpr: 'name', valueExpr: 'name'}"
        />
      </DxForm>
    </div>
  </d-edit-popup>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { DxForm, DxItem } from 'devextreme-vue/form'
import DEditPopup from '@/components/DEditPopup/editpopup.vue'
import { User, StaffModule } from '../service'
import ArrayStore from 'devextreme/data/array_store'
import { Positions } from '@/const'
import _ from 'lodash'

@Component({
  name: 'UserPopupEdit',
  components: {
    DxForm,
    DxItem,
    DEditPopup
  }
})
export default class extends Vue {
  @Prop() public popupOptions: any;

  private entity: User = new User();
  public allowBenchPermissions: boolean = false;
  public allowUsersPermissions: boolean = false;
  public allowBenchEditPermissions: boolean = false;

  public state = StaffModule;
  public benchDataSource: any = [];
  public positionsDataSource = new ArrayStore({
    key: 'id',
    data: Positions
  });

  public validationRules: any = {
    required: [
      { type: 'required', message: 'Обязательное поле' }
    ]
  }

  async created() {
  }

  empty() {
  }

  onShow() {
    if (this.state.editMode) {
      this.entity = _.cloneDeep(this.state.currentRow)
    } else {
      this.entity = new User()
    }
  }

  onClose() {
    this.state.SetEditVisible(false)
  }

  validateForm(e: any) {
    console.log(e.component.validate())
    e.component.validate()
  }

  async onOk(e: any) {
    console.log(e)
  }

  onCancel(e: any) {
    this.state.SetEditVisible(false)
  }
}
</script>

<style lang="scss" scoped>
#form-container {
  margin: 10px 10px 30px;
}
</style>
