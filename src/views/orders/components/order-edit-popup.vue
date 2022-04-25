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
    <DxForm
      class="form-container"
      :form-data="entity"
      :show-validation-summary="true"
      validation-group="orderEntity"
    >
      <DxGroupItem caption="Получатель заказа">
        <DxSimpleItem
          data-field="client.phone"
          :label="{text: 'Номер телефона'}"
          :editorOptions="{
          mask: '+7 (000) 000-00-00',
          useMaskedValue: true,
          onChange: onPhoneChanged
          }"
          :is-required="true"
        />
        <DxSimpleItem
          data-field="client.name"
          :label="{text: 'Имя'}"
          :is-required="true"
        />
        <DxSimpleItem
          data-field="client.address.street"
          :label="{text: 'Улица/мкрн'}"
          :visible="entity.delivery"
        />
        <DxSimpleItem
          data-field="client.address.house"
          :label="{text: '№ дома/строения'}"
          :visible="entity.delivery"
        />
        <DxSimpleItem
          data-field="client.address.entrance"
          :label="{text: 'Подъезд'}"
          :visible="entity.delivery"
        />
        <DxSimpleItem
          data-field="client.address.floor"
          :label="{text: 'Этаж'}"
          :visible="entity.delivery"
        />
        <DxSimpleItem
          data-field="client.address.flat"
          :label="{text: 'Квартира/офис'}"
          :visible="entity.delivery"
        />
      </DxGroupItem  >
      <DxGroupItem caption="Заказ">
        <DxSimpleItem
        data-field="date_of_order"
        :label="{text: 'Дата заказа'}"
        editor-type="dxDateBox"
        :editor-options="{
          type: 'datetime',
          openOnFieldClick: true}"
        :is-required="true"
      />
        <DxSimpleItem
          data-field="delivery"
          :label="{text: 'Доставка'}"
          editor-type="dxRadioGroup"
          :editor-options="{
          layout: 'horizontal',
          onValueChanged: this.onDeliveryChanged,
          dataSource: [{text: 'Доставка', value: true}, {text: 'Самовывоз',value: false}],
          valueExpr: 'value', displayExpr: 'text'}"
        />
        <DxSimpleItem
          data-field="prepay"
          :label="{text: 'Предоплата'}"
          editor-type="dxNumberBox"
          :editor-options="{
          value: entity.prepay,
          min: 0
          }"
        />
        <DxSimpleItem
          data-field="prepay_type"
          :label="{text: 'Способ предоплаты'}"
          editor-type="dxSelectBox"
          :editor-options="{
          showClearButton: true,
          value: entity.prepay_type,
          dataSource: paymentMethod,
          valueExpr: 'name',
          displayExpr: 'name'}"
        />
        <DxSimpleItem
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
        <DxSimpleItem
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
        <DxSimpleItem
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
          :visible="entity.delivery"
        />
        <DxSimpleItem
          data-field="delivery_cost"
          :label="{text: 'Стоимость доставки'}"
          editor-type="dxNumberBox"
          :editor-options="{
            value: deliveryCost,
            min: 0
          }"
          :visible="entity.delivery"
        />
        <DxSimpleItem
          :col-span="2"
          data-field="remark"
          :label="{text: 'Примечание к заказу'}"
          editor-type="dxTextArea"
        />
      </DxGroupItem>
      <DxGroupItem caption="Детали заказа">
        <DxSimpleItem
          data-field="discount"
          :label="{text: 'Скидка'}"
          editor-type="dxNumberBox"
          :editor-options="{
            value: entity.discount,
            min: 0
          }"
        />
        <DxSimpleItem
          data-field="decoration_cost"
          :label="{text: 'Монтаж'}"
          editor-type="dxNumberBox"
          :editor-options="{
            value: decorationCost,
            min: 0
          }"
        />
      </DxGroupItem>
    </DxForm>
    <table-grid
      ref="orderEditTableGrid"
      :data-source="entity.products"
      :columns="productColumns"
      :allow-editing="true"
      :filter-row-visible="false"
      editing-mode="cell"
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
    <template v-slot:prefooter>
      <div class="summary">
        <div class="flex-r-c field">
          <span>Итого {{ totalCost }} руб</span>
        </div>
        <div class="flex-r-c field">
          <span>Предоплата {{ prepay }} руб</span>
        </div>
        <div class="flex-r-c">
          <span>Всего к доплате {{ amountCost }} руб</span>
        </div>
      </div>
    </template>
  </d-edit-popup>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import {
  DxForm,
  DxItem,
  DxGroupItem,
  DxTabbedItem,
  DxTab,
  DxRequiredRule,
  DxPatternRule,
  DxLabel,
  DxRangeRule,
  DxSimpleItem
} from 'devextreme-vue/form'
import DxTabs from 'devextreme-vue/tabs';
import {DxNumberBox, DxButton} from "devextreme-vue";
import DEditPopup from '@/components/DEditPopup/editpopup.vue'
import {OrdersModule, Order, OrderProduct, Address} from '../service'
import {StaffModule} from "@/views/references/staff/service";
import {ProductsModule} from "@/views/references/products/service";
import {RawModule} from "@/views/references/materials/service";
import _ from 'lodash'
import TableGrid from '@/components/TableGrid/grid.vue'
import {Reasons, SalesChannel, PaymentMethod} from "@/const";
import request from '@/utils/request'
import {AxiosResponse} from 'axios'
import {alert} from 'devextreme/ui/dialog'

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
    TableGrid,
    DxRequiredRule,
    DxPatternRule,
    DxLabel,
    DxRangeRule,
    DxSimpleItem,
    DxButton
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

  public tabIndex = 0

  async created() {
  }

  empty() {

  }

  async onPhoneChanged(e: any) {
    let client_phone = this.entity.client.phone
    if (client_phone?.length == 18) {
      const resp: AxiosResponse['data'] = await request({
        url: 'clients/' + client_phone,
        method: 'get',
      })
      if (resp) {
        this.entity.client.name = resp.name
        this.entity.client.address = {...resp.address}
      }
    }
  }

  onDeliveryChanged(e: any) {
    if (!e.value) {
      console.log('onDeliveryChanged', !e.value)
      this.entity.courier_id = null;
      this.entity.delivery_cost = 0;
    }
  }

  get deliveryCost() {
    if (this.entity.delivery_cost == undefined) {
      console.log('Alarm!!!, deliveryCost')
      this.entity.delivery_cost = 0
    }
    return this.entity.delivery_cost
  }

  get decorationCost() {
    if (this.entity.decoration_cost == undefined) {
      // console.log('Alarm!!! decorationCost')
      this.entity.decoration_cost = 0
    }
    return this.entity.decoration_cost
  }
  //
  // discount(e: any) {
  //   console.log('discount.value', e.value)
  //   if (e.value === undefined) {
  //     this.entity.discount = 0
  //   }
  //   return this.entity.discount = e.value
  // }

  get prepay() {
    console.log('prepay', this.entity.prepay)
    if (this.entity.prepay == null) {
      console.log('Alarm!!! prepay')
      this.entity.prepay = 0
    }
    return this.entity.prepay
  }

  get totalCost() {
    console.log('decoration_cost', this.entity.decoration_cost)
    let productsCost: number = 0;
    let productsCostAll: number = 0;
    this.entity.products.forEach((product: OrderProduct) => {
      productsCost = productsCost + product.price * product.quantity
    })
    if (this.deliveryCost >= 0 || this.decorationCost >= 0 || this.entity.discount >= 0) {
      productsCostAll = this.entity.delivery_cost + this.entity.decoration_cost + productsCost - this.entity.discount
      console.log('delivery_cost', this.entity.delivery_cost)
      console.log('discount', this.entity.discount)
      console.log('prepay', this.entity.prepay)
    } else return productsCost

    return productsCostAll
  }

  get amountCost() {
    let amount = this.totalCost - this.entity.prepay
    let isPositive = amount > 0

    if (!isPositive) {
      console.log('amount', this.totalCost - this.entity.prepay)
      console.log('totalCost', this.totalCost)
      amount = 0
    }
    return amount
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
    newData.name = resp.name
    newData.image = resp.image
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
      if (!this.entity.client.address) {
        this.entity.client.address = new Address()
      }
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
    console.log(this.entity.products.length)
    const result = e.validationGroup.validate()

    if (!this.entity.products.length) {
      await alert('В заказе нет товара', 'Добавьте товар!')
    }

    if (result.isValid && this.entity.products.length) {
      this.entity.amount = this.amountCost
      this.entity.total_cost = this.totalCost
      if (!this.entity.delivery) {
        this.entity.client.address = null
        this.entity.courier_id = null
      }
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
.form-container {
  margin: 20px 10px 30px;
}

::v-deep .dx-form-group-caption {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: #03a9f4;
}

.summary {
  padding-top: 10px;
  border-top: 2px solid #333;

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
