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
import { Component, Vue } from 'vue-property-decorator'
import TableGrid from '@/components/TableGrid/grid.vue'
import TableActions from '@/components/TableActions/actions.vue'
import { InventoryModule, table_name } from './service'
import dbSchemaService from '@/services/db_schema_service'
import { RawModule } from "@/views/references/materials/service"
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
    }
  ]

  public emptyEntity: any = {};

  created() {
    this.initColumns()
  }

  initColumns() {
    this.columns = [
    {
      dataField: 'id',
      visible: false
    },
    {
      dataField: 'category_id',
      visible: false
    },
    {
      dataField: 'image',
      caption: 'Изображение',
      allowFiltering: false,
      cellTemplate: 'image-cell-template'
    },
    {
      dataField: 'name',
      caption: 'Название'
    },
    {
      dataField: 'unit',
      caption: 'Ед. изм.'
    },
    {
      caption: 'Общее количество'
    },
    {
      caption: 'В резерве'
    },
    {
      caption: 'Стоимость остатка'
    }
  ]
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
