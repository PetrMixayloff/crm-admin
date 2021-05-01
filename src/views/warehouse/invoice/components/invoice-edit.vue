<template>
  <d-edit-popup
    title="Создание новой накладной"
    default-width="900"
    default-height="800"
    :visible="state.editVisible"
    validation-group="invoiceEntity"
    @hidden="onClose"
    @ok="onOk"
    @cancel="onClose"
    @shown="onShow"
  >
    <div id="form-container">
      <DxForm
        id="form"
        ref="dxform"
        :form-data.sync="entity"
        :col-count="2"
        :show-validation-summary="true"
        validation-group="invoiceEntity"
      >
        <DxItem
          data-field="number"
          :label="{text: 'Номер накладной'}"
          :is-required="true"
        />
        <DxItem
          data-field="date"
          :is-required="true"
          :label="{text: 'Дата'}"
          editor-type="dxDateBox"
          :editor-options="{adaptivityEnabled: true, hint: 'Дата накладной', openOnFieldClick: true,
                            pickerType: 'native', showClearButton: true, type: 'date'}"
        />
        <DxItem
          data-field="supplier"
          :label="{text: 'Поставщик'}"
        />
        <DxItem
          data-field="payment_method"
          :label="{text: 'Способ оплаты'}"
          editor-type="dxSelectBox"
          :editor-options="{
              showClearButton: true,
              value: entity.payment_method,
              dataSource: paymentMethod,
              valueExpr: 'name',
              displayExpr: 'name'
            }"
        />
        <DxItem
          data-field="remark"
          :col-span="2"
          :label="{text: 'Примечание'}"
          editor-type="dxTextArea"
        />
      </DxForm>
      <h4>Товарные позиции</h4>
      <table-grid
        ref="tablegrid"
        :data-source="entity.records"
        :columns="columns"
        :height="400"
        :filter-row-visible="false"
        :column-chooser-enable="false"
        :allow-editing="true"
        editing-mode="raw"
        :row-click="empty"
        :dbl-row-click="empty"
      />
    </div>
  </d-edit-popup>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import {DxForm, DxItem} from 'devextreme-vue/form'
import DEditPopup from '@/components/DEditPopup/editpopup.vue'
import {InvoiceModule, Invoice, InvoiceRecord} from '../service'
import {RawModule} from '@/views/references/materials/service'
import DButton from '@/components/DButton/button.vue'
import TableGrid from '@/components/TableGrid/grid.vue'
import {PaymentMethod} from "@/const";

@Component({
  name: 'InvoiceEditPopup',
  components: {
    DxForm,
    DxItem,
    DButton,
    DEditPopup,
    TableGrid
  }
})

export default class extends Vue {
  private entity: Invoice = new Invoice();
  public state = InvoiceModule;
  public columns = [
    {
      dataField: 'id',
      dataType: 'string',
      visible: false
    },
    {
      dataField: 'raw_id',
      dataType: 'string',
      caption: 'Наименование',
      allowSorting: false,
      lookup: {
        allowClearing: true,
        dataSource: RawModule.rawDataSource.store(),
        valueExpr: 'id',
        displayExpr: 'name'
      },
      validationRules: [{type: 'required'}]
    },
    {
      dataField: 'price',
      dataType: 'number',
      caption: 'Цена за ед.',
      allowSorting: false,
      validationRules: [{type: 'required'}],
      width: 100
    },
    {
      dataField: 'quantity',
      dataType: 'number',
      caption: 'Количество',
      allowSorting: false,
      validationRules: [{type: 'required'}],
      width: 100
    },
    {
      dataField: 'total',
      dataType: 'number',
      caption: 'Сумма',
      allowSorting: false,
      calculateCellValue: this.calculateTotal,
      width: 80
    }
  ]
  private paymentMethod = PaymentMethod;

  async created() {
  }

  empty() {
  }

  calculateTotal(e: any) {
    if (e.price && e.quantity) {
      return e.price * e.quantity
    }
    return ''
  }

  onShow() {
    this.entity = new Invoice()

  }

  onClose() {
    this.state.SetEditVisible(false)
  }

  async onOk(e: any) {
    const result = e.validationGroup.validate()
    if (result.isValid) {
      try {
        await this.state.crud.save(this.entity)
        await this.state.dataSource.reload()
        this.state.ResetCurrentInvoice()
        this.onClose()
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#form-container {
  margin: 10px 10px 30px;
}
</style>
