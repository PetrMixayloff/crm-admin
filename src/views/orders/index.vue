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
      :column-chooser-enable="true"
      :stripped-columns="false"
      :columns="columns"
      :filter-sync-enabled="true"
      :row-click="onRowClick"
      :dbl-row-click="onRowDblClick"
      @status-changed="onStatusChanged"
      @row-prepared="colorizeGrid"
      :master-detail-enable="true"
    >
      <template #masterDetailTemplate="{rowKey, rowData}">
        <div>
          <div class="master-detail-caption"> Товары:</div>
          <dx-data-grid
            :data-source="rowData.products"
            :allow-column-resizing="true"
            :row-alternation-enabled="true"
            :show-borders="true"
            :show-column-lines="true"
            :show-row-lines="true"
            :columns="productColumns"
            :height="300"
            @row-click="empty"
            @row-dbl-click="empty"
          >
            <dx-load-panel
              :enabled="true"
            />
            <template #image-template="{data}">
              <img
                :src="src(data.value)"
                alt="Товар"
                width="50px"
              >
            </template>
          </dx-data-grid>
        </div>

      </template>
    </table-grid>
    <OrderEditPopup/>
    <AmountPopup/>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator'
import {OrdersModule, Order, OrderProductRaw} from './service'
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
import {
  DxDataGrid,
  DxLoadPanel
} from 'devextreme-vue/data-grid'

@Component({
  name: 'Orders',
  components: {
    TableGrid,
    TableActions,
    OrderEditPopup,
    DxPopup,
    AmountPopup,
    DxDataGrid,
    DxLoadPanel
  }
})
export default class extends Vue {
  public state = OrdersModule
  public dataSource = this.state.dataSource
  private staffState = StaffModule;
  public columns: Array<any> = [
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
      visible: false,
      allowSorting: false
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
      filterValue: new Date,
      selectedFilterOperation: ">=",
      sortOrder: 'asc',
      minWidth: 140,
      width: 150
    },
    {
      caption: 'Время',
      dataType: 'string',
      calculateCellValue: this.getOrderTime,
      allowHiding: false,
      minWidth: 60,
      width: 80
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
      visible: false,
      allowSorting: false
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
      visible: false,
      allowSorting: false
    },
    {
      caption: 'Клиент',
      alignment: "center",
      allowHiding: false,
      columns: [
        {
          dataField: 'client.name',
          dataType: 'string',
          caption: 'Имя',
          allowHiding: false,
          allowSorting: false,
          minWidth: 100,
          width: 120
        },
        {
          dataField: 'client.phone',
          dataType: 'string',
          caption: 'Телефон',
          allowHiding: false,
          allowSorting: false,
          minWidth: 140,
          width: 150
        }
      ]
    },
    {
      dataField: 'delivery',
      dataType: 'boolean',
      caption: 'Доставка',
      cellTemplate: 'order-delivery-cell-template',
      allowHiding: false,
      allowSorting: false,
      falseText: 'Самовывоз',
      trueText: 'Доставка',
      hidingPriority: 0
    },
    {
      dataField: 'courier_id',
      dataType: 'string',
      caption: 'Курьер',
      lookup: {
        dataSource: this.staffState.dataSource.store(),
        valueExpr: 'id',
        displayExpr: 'full_name'
      },
      allowSorting: false
    },
    {
      dataField: 'total_cost',
      dataType: 'number',
      caption: 'Сумма',
      cellTemplate: 'order-cost-cell-template',
      allowSorting: false,
      allowFiltering: true,
      hidingPriority: 1
    },
    {
      caption: "Статус",
      dataField: "status",
      dataType: "string",
      cellTemplate: 'order-status-cell-template',
      allowHiding: false,
      lookup: {
        dataSource: orderStatus,
        valueExpr: 'name',
        displayExpr: 'name'
      },
      width: 170,
      minWidth: 150,
      allowSorting: false,
      allowFiltering: true
    }
  ];
  public productColumns: Array<any> = [
    {
      dataField: 'id',
      dataType: 'string',
      visible: false
    },
    {
      dataField: 'product_id',
      dataType: 'string',
      visible: false
    },
    {
      dataField: 'image',
      dataType: 'string',
      minWidth: 100,
      width: 100,
      caption: "Изображение",
      alignment: "center",
      cellTemplate: 'image-template',
      allowSorting: false
    },
    {
      dataField: 'name',
      dataType: 'string',
      caption: "Название",
      allowSorting: false
    },
    {
      dataField: 'quantity',
      dataType: 'number',
      caption: "Количество",
      alignment: "center",
      minWidth: 100,
      width: 100,
      allowSorting: false
    }
  ];


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

  empty() {

  }

  src(data: any) {
    if (!data) {
      return require('@/assets/defaults/default_baloon.png')
    }
    return `https://baloon-crm.s3-eu-west-1.amazonaws.com/${data}`
  }

  getOrderTime(rowData: any) {
    return new Date(rowData.date_of_order).toLocaleTimeString().substring(0, 5)
  }

  mounted() {

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

  colorizeGrid(e: any) {
    if (e.rowType === 'data') {
      switch ((e.data as Order).status) {
        case "Новый":
          e.rowElement.style.backgroundColor = 'rgba(0,241,10,0.3)';
          break;
        case "Подготовлен":
          e.rowElement.style.backgroundColor = 'rgba(255,110,0, 0.5)';
          break;
        case "На доставке":
          e.rowElement.style.backgroundColor = 'rgba(0,0,255,0.5)';
          break;
        case "Выполнен":
          e.rowElement.style.backgroundColor = 'rgba(255,0,0,0.5)';
          break;
        case "Отменен":
          e.rowElement.style.backgroundColor = 'rgba(100,80,100,0.2)';
      }
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

<style lang="scss" scoped>
.master-detail-caption {
  padding: 0 0 5px 10px;
  font-size: 14px;
  font-weight: bold;
}
</style>
