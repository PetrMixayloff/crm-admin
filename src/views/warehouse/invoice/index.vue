<template>
  <div class="app-container">
    <table-actions
      :on-create-new="createNewInvoice"
      :on-edit="editInvoice"
      :on-delete="deleteInvoice"
      table-title="Накладные"
      :selected="state.currentInvoice.id"
    />
    <table-grid
      ref="tablegrid"
      :data-source="state.dataSource"
      :columns="columns"
      :row-click="onRowClick"
      :dbl-row-click="empty"
      selection-mode="single"
      :master-detail-enable="true"
    >
      <template #masterDetailTemplate="{rowKey, rowData}">
        <table-grid
          :data-source="rowData.records"
          :columns="recordsColumns"
          :row-click="empty"
          :dbl-row-click="empty"
          selection-mode="single"
        />
      </template>
    </table-grid>
    <InvoiceEditPopup/>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import TableGrid from '@/components/TableGrid/grid.vue'
import TableActions from '@/components/TableActions/actions.vue'
import {InvoiceModule, table_name} from './service'
import dbSchemaService from '@/services/db_schema_service'
import InvoiceEditPopup from './components/invoice-edit.vue'
import {RawModule} from "@/views/references/materials/service";

@Component({
  name: 'Invoice',
  components: {
    TableGrid,
    TableActions,
    InvoiceEditPopup
  }
})
export default class extends Vue {
  public state = InvoiceModule
  public columns: any[] = []
  public recordsColumns = [
    {
      dataField: 'id',
      dataType: 'string',
      visible: false
    },
    {
      dataField: 'raw_id',
      dataType: 'string',
      caption: 'Наименование',
      lookup: {
        allowClearing: true,
        dataSource: RawModule.rawDataSource.store(),
        valueExpr: 'id',
        displayExpr: 'name'
      },
    },
    {
      dataField: 'price',
      dataType: 'number',
      caption: 'Цена за ед.'
    },
    {
      dataField: 'quantity',
      dataType: 'number',
      caption: 'Количество'
    },
    {
      dataField: 'total',
      dataType: 'number',
      caption: 'Сумма',
      calculateCellValue: this.calculateTotal
    }
  ]
  public emptyEntity: any = {};

  created() {
    this.initColumns()
  }

  initColumns() {
    const included = ['id', 'number', 'date', 'supplier', 'remark', 'payment_method'];

    [this.columns, this.emptyEntity] = dbSchemaService.prepareGridColumns(
      table_name, included)
  }

  onRowClick() {

  }

  empty() {

  }

  calculateTotal(e: any) {
    if (e.price && e.quantity) {
      return e.price * e.quantity
    }
    return ''
  }

  createNewInvoice() {
    this.state.SetEditVisible(true)
  }

  editInvoice() {

  }

  deleteInvoice() {

  }
}
</script>
