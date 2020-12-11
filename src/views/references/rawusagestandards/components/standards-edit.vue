<template>
  <d-edit-popup
    :title="state.rawEditMode ? 'Изменение данных cтандарта' : 'Создание cтандарта сырья'"
    default-width="1200"
    default-height="1000"
    :visible="state.editVisible"
    validation-group="RawUsageStandardsEntity"
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
        validation-group="RawUsageStandardsEntity"
      >
      </DxForm>
      <br>
      <h3>Сырье</h3>
      <table-grid
        ref="tablegrid"
        :data-source="Raw"
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
import { RawUsageStandardsModule, RawUsageStandards } from '../service'
import { RawModule } from '@/views/references/materials/service'
import DButton from '@/components/DButton/button.vue'
import TableGrid from '@/components/TableGrid/grid.vue'
import _ from 'lodash'

@Component({
  name: 'StandardsEditPopup',
  components: {
    DxForm,
    DxItem,
    DButton,
    DEditPopup,
    TableGrid
  }
})

export default class extends Vue {
  private entity: RawUsageStandards = new RawUsageStandards();
  public state = RawUsageStandardsModule;
  public Raw: any[] = []
  public currentRawUsageStandards = new RawUsageStandards()
  public columns = [
    {
      dataField: 'id',
      dataType: 'string',
      visible: false
    },
    {
      dataField: 'raw_id',
      dataType: 'string',
      caption: 'Наименование',
      lookup: {
        allowClearing: true,
        dataSource: RawModule.rawDataSource.store(),
        valueExpr: 'id',
        displayExpr: 'name'
      },
      validationRules: [{type: 'required'}]
    },
    // {
    //   dataField: 'price',
    //   dataType: 'number',
    //   caption: 'Цена за ед.',
    //   validationRules: [{type: 'required'}]
    // },
    {
      dataField: 'quantity',
      dataType: 'number',
      caption: 'Количество',
      validationRules: [{type: 'required'}]
    },
    {
      dataField: 'total',
      dataType: 'number',
      caption: 'Сумма',
      calculateCellValue: this.calculateTotal
    }
  ]

  async created() {
  }

  empty() {
  }

  calculateTotal(e: any) {
    if (e.price && e.quantity) {
      return e.price * e.quantity
    }
    return ''
  }

  onShow() {
    if (this.state.editMode) {
      this.entity = _.cloneDeep(this.state.currentRow)
    } else {
      this.entity = new RawUsageStandards()
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
        this.Raw.forEach((item: any) => {
          const recordToAdd = new RawUsageStandards()
          recordToAdd.raw_id = item.raw_id
          recordToAdd.name = item.name
          recordToAdd.quantity = item.quantity
          this.entity.records.push(recordToAdd)
        })
        await this.state.crud.save(this.entity)
        await this.state.dataSource.reload()
        this.state.ResetCurrentRow()
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
