<template>
  <div class="app-container">
    <table-actions
      :on-create-new="createNewCancellation"
      :on-edit="empty"
      :on-delete="empty"
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
        <div>
          <h4> Список позиций:</h4>
          <dx-data-grid
            :data-source="rowData.records"
            :allow-column-resizing="true"
            :row-alternation-enabled="true"
            :show-borders="true"
            :show-column-lines="true"
            :show-row-lines="true"
            :columns="recordsColumns"
            :height="400"
            @row-click="empty"
            @row-dbl-click="empty"
          >
            <dx-load-panel
              :enabled="true"
            />
          </dx-data-grid>
        </div>
      </template>
    </table-grid>
    <CancellationEditPopup/>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import TableGrid from '@/components/TableGrid/grid.vue'
import TableActions from '@/components/TableActions/actions.vue'
import {CancellationModule} from "./service";
import {RawModule} from "@/views/references/materials/service";
import CancellationEditPopup from './components/cancellation-edit.vue'
import {
  DxDataGrid,
  DxLoadPanel
} from 'devextreme-vue/data-grid'

@Component({
  name: 'Cancellation',
  components: {
    TableGrid,
    TableActions,
    CancellationEditPopup,
    DxDataGrid,
    DxLoadPanel
  }
})
export default class extends Vue {
  public state = CancellationModule
  public columns: any[] = [
    {
      dataField: 'id',
      dataType: 'string',
      visible: false
    },
    {
      dataField: 'number',
      dataType: 'string',
      caption: "Номер",
      allowSorting: false
    },
    {
      dataField: 'date',
      dataType: 'date',
      caption: "Дата"
    },
    {
      dataField: 'remark',
      dataType: 'string',
      caption: "Примечание",
      allowSorting: false
    }
  ]
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

  created() {
  }

  onRowClick() {
  }

  empty() {
  }

  createNewCancellation() {
    this.state.SetEditVisible(true)
  }

}
</script>
