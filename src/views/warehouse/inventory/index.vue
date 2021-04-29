<template>
  <div class="app-container">
    <table-actions
      :on-create-new="createNewInventory"
      :on-edit="editInventory"
      :on-delete="deleteInventory"
      table-title="Инвентаризация"
      :selected="state.currentInventory.id"
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
    <InventoryEditPopup/>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import TableGrid from '@/components/TableGrid/grid.vue'
import TableActions from '@/components/TableActions/actions.vue'
import {InventoryModule} from './service'
import {RawModule} from "@/views/references/materials/service"
import InventoryEditPopup from './components/inventory-edit.vue'
import {
  DxDataGrid,
  DxLoadPanel
} from 'devextreme-vue/data-grid'

@Component({
  name: 'Inventory',
  components: {
    TableGrid,
    TableActions,
    InventoryEditPopup,
    DxDataGrid,
    DxLoadPanel
  }
})

export default class extends Vue {
  public state = InventoryModule
  public columns: any[] = []
  public recordsColumns: any[] = []

  created() {
    this.initColumns()
  }

  initColumns() {
    this.columns = [
      {
        dataField: 'id',
        dataType: 'string',
        visible: false
      },
      {
        dataField: 'number',
        dataType: 'string',
        caption: 'Номер',
        allowSorting: false
      },
      {
        dataField: 'date',
        dataType: 'date',
        caption: 'Дата'
      },
      {
        dataField: 'remark',
        dataType: 'string',
        caption: 'Примечание',
        allowSorting: false
      }
    ]
    this.recordsColumns = [
      {
        dataField: 'id',
        dataType: 'string',
        visible: false
      },
      {
        dataField: 'raw_id',
        dataType: 'string',
        caption: 'Название',
        lookup: {
          dataSource: RawModule.rawDataSource.store(),
          valueExpr: 'id',
          displayExpr: 'name'
        },
        allowSorting: false
      },
      {
        dataField: 'quantity',
        dataType: 'number',
        caption: 'Фактический остаток',
        allowSorting: false
      },
      {
        dataField: 'old_quantity',
        dataType: 'number',
        caption: 'Остаток по программе',
        allowSorting: false
      },
      {
        caption: 'Разница',
        calculateCellValue: this.calculateDifference,
        allowSorting: false
      }
    ]
  }

  calculateDifference(e: any) {
    if (e.quantity && e.old_quantity) {
      return e.old_quantity - e.quantity
    }
    return ''
  }

  onRowClick() {

  }

  empty() {

  }


  createNewInventory() {
    this.state.SetEditVisible(true)
  }

  editInventory() {

  }

  deleteInventory() {


  }
}
</script>
