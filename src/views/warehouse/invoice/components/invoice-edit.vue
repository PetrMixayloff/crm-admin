<template>
  <d-edit-popup
    :title="state.rawEditMode ? 'Изменение данных в накладной' : 'Создание новой накладной'"
    default-width="600"
    default-height="900"
    :visible="state.editVisible"
    validation-group="invoiceEntity"
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
        validation-group="invoiceEntity"
      >
        <DxItem
          data-field="number"
          :validation-rules="validationRules.number"
          :label="{text: 'Номер накладной'}"
        />
        <DxItem
          data-field="date"
          :validation-rules="validationRules.number"
          :label="{text: 'Дата'}"
          editor-type="dxDateBox"
          :editor-options="{adaptivityEnabled: true, hint: 'Дата накладной', openOnFieldClick: true,
                            pickerType: 'native', showClearButton: true}"
        />
        <DxItem
          data-field="supplier"
          :label="{text: 'Поставщик'}"
        />
        <DxItem
          data-field="payment_method"
          :label="{text: 'Способ оплаты'}"
        />
        <DxItem
          data-field="remark"
          :label="{text: 'Примечание'}"
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
import { InvoiceModule, Invoice } from '../service'
import DButton from '@/components/DButton/button.vue'
import _ from 'lodash'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'InvoiceEditPopup',
  components: {
    DxForm,
    DxItem,
    DButton,
    DEditPopup,
    DxFileUploader
  }
})
export default class extends Vue {
  private entity: Invoice = new Invoice();
  public state = InvoiceModule;

  public validationRules: any = {
    number: [
      { type: 'required', message: 'Не задан номер накладной' }
    ],
    date: [
      { type: 'required', message: 'Укажите дату накладной' }
    ]
  }

  async created() {
  }

  empty() {
  }

  onShow() {
    if (this.state.editMode) {
      this.entity = _.cloneDeep(this.state.currentInvoice)
    } else {
      this.entity = new Invoice()
    }
  }

  onClose() {
    this.state.SetEditVisible(false)
    this.state.SetEditMode(false)
  }

  async onOk(e: any) {
    const result = e.validationGroup.validate()
    if (result.isValid) {
      try {
        await this.state.crud.save(this.entity)
        await this.state.dataSource.reload()
        this.state.ResetCurrentInvoice()
      } catch (e) {
        console.log(e)
      }
    }
  }

  onCancel(e: any) {
    this.state.SetEditVisible(false)
    this.state.SetEditMode(false)
  }

  onUploaded(e: any) {
    //
  }

  onRemove() {
    //
  }
}
</script>

<style lang="scss" scoped>
#form-container {
  margin: 10px 10px 30px;
}
</style>
