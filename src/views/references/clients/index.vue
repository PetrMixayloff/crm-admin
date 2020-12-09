<template>
  <div class="app-container">
    <h4>Клиенты</h4>
    <table-grid
      ref="clientsTableGrid"
      :data-source="dataSource"
      :columns="columns"
      :row-click="onRowClick"
      :dbl-row-click="onRowDblClick"
      :master-detail-enable="true"
    >
      <template #masterDetailTemplate="{rowKey, rowData}">
        <table-grid
          :data-source="rowData.orders"
          :columns="ordersColumns"
          :row-click="empty"
          :dbl-row-click="empty"
          selection-mode="single"
        />
      </template>
    </table-grid>
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
  public ordersColumns = [
  {
    dataField: 'id',
    dataType: 'string',
    visible: false
  },
  {
    dataField: 'total_cost',
    dataType: 'number',
    caption: 'Сумма заказа',
  },
  {
    dataField: 'prepay',
    dataType: 'number',
    caption: 'Предоплата'
  },
  {
    dataField: 'prepay_type',
    dataType: 'string',
    caption: 'Тип внесения предоплаты'
  },
  {
    dataField: 'amount',
    dataType: 'number',
    caption: 'К оплате с учетом предоплаты'
  },
  {
    dataField: 'amount_type',
    dataType: 'string',
    caption: 'Тип внесения оплаты'
  },
  {
    dataField: 'discount',
    dataType: 'number',
    caption: 'Скидка'
  },
  {
    dataField: 'rating',
    dataType: 'number',
    caption: 'Оценка от клиента'
  },
  {
    dataField: 'status',
    dataType: 'string',
    caption: 'Статус'
  },
  {
    dataField: 'date_created',
    dataType: 'string',
    caption: 'Дата создания заказа'
  },
  {
    dataField: 'date_of_order',
    dataType: 'string',
    caption: 'Дата выполнения заказа'
  },
]
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

  empty() {

  }

  onRowDblClick(e: any) {
    this.state.SetCurrentRow(e.data)
  }
}
</script>
