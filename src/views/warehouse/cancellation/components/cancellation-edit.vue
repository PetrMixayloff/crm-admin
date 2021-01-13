<template>
  <d-edit-popup
    :title="'Создание списка для списания'"
    default-width="1200"
    default-height="1000"
    :visible="state.editVisible"
    validation-group="cancellationEntity"
    @hidden="onClose"
    @ok="onOk"
    @cancel="onCancel"
    @shown="onShow"
  >
    <div id="form-container">
      <DxForm
        id="form"
        ref="dxform"
        :form-data.sync="entity"
        :show-validation-summary="true"
        validation-group="cancellationEntity"
      >
        <DxItem
          data-field="number"
          :validation-rules="validationRules.number"
          :label="{text: 'Номер'}"
        />
        <DxItem
          data-field="date"
          :validation-rules="validationRules.number"
          :label="{text: 'Дата'}"
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
          :label="{text: 'Примечание'}"
          editor-type="dxTextArea"
        />
      </DxForm>
      <br>
      <h3>Позиции к списанию</h3>
      <table-grid
        ref="tablegrid"
        :data-source="cancellationRecords"
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
import {CancellationModule, Cancellation, CancellationRecord} from '../service'
import DButton from '@/components/DButton/button.vue'
import TableGrid from '@/components/TableGrid/grid.vue'
import _ from 'lodash'
import {RemainsModule} from "@/views/warehouse/remains/service";

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
      dataField: 'rawremainsdetail_id',
      dataType: 'string',
      caption: 'Название',
      lookup: {
        allowClearing: true,
        dataSource: RemainsModule.dataSource.store(),
        valueExpr: 'id',
        displayExpr: 'id',
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

  public validationRules: any = {
    number: [
      {type: 'required', message: 'Не задан номер списания'}
    ],
    date: [
      {type: 'required', message: 'Укажите дату списания'}
    ]
  }

  async created() {
  }

  empty() {
  }

  onShow() {
    if (this.state.editMode) {
      this.entity = _.cloneDeep(this.state.currentCancellation)
    } else {
      this.entity = new Cancellation()
    }
  }

  onClose() {
    this.state.SetEditVisible(false)
    this.state.SetEditMode(false)
  }

  async onOk(e: any) {
    const result = e.validationGroup.validate()
    if (result.isValid) {
      try {
        this.cancellationRecords.forEach((item: any) => {
          const recordToAdd = new CancellationRecord()
          recordToAdd.rawremainsdetail_id = item.rawremainsdetail_id
          recordToAdd.quantity = item.quantity
          this.entity.records.push(recordToAdd)
        })
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
    this.state.SetEditVisible(false)
    this.state.SetEditMode(false)
  }

  onUploaded(e: any) {
    //
  }

  onRemove() {
    //
  }
}
</script>

<style lang="scss" scoped>
#form-container {
  margin: 10px 10px 30px;
}
</style>
