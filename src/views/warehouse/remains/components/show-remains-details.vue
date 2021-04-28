<template>
  <d-edit-popup
    title="Детализация остатков"
    default-width="600"
    default-height="800"
    :visible="state.showRemainsDetails"
    @hidden="onClose"
    @ok="onOk"
    @cancel="onCancel"
    @shown="onShow"
  >
    <div id="form-container">
      <table-grid
        ref="tablegrid"
        :data-source="dataSource"
        :columns="columns"
        :row-click="empty"
        :dbl-row-click="empty"
      />
    </div>
  </d-edit-popup>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DEditPopup from '@/components/DEditPopup/editpopup.vue'
import { RawModule } from "@/views/references/materials/service"
import {RemainsModule} from "@/views/warehouse/remains/service";
import TableGrid from '@/components/TableGrid/grid.vue'
import request from '@/utils/request'
import { AxiosResponse } from 'axios'
import { InvoiceModule } from '@/views/warehouse/invoice/service'

@Component({
  name: 'ShowRemainsDetailsPopup',
  components: {
    DEditPopup,
    TableGrid
  }
})
export default class extends Vue {
  public state = RemainsModule;
  public columns: Array<any> = [
    {
      dataField: 'raw_id',
      caption: 'Название',
      lookup: {
        allowClearing: true,
        dataSource: RawModule.rawDataSource.store(),
        valueExpr: 'id',
        displayExpr: 'name'
      }
    },
    {
      dataField: 'invoice_id',
      caption: '№ Накладной',
      lookup: {
        allowClearing: true,
        dataSource: InvoiceModule.dataSource.store(),
        valueExpr: 'id',
        displayExpr: 'number'
      }
    },
    {
      dataField: 'price',
      caption: 'Цена за ед.',
      dataType: 'number'
    },
    {
      dataField: 'quantity',
      caption: 'Остаток',
      dataType: 'number'
    },
    {
      dataField: 'total',
      caption: 'Сумма',
      dataType: 'number',
      calculateCellValue: this.calculateTotal
    }
  ];

  public dataSource: any = {}

  async created() {
  }

  empty() {
  }

  async onShow() {
    const resp: AxiosResponse['data'] = await request({
      url: `/raw/details/${this.state.currentRow.id}`,
      method: 'get'
    })
    this.dataSource = resp.data
  }

  onClose() {
    this.state.ShowRemainsDetails(false)
  }

  async onOk(e: any) {
    this.onClose()
  }

  onCancel(e: any) {
    this.onClose()
  }

  calculateTotal(e: any) {
    if (e.price && e.quantity) {
      return e.price * e.quantity
    }
    return ''
  }
}
</script>

<style lang="scss" scoped>
#form-container {
  margin: 10px 10px 30px;
}
</style>
