<template>
  <div class="app-container">
    <h4>Заказы</h4>
    <table-actions
      :on-create-new="onCreateNew"
      :on-edit="onEdit"
      :on-delete="onDelete"
      :on-grid-refresh="onGridRefresh"
      :selected="state.currentRow.id"
      :one-to-one-complete="true"
    />
    <table-grid
      ref="ordersTableGrid"
      :data-source="dataSource"
      :columns="columns"
      :row-click="onRowClick"
      :dbl-row-click="onRowDblClick"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { OrdersModule } from './service'
import TableGrid from '@/components/TableGrid/grid.vue'
import TableActions from '@/components/TableActions/actions.vue'
import { confirm } from 'devextreme/ui/dialog'

@Component({
  name: 'Orders',
  components: {
    TableGrid,
    TableActions
  }
})
export default class extends Vue {
  public state = OrdersModule
  public dataSource = this.state.dataSource
  public columns: Array<any> = [];

  onCreateNew() {
    this.state.SetEditVisible(true)
  }

  onRowClick(e: any) {
    this.state.SetCurrentRow(e.data)
  }

  onRowDblClick(e: any) {
    this.state.SetCurrentRow(e.data)
    this.onEdit()
  }

  onEdit() {
    this.state.SetEditMode(true)
    this.state.SetEditVisible(true)
  }

  onDelete() {
    confirm('Удалить выбранный заказ?', 'Удаление заказа')
      .then(async(answer: boolean) => {
        if (!answer) {
          return
        }
        try {
          await this.state.crud.delete(this.state.currentRow.id)
          this.dataSource.reload()
          this.state.ResetCurrentRow()
        } catch (e) {
          console.log(e)
        }
      })
  }

  onGridRefresh() {
    this.dataSource.reload()
    this.state.ResetCurrentRow()
  }
}
</script>
