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
      :grouping-enabled="true"
      :columns="columns"
      :filter-sync-enabled="true"
      :row-click="onRowClick"
      :dbl-row-click="onRowDblClick"
    />
    <OrderEditPopup/>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { OrdersModule } from './service'
import {StaffModule} from "@/views/references/staff/service";
import {ProductsModule} from "@/views/references/products/service";
import {RawModule} from "@/views/references/materials/service";
import OrderEditPopup from './components/order-edit-popup.vue'
import TableGrid from '@/components/TableGrid/grid.vue'
import TableActions from '@/components/TableActions/actions.vue'
import { confirm } from 'devextreme/ui/dialog'
import {AxiosResponse} from "axios";

@Component({
  name: 'Orders',
  components: {
    TableGrid,
    TableActions,
    OrderEditPopup
  }
})
export default class extends Vue {
  public state = OrdersModule
  public dataSource = this.state.dataSource
  private staffState = StaffModule;
  private productState = ProductsModule;
  private rawState = RawModule;
  public columns: Array<any> = [];

  initColumns() {
    this.columns = [
      {
        dataField: 'id',
        dataType: 'string',
        visible: false,
      },
      {
        dataType: 'number',
        caption: 'Номер',
        dataField: 'order_number'
      },
      {
        dataField: 'date_created',
        dataType: 'datetime',
        caption: 'Дата принятия заказа'
      },
      {
        dataField: 'date_of_order',
        dataType: 'datetime',
        caption: 'Дата заказа'
      },
      {
        dataField: 'created_by_id',
        dataType: 'string',
        caption: 'Принял',
        lookup: {
          dataSource: this.staffState.dataSource.store(),
          valueExpr: 'id',
          displayExpr: 'full_name'
        }
      },
      {
        dataField: 'make_by_id',
        dataType: 'string',
        caption: 'Выполнил',
        lookup: {
          dataSource: this.staffState.dataSource.store(),
          valueExpr: 'id',
          displayExpr: 'full_name'
        }
      },
      {
        dataType: 'string',
        caption: 'Клиент',
        cellTemplate: 'order-client-cell-template'
      },
      {
        dataType: 'string',
        caption: 'Доставка',
        cellTemplate: 'order-delivery-cell-template'
      },
      {
        dataType: 'object',
        caption: 'Заказ',
        cellTemplate: 'order-products-cell-template'
      },
    ]
  }

  mounted() {
    this.initColumns()
  }

  setClientValue(rowData: any) {
    return rowData.client.name + '\n' + rowData.client.phone
  }

  setDeliveryValue(rowData: any) {
    if (rowData.delivery) {
      return 'Доставка' + '\n' + rowData.client.address.street + ', '
        + rowData.client.address.house + ', ' + rowData.client.address.entrance + ', '
        + rowData.client.address.floor + ', ' + rowData.client.address.flat
    } else {
      return 'Самовывоз'
    }
  }

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
