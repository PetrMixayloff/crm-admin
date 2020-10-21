<template>
  <div class="app-container">
    <h4>Сотрудники</h4>
    <table-grid
      ref="tablegrid"
      :data-source="dataSource"
      :columns="columns"
      :row-click="onRowClick"
      :dbl-row-click="onRowDblClick"
      :master-detail-enable="true"
      start-edit-action="dblClick"
      @cell-prepared="addClassToCell"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { StaffModule } from './service'
import TableGrid from '@/components/TableGrid/grid.vue'

@Component({
  name: 'Staff',
  components: {
    TableGrid
  }
})
export default class extends Vue {
  public state = StaffModule;
  public dataSource = this.state.dataSource;

  public transfer_entity = {};
  public columns: Array<any> = [];
  public empty_entity: any = {};

  created() {
    this.initColumns();
    this.state.ResetCurrentRow();
    this.state.dataSource.reload();
  }

  initColumns() {

    const included = ['name', 'note', 'date_created'];

    [this.columns, this.empty_entity] = dbSchemaService.prepareGridColumns(
      table_name, included);
  }

}
</script>
