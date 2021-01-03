<!--<template>-->
<!--  <h1>Страница в разработке</h1>-->
<!--  <d-edit-popup-->
<!--    :title="state.rawEditMode ? 'Изменение данных в накладной' : 'Создание новой накладной'"-->
<!--    default-width="1200"-->
<!--    default-height="1000"-->
<!--    :visible="state.editVisible"-->
<!--    validation-group="invoiceEntity"-->
<!--    @hidden="onClose"-->
<!--    @ok="onOk"-->
<!--    @cancel="onCancel"-->
<!--    @shown="onShow"-->
<!--  >-->
<!--    <div id="form-container">-->
<!--      <DxForm-->
<!--        id="form"-->
<!--        ref="dxform"-->
<!--        :form-data.sync="entity"-->
<!--        :show-validation-summary="true"-->
<!--        validation-group="invoiceEntity"-->
<!--      >-->
<!--        <DxItem-->
<!--          data-field="number"-->
<!--          :validation-rules="validationRules.number"-->
<!--          :label="{text: 'Номер накладной'}"-->
<!--        />-->
<!--        <DxItem-->
<!--          data-field="date"-->
<!--          :validation-rules="validationRules.number"-->
<!--          :label="{text: 'Дата'}"-->
<!--          editor-type="dxDateBox"-->
<!--          :editor-options="{adaptivityEnabled: true, hint: 'Дата накладной', openOnFieldClick: true,-->
<!--                            pickerType: 'native', showClearButton: true, type: 'date'}"-->
<!--        />-->
<!--        <DxItem-->
<!--          data-field="supplier"-->
<!--          :label="{text: 'Поставщик'}"-->
<!--        />-->
<!--        <DxItem-->
<!--          data-field="payment_method"-->
<!--          :label="{text: 'Способ оплаты'}"-->
<!--        />-->
<!--        <DxItem-->
<!--          data-field="remark"-->
<!--          :label="{text: 'Примечание'}"-->
<!--          editor-type="dxTextArea"-->
<!--        />-->
<!--      </DxForm>-->
<!--      <br>-->
<!--      <h3>Товарные позиции</h3>-->
<!--      <table-grid-->
<!--        ref="tablegrid"-->
<!--        :data-source="invoiceRecords"-->
<!--        :columns="columns"-->
<!--        :height="400"-->
<!--        :filter-row-visible="false"-->
<!--        :column-chooser-enable="false"-->
<!--        :allow-editing="true"-->
<!--        editing-mode="raw"-->
<!--        :row-click="empty"-->
<!--        :dbl-row-click="empty"-->
<!--      />-->
<!--    </div>-->
<!--  </d-edit-popup>-->
<!--</template>-->

<!--<script lang="ts">-->
<!--import {Component, Vue} from 'vue-property-decorator'-->
<!--import {DxForm, DxItem} from 'devextreme-vue/form'-->
<!--import DEditPopup from '@/components/DEditPopup/editpopup.vue'-->
<!--import {CancellationModule, Cancellation, CancellationRecord} from '../service'-->
<!--// import {RawModule} from '@/views/references/materials/service'-->
<!--import DButton from '@/components/DButton/button.vue'-->
<!--import TableGrid from '@/components/TableGrid/grid.vue'-->

<!--@Component({-->
<!--  name: 'CancellationEditPopup',-->
<!--  components: {-->
<!--    DxForm,-->
<!--    DxItem,-->
<!--    DButton,-->
<!--    DEditPopup,-->
<!--    TableGrid-->
<!--  }-->
<!--})-->

<!--export default class extends Vue {-->
<!--  private entity: Cancellation = new Cancellation();-->
<!--  public state = CancellationModule;-->
<!--  public cancellationRecords: any[] = []-->
<!--  public columns = [-->
<!--    {-->
<!--      dataField: 'id',-->
<!--      dataType: 'string',-->
<!--      visible: false-->
<!--    },-->
<!--    {-->
<!--      dataField: 'rawremainsdetail_id',-->
<!--      dataType: 'string',-->
<!--      caption: 'Наименование',-->
<!--      lookup: {-->
<!--        allowClearing: true,-->
<!--        dataSource: Raw.rawDataSource.store(),-->
<!--        valueExpr: 'id',-->
<!--        displayExpr: 'name'-->
<!--      },-->
<!--      validationRules: [{type: 'required'}]-->
<!--    },-->
<!--    {-->
<!--      dataField: 'price',-->
<!--      dataType: 'number',-->
<!--      caption: 'Цена за ед.',-->
<!--      validationRules: [{type: 'required'}]-->
<!--    },-->
<!--    {-->
<!--      dataField: 'quantity',-->
<!--      dataType: 'number',-->
<!--      caption: 'Количество',-->
<!--      validationRules: [{type: 'required'}]-->
<!--    },-->
<!--    {-->
<!--      dataField: 'total',-->
<!--      dataType: 'number',-->
<!--      caption: 'Сумма',-->
<!--      calculateCellValue: this.calculateTotal-->
<!--    }-->
<!--  ]-->

<!--  public validationRules: any = {-->
<!--    number: [-->
<!--      {type: 'required', message: 'Не задан номер накладной'}-->
<!--    ],-->
<!--    date: [-->
<!--      {type: 'required', message: 'Укажите дату накладной'}-->
<!--    ]-->
<!--  }-->

<!--  async created() {-->
<!--  }-->

<!--  empty() {-->
<!--  }-->

<!--  calculateTotal(e: any) {-->
<!--    if (e.price && e.quantity) {-->
<!--      return e.price * e.quantity-->
<!--    }-->
<!--    return ''-->
<!--  }-->

<!--  onShow() {-->
<!--    if (this.state.editMode) {-->
<!--      this.entity = _.cloneDeep(this.state.currentInvoice)-->
<!--    } else {-->
<!--      this.entity = new Invoice()-->
<!--    }-->
<!--  }-->

<!--  onClose() {-->
<!--    this.state.SetEditVisible(false)-->
<!--    this.state.SetEditMode(false)-->
<!--  }-->

<!--  async onOk(e: any) {-->
<!--    const result = e.validationGroup.validate()-->
<!--    if (result.isValid) {-->
<!--      try {-->
<!--        this.cancellationRecords.forEach((item: any) => {-->
<!--          const recordToAdd = new CancellationRecord()-->
<!--          recordToAdd.quantity = item.quantity-->
<!--          this.entity.records.push(recordToAdd)-->
<!--        })-->
<!--        await this.state.crud.save(this.entity)-->
<!--        await this.state.dataSource.reload()-->
<!--        this.state.ResetCurrentInvoice()-->
<!--        this.onClose()-->
<!--      } catch (e) {-->
<!--        console.log(e)-->
<!--      }-->
<!--    }-->
<!--  }-->

<!--  onCancel(e: any) {-->
<!--    this.state.SetEditVisible(false)-->
<!--    this.state.SetEditMode(false)-->
<!--  }-->

<!--  onUploaded(e: any) {-->
<!--    //-->
<!--  }-->

<!--  onRemove() {-->
<!--    //-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style lang="scss" scoped>-->
<!--#form-container {-->
<!--  margin: 10px 10px 30px;-->
<!--}-->
<!--</style>-->
