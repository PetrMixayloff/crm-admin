<template>
  <div class="app-container">
    <h4>Сотрудники</h4>
    <table-grid
      ref="tablegrid"
      :data-source="dataSource"
      :columns="columns"
      :row-click="onRowClick"
      :dbl-row-click="onRowDblClick"
      start-edit-action="dblClick"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { StaffModule, table_name } from './service'
import TableGrid from '@/components/TableGrid/grid.vue'
import dbSchemaService from '@/services/db_schema_service'

@Component({
  name: 'Staff',
  components: {
    TableGrid
  }
})
export default class extends Vue {
  public state = StaffModule;
  public dataSource = this.state.dataSource;

  public transferEntity = {};
  public columns: Array<any> = [];
  public emptyEntity: any = {};

  created() {
    this.initColumns()
    // this.state.ResetCurrentRow()
    // this.state.dataSource.reload()
  }

  initColumns() {
    const included = ['login', 'full_name', 'position', 'last_login'];

    [this.columns, this.emptyEntity] = dbSchemaService.prepareGridColumns(
      table_name, included)
  }

  onRowClick(e: any) {
  }

  onRowDblClick(e: any) {
  }
}
</script>
