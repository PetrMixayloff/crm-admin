<template>
  <d-edit-popup
    :title="state.editMode ? 'Изменение данных о заказе' : 'Создание нового заказа'"
    default-width="700"
    default-height="900"
    :visible="state.editVisible"
    validation-group="orderEntity"
    @hidden="onClose"
    @ok="onOk"
    @cancel="onClose"
    @shown="onShow"
  >
    <div id="form-container">
      <dx-tabs
        :data-source="tabsArray"
        :selected-index.sync="tabIndex"
      />
      <DxForm
        v-show="tabIndex === 0"
        :form-data.sync="entity"
        :show-validation-summary="true"
        validation-group="orderEntity"
      >
        <DxItem
          data-field="date_of_order"
          :label="{text: 'Дата заказа'}"
          editor-type="dxDateBox"
          :editor-options="{
            type: 'datetime',
            openOnFieldClick: true}"
          :is-required="true"
        />
        <DxItem
          data-field="delivery"
          :label="{text: 'Доставка'}"
          editor-type="dxRadioGroup"
          :editor-options="{
            layout: 'horizontal',
            dataSource: [{text: 'Доставка', value: true}, {text: 'Самовывоз',value: false}],
            valueExpr: 'value', displayExpr: 'text'}"
        />
        <DxItem
          data-field="courier_id"
          :label="{text: 'Курьер'}"
          editor-type="dxSelectBox"
          :editor-options="{
              showClearButton: true,
              value: entity.courier_id,
              dataSource: staffState.dataSource,
              valueExpr: 'id',
              displayExpr: 'full_name'
            }"
        />
        <DxItem
          data-field="prepay"
          :label="{text: 'Предоплата'}"
          editor-type="dxNumberBox"
          :editor-options="{
              value: entity.prepay,
              min: 0
            }"
        />
        <DxItem
          data-field="prepay_type"
          :label="{text: 'Способ предоплаты'}"
          editor-type="dxSelectBox"
          :editor-options="{
              showClearButton: true,
              value: entity.prepay_type,
              dataSource: paymentMethod,
              valueExpr: 'name',
              displayExpr: 'name'
            }"
        />
        <DxItem
          data-field="remark"
          :label="{text: 'Примечание к заказу'}"
          editor-type="dxTextArea"
        />

      </DxForm>
      <DxForm
        v-show="tabIndex === 1"
        :form-data.sync="entity"
        :show-validation-summary="true"
        validation-group="orderEntity"
      >
        <DxItem
          data-field="client.phone"
          :label="{text: 'Номер телефона'}"
          :editorOptions="{
          mask: '+7 (000) 000-00-00',
          useMaskedValue: true
          }"
          :is-required="true"
        />
        <DxItem
          data-field="client.name"
          :label="{text: 'Имя'}"
          :is-required="true"
        />
        <DxItem
          data-field="client.street"
          :label="{text: 'Улица/мкрн'}"
        />
        <DxItem
          data-field="client.entrance"
          :label="{text: 'Подъезд'}"
        />
        <DxItem
          data-field="client.floor"
          :label="{text: 'Этаж'}"
        />
        <DxItem
          data-field="client.flat"
          :label="{text: 'Квартира/офис'}"
        />
        <DxItem
          data-field="reason"
          :label="{text: 'Повод'}"
          editor-type="dxSelectBox"
          :editor-options="{
              showClearButton: true,
              value: entity.reason,
              dataSource: reasons,
              valueExpr: 'id',
              displayExpr: 'name'
            }"
        />
        <DxItem
          data-field="sales_channel"
          :label="{text: 'Канал продаж'}"
          editor-type="dxSelectBox"
          :editor-options="{
              showClearButton: true,
              value: entity.sales_channel,
              dataSource: salesChannel,
              valueExpr: 'id',
              displayExpr: 'name'
            }"
        />
      </DxForm>
      <table-grid
        v-show="tabIndex === 2"
        ref="orderEditTableGrid"
        :data-source="entity.products"
        :columns="productColumns"
        :allow-editing="true"
        :filter-row-visible="false"
        editing-mode="batch"
        :row-click="empty"
        :dbl-row-click="empty"
        :master-detail-enable="true"
        selection-mode="single"
      >
        <template #masterDetailTemplate="{rowKey, rowData}">
          <table-grid
            :data-source="rowData.raw"
            :columns="rawColumns"
            :row-click="empty"
            :dbl-row-click="empty"
            :allow-editing="true"
            editing-mode="raw"
            :filter-row-visible="false"
            selection-mode="single"
          />
        </template>
      </table-grid>
    </div>
    <template v-slot:prefooter>
      <div class="prefooter">
        <div class="flex-r-c field">
          <span>Стоимость доставки:</span>
          <DxNumberBox
            :min="0"
            :value.sync="entity.delivery_cost"
            :width="100"
          />
          <span>руб</span>
        </div>
        <div class="flex-r-c field">
          <span>Стоимость монтажа:</span>
          <DxNumberBox
            :min="0"
            :value.sync="entity.decoration_cost"
            :width="100"
          />
          <span>руб</span>
        </div>
        <div class="flex-r-c field">
          <span>Итого {{ totalCost }} руб</span>
        </div>
        <div class="flex-r-c field">
          <span>Скидка:</span>
          <DxNumberBox
            :min="0"
            :value.sync="entity.discount"
            :width="100"
          />
          <span>руб</span>
        </div>
        <div class="flex-r-c field">
          <span>Предоплата {{ entity.prepay }} руб</span>
        </div>
        <div class="flex-r-c" style="padding: 0">
          <span>Всего к доплате {{ amountCost }} руб</span>
        </div>
      </div>
    </template>
  </d-edit-popup>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import {DxForm, DxItem, DxGroupItem, DxTabbedItem, DxTab} from 'devextreme-vue/form'
import DxTabs from 'devextreme-vue/tabs';
import {DxNumberBox} from "devextreme-vue";
import DEditPopup from '@/components/DEditPopup/editpopup.vue'
import {OrdersModule, Order, OrderProduct} from '../service'
import {StaffModule} from "@/views/references/staff/service";
import {ProductsModule} from "@/views/references/products/service";
import {RawModule} from "@/views/references/materials/service";
import _ from 'lodash'
import TableGrid from '@/components/TableGrid/grid.vue'
import {Reasons, SalesChannel, PaymentMethod} from "@/const";
import request from '@/utils/request'
import axios, {AxiosResponse} from 'axios'
import dbSchemaService from "@/services/db_schema_service";
import {table_name} from "@/views/references/products/service";

@Component({
  name: 'OrderEditPopup',
  components: {
    DxForm,
    DxItem,
    DxGroupItem,
    DxTabbedItem,
    DxTab,
    DxTabs,
    DxNumberBox,
    DEditPopup,
    TableGrid
  }
})
export default class extends Vue {
  private entity: Order = new Order();
  private state = OrdersModule;
  private staffState = StaffModule;
  private productState = ProductsModule;
  private rawState = RawModule;
  private productColumns: any[] = []
  private rawColumns: any[] = []
  public reasons = Reasons
  public salesChannel = SalesChannel
  public paymentMethod = PaymentMethod

  public validationRules: any = {}

  public tabsArray = [
    {
      key: 'details',
      text: 'Детали заказа'
    },
    {
      key: 'client',
      text: 'Получатель заказа'
    },
    {
      key: 'order',
      text: 'Заказ'
    }
  ]
  public tabIndex = 0

  async created() {
  }

  empty() {

  }

  get totalCost() {
    let productsCost: number = 0;
    this.entity.products.forEach((product: OrderProduct) => {
      productsCost = productsCost + product.price * product.quantity
    })
    return this.entity.delivery_cost + this.entity.decoration_cost + productsCost - this.entity.discount
  }

  get amountCost() {
    return this.totalCost - this.entity.prepay
  }

  initColumns() {
    this.productColumns = [
      {
        dataType: 'string',
        caption: 'Изображение',
        allowFiltering: false,
        allowEditing: false,
        allowSorting: false,
        cellTemplate: 'image-cell-template'
      },
      {
        dataField: 'product_id',
        dataType: 'string',
        caption: 'Товар',
        lookup: {
          dataSource: this.productState.productDataSource.store(),
          valueExpr: 'id',
          displayExpr: 'name'
        },
        editorOptions: {
          showClearButton: true,
          searchEnabled: true
        },
        setCellValue: this.setPriceValue
      },
      {
        dataField: 'quantity',
        dataType: 'number',
        caption: 'Количество',
        editorOptions: {min: 0, showSpinButtons: true}
      },
      {
        dataField: 'price',
        dataType: 'number',
        caption: 'Цена',
        allowEditing: false
      },
      {
        dataType: 'number',
        caption: 'Стоимость',
        allowEditing: false,
        calculateCellValue: this.calculateTotalPrice
      }
    ]
    this.rawColumns = [
      {
        dataType: 'string',
        caption: 'Изображение',
        allowFiltering: false,
        allowEditing: false,
        allowSorting: false,
        cellTemplate: 'image-cell-template'
      },
      {
        dataField: 'raw_id',
        dataType: 'string',
        caption: 'Сырье',
        lookup: {
          dataSource: this.rawState.rawDataSource.store(),
          valueExpr: 'id',
          displayExpr: 'name'
        },
        editorOptions: {
          showClearButton: true,
          searchEnabled: true
        }
      },
      {
        dataField: 'quantity',
        dataType: 'number',
        caption: 'Количество',
        editorOptions: {min: 0, showSpinButtons: true}
      }
    ]
  }

  async setPriceValue(newData: any, value: any, currentRowData: any) {
    const resp: AxiosResponse['data'] = await this.productState.crudProduct.get(value)
    newData.product_id = value
    newData.quantity = 0
    newData.price = resp.price
    newData.raw = resp.raw
  }

  calculateTotalPrice(rowData: any) {
    if (!rowData.quantity || !rowData.price) {
      return 0
    }
    return rowData.quantity * rowData.price
  }


  onShow() {
    this.initColumns()
    if (this.state.editMode) {
      this.entity = _.cloneDeep(this.state.currentRow)
    } else {
      this.entity = new Order()
    }
  }

  onClose() {
    this.state.ResetCurrentRow()
    this.state.SetEditVisible(false)
    this.state.SetEditMode(false)
  }

  async onOk(e: any) {
    const result = e.validationGroup.validate()
    if (result.isValid) {
      this.entity.amount = this.amountCost
      this.entity.total_cost = this.totalCost
      try {
        await this.state.crud.save(this.entity)
        await this.state.dataSource.reload()
        this.onClose()
      } catch (e) {
        console.log(e)
      }
    }

  }
}
</script>

<style lang="scss" scoped>
#form-container {
  margin: 10px 10px 30px;
}

.prefooter {
  span {
    margin-right: 10px;
    margin-left: 10px;
    font-size: 14px;
    font-weight: 400;
  }
  .field {
    margin-bottom: 10px;
  }
}
</style>
