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
        <table-grid
          :data-source="rowData.records"
          :columns="recordsColumns"
          :row-click="empty"
          :dbl-row-click="empty"
          selection-mode="single"
        />
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

@Component({
  name: 'Inventory',
  components: {
    TableGrid,
    TableActions,
    InventoryEditPopup
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
        caption: 'Номер'
      },
      {
        dataField: 'date',
        dataType: 'date',
        caption: 'Дата'
      },
      {
        dataField: 'remark',
        dataType: 'string',
        caption: 'Примечание'
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
        }
      },
      {
        dataField: 'quantity',
        dataType: 'number',
        caption: 'Фактический остаток'
      },
      {
        dataField: 'old_quantity',
        dataType: 'number',
        caption: 'Остаток по программе'
      },
      {
        caption: 'Разница',
        calculateCellValue: this.calculateDifference
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
