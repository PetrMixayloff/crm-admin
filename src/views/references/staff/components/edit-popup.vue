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
          :validation-rules="!state.editMode ? validationRules.password : null"
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
        <DxItem
          data-field="description"
          :label="{text: 'Данные сотрудника'}"
          editor-type="dxTextArea"
        />
      </DxForm>
    </div>
  </d-edit-popup>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { DxForm, DxItem } from 'devextreme-vue/form'
import { DxFileUploader } from 'devextreme-vue/file-uploader'
import DEditPopup from '@/components/DEditPopup/editpopup.vue'
import { User, StaffModule } from '../service'
import ArrayStore from 'devextreme/data/array_store'
import { Positions } from '@/const'
import _ from 'lodash'

@Component({
  name: 'StaffPopupEdit',
  components: {
    DxForm,
    DxItem,
    DEditPopup,
    DxFileUploader
  }
})
export default class extends Vue {
  private entity: User = new User();

  public state = StaffModule;
  public positionsDataSource = new ArrayStore({
    key: 'id',
    data: Positions
  });

  public validationRules: any = {
    phone: [
      { type: 'required', message: 'Номер телефона не заполнен' },
      {
        type: 'custom',
        validationCallback: this.phoneValidate,
        message: 'Номер телефона должен быть в формате +79005551122'
      }
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
      this.entity.password = null
    } else {
      this.entity = new User()
      this.state.SetCurrentRow(this.entity)
    }
  }

  onClose() {
    this.state.SetEditVisible(false)
  }

  async onOk(e: any) {
    const result = e.validationGroup.validate()
    if (result.isValid) {
      try {
        await this.state.crud.save(this.entity)
        this.state.dataSource.reload()
        this.state.SetEditVisible(false)
      } catch (e) {
        console.log(e)
      }
    }
  }

  phoneValidate(data: any) {
    const re = new RegExp('[+][7][9][0-9]{9}')
    const found = data.value.match(re)
    return !_.isNull(found)
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
