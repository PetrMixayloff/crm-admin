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
import _ from 'lodash'
import TableGrid from '@/components/TableGrid/grid.vue'
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

  public columns: any[] = [
  ]

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
