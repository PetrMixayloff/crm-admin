<template>
  <div class="app-container">
    <table-grid
      table-title="Остатки"
      ref="tablegrid"
      :data-source="state.dataSource"
      :columns="recordsColumns"
      :row-click="onRowClick"
      :dbl-row-click="empty"
      selection-mode="single"
    >
    </table-grid>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TableGrid from "@/components/TableGrid/grid.vue";
import {RawModule} from "@/views/references/materials/service";
import dbSchemaService from "@/services/db_schema_service";
import {InvoiceModule} from "@/views/warehouse/invoice/service";
import { RemainsModule, table_name } from './service'

@Component({
  name: 'Remains',
  components: {
    TableGrid
  }
})

export default class extends Vue {
  public state = RemainsModule
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
      }
    },
    {
      dataField: 'invoice_id',
      dataType: 'string',
      caption: 'Номер накладной',
      lookup: {
        allowClearing: true,
        dataSource: InvoiceModule.dataSource.store(),
        valueExpr: 'id',
        displayExpr: 'number'
      }
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
  ]
    public emptyEntity: any = {};

  created() {
    this.initColumns()
  }

  initColumns() {
    const included = ['id', 'raw_id', 'invoice_id', 'price', 'quantity'];

    [this.columns, this.emptyEntity] = dbSchemaService.prepareGridColumns(
      table_name, included)
  }

  onRowClick() {

  }

  empty() {

  }

}
</script>
