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
    />
    <InvoiceEditPopup />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TableGrid from '@/components/TableGrid/grid.vue'
import TableActions from '@/components/TableActions/actions.vue'
import { InvoiceModule, table_name } from './service'
import dbSchemaService from '@/services/db_schema_service'
import InvoiceEditPopup from './components/invoice-edit.vue'

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

  createNewInvoice() {
    this.state.SetEditVisible(true)
  }

  editInvoice() {

  }

  deleteInvoice() {

  }
}
</script>
