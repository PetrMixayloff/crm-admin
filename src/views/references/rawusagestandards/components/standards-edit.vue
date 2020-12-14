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
        <DxItem
        data-field="name"
        :label="{text: 'Название стандарта'}"
        />
        <DxItem
        data-field="quantity"
        :label="{text: 'Количество сырья на ед. стандарта'}"
        />
      </DxForm>
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
  public columns = [
    {
      dataField: 'raw_id',
      dataType: 'string',
      caption: 'Наименование',
      lookup: {
        allowClearing: true,
        dataSource: RawModule.rawDataSource.store(),
        valueExpr: 'id',
        displayExpr: 'id'
      },
      validationRules: [{type: 'required'}]
    },
  ]

  async created() {
  }

  empty() {
  }

  onShow() {
    if (this.state.editMode) {
      this.entity = _.cloneDeep(this.state.currentStandards)
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
