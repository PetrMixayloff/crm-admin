<template>
  <div class="app-container">
    <h4>Клиенты</h4>
    <table-grid
      ref="clientsTableGrid"
      :data-source="dataSource"
      :columns="columns"
      :row-click="onRowClick"
      :dbl-row-click="onRowDblClick"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { table_name, Clients } from './service'
import TableGrid from '@/components/TableGrid/grid.vue'
import dbSchemaService from '@/services/db_schema_service'

@Component({
  name: 'Clients',
  components: {
    TableGrid
  }
})
export default class extends Vue {
  public state = Clients;
  public dataSource = this.state.dataSource;
  public columns: Array<any> = [];
  public emptyEntity: any = {};

  created() {
    this.initColumns()
    this.state.ResetCurrentRow()
    this.state.dataSource.reload()
  }

  initColumns() {
    const included = ['name', 'phone', 'address', 'discount', 'comment'];

    [this.columns, this.emptyEntity] = dbSchemaService.prepareGridColumns(
      table_name, included)
  }

  onRowClick(e: any) {
    this.state.SetCurrentRow(e.data)
  }

  onRowDblClick(e: any) {
    this.state.SetCurrentRow(e.data)
  }
}
</script>
