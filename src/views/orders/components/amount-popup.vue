<template>
  <d-edit-popup
    :title="'Способ внесения доплаты'"
    default-width="300"
    default-height="200"
    :visible="state.amountVisible"
    @hidden="onClose"
    @ok="onOk"
    @cancel="onClose"
    @shown="onShow"
  >
    <dx-select-box
      :data-source="paymentMethod"
      :value.sync="entity.amount_type"
      value-expr="name"
      display-expr="name"
    />
  </d-edit-popup>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import {DxSelectBox} from "devextreme-vue";
import DEditPopup from '@/components/DEditPopup/editpopup.vue'
import {OrdersModule, Order} from '../service'
import _ from 'lodash'
import {PaymentMethod} from "@/const";


@Component({
  name: 'AmountPopup',
  components: {
    DxSelectBox,
    DEditPopup,
  }
})
export default class extends Vue {
  private entity: Order = new Order();
  private state = OrdersModule;
  public paymentMethod = PaymentMethod

  async created() {
  }

  empty() {

  }


  onShow() {
    this.entity = _.cloneDeep(this.state.currentRow)
  }

  onClose() {
    this.state.ResetCurrentRow()
    this.state.SetAmountVisible(false)
  }

  async onOk(e: any) {
    try {
      await this.state.crud.save(this.entity)
      await this.state.dataSource.reload()
      this.onClose()
    } catch (e) {
      console.log(e)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
