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
      :column-chooser-enable="true"
      :columns="columns"
      :filter-sync-enabled="true"
      :row-click="onRowClick"
      :dbl-row-click="onRowDblClick"
      @status-changed="onStatusChanged"
    />
    <OrderEditPopup />
    <AmountPopup />
  </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator'
import {OrdersModule, Order} from './service'
import {StaffModule} from "@/views/references/staff/service";
import {ProductsModule} from "@/views/references/products/service";
import {RawModule} from "@/views/references/materials/service";
import OrderEditPopup from './components/order-edit-popup.vue'
import AmountPopup from './components/amount-popup.vue'
import TableGrid from '@/components/TableGrid/grid.vue'
import TableActions from '@/components/TableActions/actions.vue'
import {orderStatus} from '@/const'
import {confirm} from 'devextreme/ui/dialog'
import {DxPopup} from 'devextreme-vue'

@Component({
  name: 'Orders',
  components: {
    TableGrid,
    TableActions,
    OrderEditPopup,
    DxPopup,
    AmountPopup
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
        allowHiding: false
      },
      {
        dataType: 'number',
        caption: 'Номер',
        dataField: 'order_number',
        visible: false
      },
      {
        dataField: 'date_created',
        dataType: 'date',
        caption: 'Дата принятия заказа',
        visible: false
      },
      {
        dataField: 'date_of_order',
        dataType: 'date',
        caption: 'Дата заказа',
        allowHiding: false,
        minWidth: 90
      },
      {
        caption: 'Время',
        dataType: 'string',
        calculateCellValue: this.getOrderTime,
        allowHiding: false,
        minWidth: 60
      },
      {
        dataField: 'created_by_id',
        dataType: 'string',
        caption: 'Принял',
        lookup: {
          dataSource: this.staffState.dataSource.store(),
          valueExpr: 'id',
          displayExpr: 'full_name'
        },
        visible: false
      },
      {
        dataField: 'make_by_id',
        dataType: 'string',
        caption: 'Выполнил',
        lookup: {
          dataSource: this.staffState.dataSource.store(),
          valueExpr: 'id',
          displayExpr: 'full_name'
        },
        visible: false
      },
      {
        dataField: 'client.phone',
        dataType: 'string',
        caption: 'Клиент',
        cellTemplate: 'order-client-cell-template',
        allowHiding: false
      },
      {
        dataType: 'string',
        caption: 'Доставка',
        cellTemplate: 'order-delivery-cell-template',
        allowHiding: false
      },
      {
        dataType: 'object',
        caption: 'Заказ',
        cellTemplate: 'order-products-cell-template'
      },
      {
        dataType: 'object',
        caption: 'Сумма',
        cellTemplate: 'order-cost-cell-template'
      },
      {
        caption: "Статус",
        cellTemplate: 'order-status-cell-template',
        allowHiding: false,
        fixed: true,
        fixedPosition: 'right',
        minWidth: 150
      }
    ]
  }

  async onStatusChanged(args: any[]) {
    let data: Order;
    let e: any;
    [e, data] = [...args]
    if (data.status === 'Выполнен' && data.amount !== 0) {
      this.state.SetCurrentRow(data)
      this.state.SetAmountVisible(true)
    } else {
      await this.state.crud.save(data);
      await this.state.dataSource.reload()
    }
  }

  getOrderTime(rowData: any) {
    return new Date(rowData.date_of_order).toLocaleTimeString().substring(0, 5)
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
      .then(async (answer: boolean) => {
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
