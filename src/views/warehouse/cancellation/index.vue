<template>
  <div class="app-container">
    <table-actions
      :on-create-new="createNewCancellation"
      :on-edit="editCancellation"
      :on-delete="deleteCancellation"
      table-title="Списание"
      :selected="state.currentCancellation.id"
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
    <CancellationEditPopup/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TableGrid from '@/components/TableGrid/grid.vue'
import TableActions from '@/components/TableActions/actions.vue'
import { CancellationModule, table_name } from "./service";
import dbSchemaService from '@/services/db_schema_service'
import { RawModule } from "@/views/references/materials/service";
import CancellationEditPopup from './components/cancellation-edit.vue'

@Component({
  name: 'Cancellation',
  components: {
    TableGrid,
    TableActions,
    CancellationEditPopup
  }
})
export default class extends Vue {
  public state = CancellationModule
  public columns: any[] = []
  public recordsColumns = [
    {
      dataField: 'id',
      dataType: 'string',
      visible: false
    },
    {
      dataField: 'raw_remains_detail.raw_id',
      dataType: 'string',
      caption: 'Название',
      lookup: {
        allowClearing: true,
        dataSource: RawModule.rawDataSource.store(),
        valueExpr: 'id',
        displayExpr: 'name'
      }
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
    const included = ['id', 'number', 'date', 'supplier', 'remark'];

    [this.columns, this.emptyEntity] = dbSchemaService.prepareGridColumns(
      table_name, included)
  }

  onRowClick() {

  }

  empty() {

  }


  createNewCancellation() {
    this.state.SetEditVisible(true)
  }

  editCancellation() {

  }

  deleteCancellation() {

  }
}
</script>
