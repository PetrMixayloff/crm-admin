<template>
  <div class="app-container">
    <table-actions
      :on-create-new="createNewRawUsageStandards"
      :on-edit="editRawUsageStandards"
      :on-delete="deleteRawUsageStandards"
      table-title="Стандарты сырья"
      :selected="state.currentStandards.id"
    />
    <table-grid
      ref="rawusagestandardsTableGrid"
      :data-source="dataSource"
      :columns="columns"
      :row-click="onRowClick"
      :dbl-row-click="onRowDblClick"
    >
    </table-grid>
    <StandardsEditPopup/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { table_name, RawUsageStandardsModule } from './service'
import TableGrid from '@/components/TableGrid/grid.vue'
import dbSchemaService from '@/services/db_schema_service'
import TableActions from "@/components/TableActions/actions.vue";
import StandardsEditPopup from "./components/standards-edit.vue"
import {RawModule} from "@/views/references/materials/service";

@Component({
  name: 'rawusagestandards',
  components: {
    TableGrid,
    TableActions,
    StandardsEditPopup
  }
})

export default class extends Vue {
  public state = RawUsageStandardsModule;
  public dataSource = this.state.dataSource;
  public columns: Array<any> = [];
  public recordsColumns = [
  {
    dataField: 'id',
    dataType: 'string',
    visible: false
  },
  {
    dataField: 'raw_id',
    dataType: 'string',
    caption: 'Сырье',
    lookup: {
      allowClearing: true,
      dataSource: RawModule.rawDataSource.store(),
      valueExpr: 'id',
      displayExpr: 'name'
    },
    validationRules: [{type: 'required'}]
  },
  {
    dataField: 'name',
    dataType: 'string',
    caption: 'Название стандарта',
    validationRules: [{type: 'required'}]
  },
  {
    dataField: 'quantity',
    dataType: 'number',
    caption: 'Количество сырья на ед. стандарта',
    validationRules: [{type: 'required'}]
  },
]
  public emptyEntity: any = {};
  public validationRules: any = {
    name: [
      {type: 'required', message: 'Название сырья не задано'}
    ],
    quantity: [
      {type: 'required', message: 'Количество сырья на ед. стандарта не задано'}
    ],
    raw_id: [
      {type: 'required', message: 'Сырье не задано'}
    ]
  }

  created() {
    this.initColumns()
    this.state.ResetCurrentRow()
    this.state.dataSource.reload()
  }

  initColumns() {
    const included = ['raw_id', 'name', 'quantity'];

    [this.columns, this.emptyEntity] = dbSchemaService.prepareGridColumns(
      table_name, included)
  }

  onRowClick(e: any) {
    this.state.SetCurrentRow(e.data)
  }

  onRowDblClick(e: any) {
  this.state.SetCurrentRow(e.data)
  }


  empty() {

  }

  createNewRawUsageStandards() {
    this.state.SetEditVisible(true)
  }

  editRawUsageStandards() {

  }

  deleteRawUsageStandards() {
    confirm('Удалить выбранный стандарт?', 'Удаление стандарта')
      .then(async (answer: boolean) => {
        if (!answer) {
          return
        }
        try {
          await this.state.crudStandards.delete(this.state.currentStandards.id)
          await this.state.dataSource.reload()
          this.state.ResetCurrentRow()
        } catch (e) {
          console.log(e)
        }
      })
  }
}
</script>

