<template>
  <div class="app-container">
    <h4>Клиенты</h4>
    <table-actions
      :on-create-new="onCreateNew"
      :on-edit="onEdit"
      :on-delete="onDelete"
      :on-grid-refresh="onGridRefresh"
      :selected="state.currentRow.id"
      :one-to-one-complete="true"
    />
    <table-grid
      ref="tablegrid"
      :data-source="dataSource"
      :columns="columns"
      :row-click="onRowClick"
      :dbl-row-click="onRowDblClick"
      start-edit-action="dblClick"
    />
    <client-popup-edit />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {ClientModule, table_name } from './service'
import TableGrid from '@/components/TableGrid/grid.vue'
import ClientPopupEdit from './components/edit-popup.vue'
import dbSchemaService from '@/services/db_schema_service'
import TableActions from '@/components/TableActions/actions.vue'
import { confirm } from 'devextreme/ui/dialog'

@Component({
  name: 'Clients',
  components: {
    TableGrid,
    TableActions,
    ClientPopupEdit
  }
})
export default class extends Vue {
  public state = ClientModule;
  public dataSource = this.state.dataSource;
  public columns: Array<any> = [];
  public emptyEntity: any = {};

  created() {
    this.initColumns()
    this.state.ResetCurrentRow()
    this.state.dataSource.reload()
  }

  get viewMode(): boolean {
    return this.$route.name === 'client_new'
  }

  initColumns() {
    const included = ['name', 'phone', 'address', 'discount', 'comment'];

    [this.columns, this.emptyEntity] = dbSchemaService.prepareGridColumns(
      table_name, included)
  }

  onCreateNew() {
    this.state.SetEditTitle('Создание нового клиента')
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
    // const grid = (this.$refs.tableGrid as any);
    // const selected = grid.getSelectedData();
    // if (!_.isNil(selected)) {
    //   this.state.SetCurrentRow(selected[0]);
    // }
    this.state.SetEditMode(true)
    this.state.SetEditTitle('Редактирование информации о клиенте')
    this.state.SetEditVisible(true)
  }

  onDelete() {
    confirm('Удалить выбранного клиента?', 'Удаление клиента')
      .then(async(answer: boolean) => {
        if (!answer) {
          return
        }
        try {
          await this.state.crud.delete(this.state.currentRow.id)
          this.state.dataSource.reload()
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
