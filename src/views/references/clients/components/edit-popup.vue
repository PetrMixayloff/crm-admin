<template>
  <d-edit-popup
    :title="state.editMode ? 'Изменение данных клиента' : 'Добавление нового клиента'"
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
          data-field="name"
          :validation-rules="validationRules.name"
          :label="{text: 'Имя'}"
        />
        <DxItem
          data-field="phone"
          :validation-rules="validationRules.phone"
          :label="{text: 'Номер телефона'}"
        />
        <DxItem
          data-field="address"
          :validation-rules="validationRules.address"
          :label="{text: 'Адрес'}"
        />
        <DxItem
          data-field="discount"
          :validation-rules="validationRules.address"
          :label="{text: 'Дисконтная карта'}"
        />
        <DxItem
          data-field="comment"
          :validation-rules="validationRules.address"
          :label="{text: 'Примечание'}"
        />
      </DxForm>
    </div>
  </d-edit-popup>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { DxForm, DxItem } from 'devextreme-vue/form'
import DEditPopup from '@/components/DEditPopup/editpopup.vue'
import { Client, ClientModule } from '../service'
import ArrayStore from 'devextreme/data/array_store'
import { Positions } from '@/const'
import _ from 'lodash'

@Component({
  name: 'ClientPopupEdit',
  components: {
    DxForm,
    DxItem,
    DEditPopup
  }
})
export default class extends Vue {
  private entity: Client = new Client();

  public state = ClientModule;
  public positionsDataSource = new ArrayStore({
    key: 'id',
    data: Positions
  });

  public validationRules: any = {
    name: [
      { type: 'required', message: 'Имя не заполнено' }
    ],
    phone: [
      { type: 'required', message: 'Номер телефона не заполнен' }
    ],
    address: [
      { type: 'required', message: 'Адрес не заполнен' }
    ],
  }

  async created() {
  }

  empty() {
  }

  onShow() {
    if (this.state.editMode) {
      this.entity = _.cloneDeep(this.state.currentRow)
    } else {
      this.entity = new Client()
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
