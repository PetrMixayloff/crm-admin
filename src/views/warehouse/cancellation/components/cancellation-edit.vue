<template>
  <d-edit-popup
    :title="'Списание сырья'"
    default-width="900"
    default-height="800"
    :visible="state.editVisible"
    validation-group="cancellationEntity"
    @hidden="onClose"
    @ok="onOk"
    @cancel="onClose"
    @shown="onShow"
  >
    <div id="form-container">
      <DxForm
        id="form"
        ref="dxform"
        :col-count="2"
        :form-data.sync="entity"
        :show-validation-summary="true"
        validation-group="cancellationEntity"
      >
        <DxItem
          data-field="date"
          :label="{text: 'Дата'}"
          :is-required="true"
          editor-type="dxDateBox"
          :editor-options="{adaptivityEnabled: true, hint: 'Дата списания', openOnFieldClick: true,
                            pickerType: 'native', showClearButton: true, type: 'date'}"
        />
        <DxItem
          data-field="reason"
          :label="{text: 'Причина'}"
        />
        <DxItem
          data-field="remark"
          :col-span="2"
          :label="{text: 'Примечание'}"
          editor-type="dxTextArea"
        />
      </DxForm>
      <h3>Позиции к списанию</h3>
      <dx-data-grid
        :data-source="entity.records"
        :allow-column-resizing="true"
        :row-alternation-enabled="true"
        :show-borders="true"
        :show-column-lines="true"
        :show-row-lines="true"
        :columns="columns"
        :height="400"
        :on-saved="onNewRowSaved"
        @row-click="empty"
        @row-dbl-click="empty"
      >
        <dx-load-panel
          :enabled="true"
        />
        <dx-editing
          :allow-updating="true"
          :allow-adding="true"
          mode="raw"
        />
        <template #dropDownBoxEditor="{ data: cellInfo }">
          <remainsDropDownBox
            :value="cellInfo.value"
            :on-value-changed="cellInfo.setValue"
            :data-source="remains"
          />
        </template>
      </dx-data-grid>
    </div>
  </d-edit-popup>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import {DxForm, DxItem} from 'devextreme-vue/form'
import DEditPopup from '@/components/DEditPopup/editpopup.vue'
import {CancellationModule, Cancellation} from '../service'
import DButton from '@/components/DButton/button.vue'
import {RawModule} from "@/views/references/materials/service";
import remainsDropDownBox from './remains-drop-down-box.vue'
import {
  DxDataGrid,
  DxLoadPanel,
  DxEditing
} from 'devextreme-vue/data-grid'
import request from '@/utils/request'
import _ from 'lodash'

@Component({
  name: 'CancellationEditPopup',
  components: {
    DxForm,
    DxItem,
    DButton,
    DEditPopup,
    DxDataGrid,
    DxLoadPanel,
    DxEditing,
    remainsDropDownBox
  }
})

export default class extends Vue {
  private entity: Cancellation = new Cancellation();
  public state = CancellationModule;
  public cancellationRecords: any[] = []
  public columns = [
    {
      dataField: 'id',
      dataType: 'string',
      visible: false
    },
    {
      dataField: 'raw_id',
      dataType: 'string',
      caption: 'Название',
      lookup: {
        allowClearing: true,
        dataSource: RawModule.rawDataSource.store(),
        valueExpr: 'id',
        displayExpr: 'name',
      },
      setCellValue: this.resetValues,
      allowSorting: false,
      validationRules: [{type: 'required'}]
    },
    {
      dataField: 'raw_remains_details_id',
      dataType: 'string',
      caption: 'Накладная',
      editCellTemplate: 'dropDownBoxEditor',
      allowSorting: false,
      lookup: {
        allowClearing: true,
        dataSource: RawModule.rawDetailsDataSource.store(),
        valueExpr: 'id',
        displayExpr: (item: any) => {return item && 'Номер ' + item.number + ' от ' + new Date(item.date).toLocaleDateString();},
      },
      width: 200,
      validationRules: [{type: 'required'}]
    },
    {
      dataField: 'quantity',
      dataType: 'number',
      caption: 'Количество',
      width: 100,
      allowSorting: false,
      validationRules: [{type: 'required'}]
    }
  ]
  private remains: any[] = []

  async created() {
  }

  onNewRowSaved(e: any) {
    const record: any = this.entity.records[this.entity.records.length - 1]
    const rawRemains: any = this.remains.find((item: any) => item.id === record.raw_remains_details_id)
    if (rawRemains)
      record.price = rawRemains.price
  }

  async resetValues(newData: any, value: string, currentRowData: any) {
    newData.raw_id = value;
    newData.raw_remains_details_id = null;
    newData.quantity = null;
    if (_.isNil(value)) {
      this.remains = []
      return
    }
    const resp: any = await request({
      url: `raw/details/${value}`,
      method: 'get'
    })
    this.remains = resp.data
  }

  empty() {
  }

  onShow() {
    this.entity = new Cancellation()
  }

  onClose() {
    this.state.SetEditVisible(false)
  }

  async onOk(e: any) {
    const result = e.validationGroup.validate()
    if (result.isValid) {
      try {
        await this.state.crud.save(this.entity)
        await this.state.dataSource.reload()
        this.state.ResetCurrentCancellation()
        this.onClose()
      } catch (e) {
        console.log(e)
      }
    }
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
