<template>
  <d-edit-popup
    :title="'Создание списка для инвентаризации'"
    default-width="1200"
    default-height="1000"
    :visible="state.editVisible"
    validation-group="inventoryEntity"
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
        validation-group="inventoryEntity"
      >
        <DxItem
          data-field="number"
          :label="{text: 'Номер'}"
          :is-required="true"
        />
        <DxItem
          data-field="date"
          :is-required="true"
          :label="{text: 'Дата'}"
          editor-type="dxDateBox"
          :editor-options="{adaptivityEnabled: true, hint: 'Дата инвентаризации', openOnFieldClick: true,
                            pickerType: 'native', showClearButton: true, type: 'date'}"
        />
        <DxItem
          data-field="remark"
          :label="{text: 'Примечание'}"
          editor-type="dxTextArea"
        />
      </DxForm>
      <br>
      <h3>Позиции к инвентаризации</h3>
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
import {InventoryModule, Inventory, InventoryRecord} from '../service'
import DButton from '@/components/DButton/button.vue'
import TableGrid from '@/components/TableGrid/grid.vue'
import _ from 'lodash'
import {RawModule} from "@/views/references/materials/service";
import {RemainsModule, Remains} from "@/views/warehouse/remains/service";
import {AxiosResponse} from "axios";

@Component({
  name: 'InventoryEditPopup',
  components: {
    DxForm,
    DxItem,
    DButton,
    DEditPopup,
    TableGrid
  }
})

export default class extends Vue {
  private entity: Inventory = new Inventory();
  public state = InventoryModule;
  public cancellationRecords: any[] = []
  public columns: any[] = []

  created() {
    this.initColumns()
  }

  initColumns() {
    this.columns = [
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
          dataSource: RawModule.rawDataSource.store(),
          valueExpr: 'id',
          displayExpr: 'name'
        },
        editorOptions: {
          showClearButton: true,
          searchEnabled: true
        },
        setCellValue: this.setOldQuantityValue
      },
      {
        dataField: 'quantity',
        dataType: 'number',
        caption: 'Фактический остаток'
      },
      {
        dataField: 'old_quantity',
        dataType: 'number',
        caption: 'Остаток по программе',
        allowEditing: false
      },
      {
        caption: 'Разница',
        calculateCellValue: this.calculateDifference
      }
    ]
  }

  calculateDifference(e: any) {
    if (!_.isNil(e.quantity) && !_.isNil(e.old_quantity)) {
      return e.old_quantity - e.quantity
    }
    return ''
  }

  async setOldQuantityValue(newData: any, value: any, currentRowData: any) {
    const resp: AxiosResponse['data'] = await RemainsModule.crud.load({filter: ['row_id', '=', value]})
    newData.row_id = value
    newData.old_quantity = resp.data.length > 0 ?
      resp.data.reduce((accumulator: number, item: Remains) => accumulator + item.quantity) : 0
  }

  empty() {
  }

  onShow() {
    if (this.state.editMode) {
      this.entity = _.cloneDeep(this.state.currentInventory)
    } else {
      this.entity = new Inventory()
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
        await this.state.crud.save(this.entity)
        await this.state.dataSource.reload()
        this.state.ResetCurrentInventory()
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
