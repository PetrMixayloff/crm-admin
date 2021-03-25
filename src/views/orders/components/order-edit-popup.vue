<template>
  <d-edit-popup
    :title="state.editMode ? 'Изменение данных о заказе' : 'Создание нового заказа'"
    default-width="900"
    default-height="1200"
    :visible="state.editVisible"
    validation-group="orderEntity"
    @hidden="onClose"
    @ok="onOk"
    @cancel="onClose"
    @shown="onShow"
  >
    <div id="form-container">
      <DxForm
        id="form"
        ref="orderForm"
        :form-data.sync="entity"
        :show-validation-summary="true"
        validation-group="orderEntity"
      >
<!--        <DxGroupItem caption="Детали заказа">-->
<!--          // дата заказа-->
<!--          // Интервал времени с-->
<!--          // телефон-->
<!--          // адрес-->

<!--        </DxGroupItem>-->

<!--        <DxGroupItem caption="Получатель заказа">-->

<!--        </DxGroupItem>-->

<!--        <DxGroupItem caption="Заказ">-->

<!--        </DxGroupItem>-->
        <DxGroupItem
          caption="Детали заказа"
          :col-count="2"
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
            data-field="client.phone"
            :label="{text: 'Номер телефона'}"
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
            data-field="client.name"
            :label="{text: 'Имя'}"
          />
          <DxItem
            data-field="prepay"
            :label="{text: 'Предоплата'}"
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
        </DxGroupItem>

      </DxForm>

    </div>
  </d-edit-popup>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import {DxForm, DxItem, DxGroupItem} from 'devextreme-vue/form'
import DEditPopup from '@/components/DEditPopup/editpopup.vue'
import {OrdersModule, Order} from '../service'
import {StaffModule} from "@/views/references/staff/service";
import _ from 'lodash'
import TableGrid from '@/components/TableGrid/grid.vue'
import {Reasons, SalesChannel} from "@/const";
import {RawModule} from '@/views/references/materials/service'
import request from '@/utils/request'
import axios, {AxiosResponse} from 'axios'

@Component({
  name: 'OrderEditPopup',
  components: {
    DxForm,
    DxItem,
    DxGroupItem,
    DEditPopup,
    TableGrid
  }
})
export default class extends Vue {
  private entity: Order = new Order();
  public state = OrdersModule;
  private staffState = StaffModule;

  public columns: any[] = [
  ]

  public reasons = Reasons
  public salesChannel = SalesChannel

  public validationRules: any = {}

  async created() {
  }

  empty() {

  }


  onShow() {
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
