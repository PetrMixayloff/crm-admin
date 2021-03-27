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
          v-if="entity.delivery"
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
              showClearButton: true,
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
        />
        <DxItem
          data-field="client.name"
          :label="{text: 'Имя'}"
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
        editing-mode="row"
        :row-click="empty"
        :dbl-row-click="empty"
        selection-mode="single"
      />
    </div>
  </d-edit-popup>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import {DxForm, DxItem, DxGroupItem, DxTabbedItem, DxTab} from 'devextreme-vue/form'
import DxTabs from 'devextreme-vue/tabs';
import DEditPopup from '@/components/DEditPopup/editpopup.vue'
import {OrdersModule, Order} from '../service'
import {StaffModule} from "@/views/references/staff/service";
import {ProductsModule} from "@/views/references/products/service";
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
    DEditPopup,
    TableGrid
  }
})
export default class extends Vue {
  private entity: Order = new Order();
  private state = OrdersModule;
  private staffState = StaffModule;
  private productState = ProductsModule;
  private productColumns: any[] = [
    {
      dataField: 'image',
      allowFiltering: false,
      cellTemplate: 'image-cell-template'
    },
    {
      dataField: 'name',
      caption: 'Товар',
      lookup: {
        dataSource: this.productState.productDataSource.store(),
        valueExpr: 'id',
        displayExpr: 'name'
      }
    }
  ]
  public columns: any[] = []

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

  initColumns() {
    this.productColumns = [
      {
        dataField: 'image',
        allowFiltering: false,
        cellTemplate: 'image-cell-template'
      },
      {
        dataField: 'name',
        caption: 'Товар',
        lookup: {
          dataSource: this.productState.productDataSource.store(),
          valueExpr: 'id',
          displayExpr: 'name'
        }
      }
      // {
      //   width: '300',
      //   type: 'buttons',
      //   caption: 'Действия',
      //   buttons: [{
      //     text: 'Перейти',
      //     hint: 'Перейти',
      //     cssClass: 'dx-link__goto',
      //     visible: true,
      //     onClick: this.empty
      //   },
      //     {
      //       text: 'Редактировать',
      //       hint: 'Редактировать',
      //       cssClass: 'dx-link__edit',
      //       visible: true,
      //       onClick: this.empty
      //     },
      //     {
      //       text: 'Удалить',
      //       hint: 'Удалить',
      //       cssClass: 'dx-link__delete',
      //       visible: true,
      //       onClick: this.empty
      //     }
      //   ]
      // }
    ]
  }


  onShow() {
    // this.initColumns()
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
    console.log(this.entity)
    // const result = e.validationGroup.validate()
    // if (result.isValid)
    //   try {
    //     await this.state.crud.save(this.entity)
    //     await this.state.dataSource.reload()
    //     this.onClose()
    //   } catch (e) {
    //     console.log(e)
    //   }
  }
}
</script>

<style lang="scss" scoped>
#form-container {
  margin: 10px 10px 30px;
}
</style>
