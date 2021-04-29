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
          data-field="number"
          :is-required="true"
          :label="{text: 'Номер'}"
        />
        <DxItem
          data-field="date"
          :label="{text: 'Дата'}"
          :is-required="true"
          editor-type="dxDateBox"
          :editor-options="{adaptivityEnabled: true, hint: 'Дата списания', openOnFieldClick: true,
                            pickerType: 'native', showClearButton: true, type: 'date'}"
        />
        <DxItem
          data-field="supplier"
          :label="{text: 'Поставщик'}"
        />
        <DxItem
          data-field="remark"
          :col-span="2"
          :label="{text: 'Примечание'}"
          editor-type="dxTextArea"
        />
      </DxForm>
      <h3>Позиции к списанию</h3>
      <table-grid
        ref="tablegrid"
        :data-source="entity.records"
        :columns="columns"
        :height="400"
        :filter-row-visible="false"
        :column-chooser-enable="false"
        :allow-editing="true"
        editing-mode="raw"
        :row-click="empty"
        :dbl-row-click="empty"
      />
    </div>
  </d-edit-popup>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import {DxForm, DxItem} from 'devextreme-vue/form'
import DEditPopup from '@/components/DEditPopup/editpopup.vue'
import {CancellationModule, Cancellation} from '../service'
import DButton from '@/components/DButton/button.vue'
import TableGrid from '@/components/TableGrid/grid.vue'
import _ from 'lodash'
import {RawModule} from "@/views/references/materials/service";

@Component({
  name: 'CancellationEditPopup',
  components: {
    DxForm,
    DxItem,
    DButton,
    DEditPopup,
    TableGrid
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
      validationRules: [{type: 'required'}]
    },
    {
      dataField: 'quantity',
      dataType: 'number',
      caption: 'Количество',
      validationRules: [{type: 'required'}]
    },
  ]

  async created() {
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
