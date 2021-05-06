<template>
  <div class="app-container">
    <div class="flex-r-c bottom20">
      <dx-button
        type="default"
        icon="plus"
        text="Создать"
        @click="createNewInvoice"
      />
    </div>

    <table-grid
      ref="tablegrid"
      :data-source="state.dataSource"
      :columns="columns"
      :row-click="onRowClick"
      :dbl-row-click="empty"
      selection-mode="single"
      :master-detail-enable="true"
    >
      <template #masterDetailTemplate="{rowKey, rowData}">
        <div>
          <h4> Список позиций:</h4>
          <dx-data-grid
            :data-source="rowData.records"
            :allow-column-resizing="true"
            :row-alternation-enabled="true"
            :show-borders="true"
            :show-column-lines="true"
            :show-row-lines="true"
            :columns="recordsColumns"
            :height="400"
            @row-click="empty"
            @row-dbl-click="empty"
          >
            <dx-load-panel
              :enabled="true"
            />
          </dx-data-grid>
        </div>
      </template>
    </table-grid>
    <InvoiceEditPopup/>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import TableGrid from '@/components/TableGrid/grid.vue'
import {InvoiceModule} from './service'
import InvoiceEditPopup from './components/invoice-edit.vue'
import {RawModule} from '@/views/references/materials/service';
import {DxButton} from 'devextreme-vue'
import {
  DxDataGrid,
  DxLoadPanel
} from 'devextreme-vue/data-grid'

@Component({
  name: 'Invoice',
  components: {
    TableGrid,
    DxButton,
    InvoiceEditPopup,
    DxDataGrid,
    DxLoadPanel
  }
})
export default class extends Vue {
  public state = InvoiceModule
  public columns: any[] = [
    {
      dataField: 'id',
      dataType: 'string',
      visible: false
    },
    {
      dataField: 'number',
      dataType: 'string',
      allowSorting: false,
      caption: 'Номер'
    },
    {
      dataField: 'date',
      dataType: 'date',
      caption: 'Дата'
    },
    {
      dataField: 'supplier',
      dataType: 'string',
      allowSorting: false,
      caption: 'Поставщик'
    },
    {
      dataField: 'payment_method',
      dataType: 'string',
      allowSorting: false,
      caption: 'Способ оплаты'
    },
    {
      dataField: 'remark',
      dataType: 'string',
      allowSorting: false,
      caption: 'Примчание'
    }
  ]
  public recordsColumns = [
    {
      dataField: 'id',
      dataType: 'string',
      visible: false
    },
    {
      dataField: 'raw_id',
      dataType: 'string',
      caption: 'Наименование',
      allowSorting: false,
      lookup: {
        allowClearing: true,
        dataSource: RawModule.rawDataSource.store(),
        valueExpr: 'id',
        displayExpr: 'name'
      },
      validationRules: [{type: 'required'}]
    },
    {
      dataField: 'price',
      dataType: 'number',
      allowSorting: false,
      caption: 'Цена за ед.',
      validationRules: [{type: 'required'}],
      width: 100
    },
    {
      dataField: 'quantity',
      dataType: 'number',
      caption: 'Кол-во',
      allowSorting: false,
      validationRules: [{type: 'required'}],
      width: 70
    },
    {
      dataField: 'total',
      dataType: 'number',
      caption: 'Сумма',
      allowSorting: false,
      calculateCellValue: this.calculateTotal,
      width: 70
    }
  ]

  created() {
  }

  onRowClick() {
  }

  empty() {
  }

  calculateTotal(e: any) {
    if (e.price && e.quantity) {
      return e.price * e.quantity
    }
    return ''
  }

  createNewInvoice() {
    this.state.SetEditVisible(true)
  }
}
</script>
