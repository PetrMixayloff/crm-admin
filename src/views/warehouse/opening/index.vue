<template>
  <div class="app-container">
    <table-grid
      :data-source="state.dataSource"
      :columns="columns"
      :row-click="empty"
      :dbl-row-click="empty"
      selection-mode="single"
    >
    </table-grid>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import TableGrid from '@/components/TableGrid/grid.vue'
import {OpeningModule} from './service'
import {RawModule} from '@/views/references/materials/service';

@Component({
  name: 'Opening',
  components: {
    TableGrid
  }
})
export default class extends Vue {
  public state = OpeningModule
  public columns: any[] = [
    {
      dataField: 'id',
      dataType: 'string',
      visible: false
    },
    {
      dataField: 'number',
      dataType: 'number',
      allowSorting: false,
      caption: 'Номер'
    },
    {
      dataField: 'date',
      dataType: 'date',
      caption: 'Дата'
    },
    {
      dataField: 'raw_id',
      dataType: 'string',
      allowSorting: false,
      caption: 'Сырье',
      lookup: {
        allowClearing: true,
        dataSource: RawModule.rawDataSource.store(),
        valueExpr: 'id',
        displayExpr: 'name'
      }
    },
    {
      dataField: 'remark',
      dataType: 'string',
      allowSorting: false,
      caption: 'Примчание'
    }
  ]

  created() {
  }

  empty() {
  }
}
</script>
