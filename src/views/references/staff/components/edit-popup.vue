<template>
  <d-edit-popup
    :title="state.editMode ? 'Изменение данных сотрудника' : 'Добавление нового сотрудника'"
    default-width="450"
    default-height="500"
    :visible="state.editVisible"
    :validation-group="'staffEntity'"
    @hidden="onClose"
    @ok="onOk"
    @cancel="onCancel"
    @shown="onShow"
  >
    <div id="form-container">
      <DxForm
        id="form"
        ref="dxform"
        :form-data.sync="entity"
        :show-validation-summary="true"
        validation-group="staffEntity"
      >
        <DxItem
          data-field="phone"
          :validation-rules="validationRules.phone"
          :label="{text: 'Номер телефона'}"
        />
        <DxItem
          data-field="password"
          :editor-options="{mode: 'password'}"
          :validation-rules="validationRules.password"
          :label="{text: 'Пароль'}"
        />
        <DxItem
          data-field="full_name"
          :validation-rules="validationRules.fullName"
          :label="{text: 'ФИО'}"
        />
        <DxItem
          data-field="position"
          :validation-rules="validationRules.position"
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
    phone: [
      { type: 'required', message: 'Номер телефона не заполнен' }
    ],
    fullName: [
      { type: 'required', message: 'ФИО не заполнены' }
    ],
    password: [
      { type: 'required', message: 'Пароль не задан' }
    ],
    position: [
      { type: 'required', message: 'Должность не задана' }
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

  async onOk(e: any) {
    const valid = e.validationGroup.validate()
    if (valid.isValid) {
      console.log(this.entity)
    }
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
