<template>
  <d-edit-popup
    :title="state.categoryEditMode ? 'Изменение данных категории' : 'Создание новой категории'"
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
import {Component, Vue} from 'vue-property-decorator'
import DEditPopup from '@/components/DEditPopup/editpopup.vue'
import {RawModule, table_name} from '../service'
import TableGrid from '@/components/TableGrid/grid.vue'
import request from '@/utils/request'
import _ from 'lodash'
import dbSchemaService from "@/services/db_schema_service";
import {AxiosResponse} from "axios";

@Component({
  name: 'ShowRemainsDetailsPopup',
  components: {
    DEditPopup,
    TableGrid
  }
})
export default class extends Vue {
  public state = RawModule;
  public columns: Array<any> = [
    {
      dataField: 'raw_id',
      caption: 'Название',
      dataType: 'string'
    },
    {
      dataField: 'invoice_id',
      caption: 'Накладная',
      dataType: 'string'
    },
    {
      dataField: 'price',
      caption: 'Цена за ед.',
      dataType: 'number'
    },
    {
      dataField: 'quantity',
      caption: 'Количество',
      dataType: 'number'
    },
    {
      dataField: 'total',
      caption: 'Сумма',
      dataType: 'number'
    }
  ];
  public dataSource: any

  async created() {
  }

  empty() {
  }

  async onShow() {
    const resp: AxiosResponse['data'] = await request({
      url: `/raw/details/${this.state.currentRaw.id}`,
      method: 'get'
    })
    this.dataSource = resp
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
}
</script>

<style lang="scss" scoped>
#form-container {
  margin: 10px 10px 30px;
}
</style>
