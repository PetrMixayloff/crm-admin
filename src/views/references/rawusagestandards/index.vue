<template>
  <div class="app-container">
    <table-actions
      :on-create-new="createNewRawUsageStandards"
      :on-edit="editRawUsageStandards"
      :on-delete="deleteRawUsageStandards"
      table-title="Стандарты сырья"
      :selected="state.currentStandards.id"
    />
    <table-grid
      ref="rawusagestandardsTableGrid"
      :data-source="dataSource"
      :columns="columns"
      :row-click="onRowClick"
      :dbl-row-click="onRowDblClick"
    >
    </table-grid>
    <StandardsEditPopup/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { table_name, RawUsageStandardsModule } from './service'
import TableGrid from '@/components/TableGrid/grid.vue'
import dbSchemaService from '@/services/db_schema_service'
import TableActions from "@/components/TableActions/actions.vue";
import StandardsEditPopup from "./components/standards-edit.vue"
import {RawModule} from "@/views/references/materials/service";

@Component({
  name: 'rawusagestandards',
  components: {
    TableGrid,
    TableActions,
    StandardsEditPopup
  }
})

export default class extends Vue {
  public state = RawUsageStandardsModule;
  public dataSource = this.state.dataSource;
  public columns: Array<any> = [];
  public recordsColumns = [
  {
    dataField: 'id',
    dataType: 'string',
    visible: false
  },
  {
    dataField: 'raw_id',
    dataType: 'string',
    caption: 'Сырье',
    lookup: {
      allowClearing: true,
      dataSource: RawModule.rawDataSource.store(),
      valueExpr: 'id',
      displayExpr: 'name'
    },
    validationRules: [{type: 'required'}]
  },
  {
    dataField: 'name',
    dataType: 'string',
    caption: 'Название стандарта'
  },
  {
    dataField: 'quantity',
    dataType: 'number',
    caption: 'Количество сырья на ед. стандарта'
  },
]
  public emptyEntity: any = {};

  created() {
    this.initColumns()
    this.state.ResetCurrentRow()
    this.state.dataSource.reload()
  }

  initColumns() {
    const included = ['raw_id', 'name', 'quantity'];

    [this.columns, this.emptyEntity] = dbSchemaService.prepareGridColumns(
      table_name, included)
  }

  onRowClick(e: any) {
    this.state.SetCurrentRow(e.data)
  }

  onRowDblClick(e: any) {
  this.state.SetCurrentRow(e.data)
  }


  empty() {

  }

  createNewRawUsageStandards() {
    this.state.SetEditVisible(true)
  }

  editRawUsageStandards() {

  }

  deleteRawUsageStandards() {

  }
}
</script>

