<template>
  <d-edit-popup
    :title="state.editMode ? 'Изменение данных cтандарта' : 'Создание cтандарта сырья'"
    default-width="600"
    default-height="800"
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
          :validation-rules="validationRules.name"
        />
        <DxItem
          data-field="raw_id"
          editor-type="dxSelectBox"
          :label="{text: 'Сырье'}"
          :editor-options="{dataSource: rawDataSource, valueExpr: 'id', displayExpr: 'name',
                            showClearButton: true}"
          :validation-rules="validationRules.raw_id"
        />
        <DxItem
          data-field="quantity"
          :label="{text: 'Количество сырья на ед. стандарта'}"
          :validation-rules="validationRules.quantity"
        />
      </DxForm>
    </div>
  </d-edit-popup>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { DxForm, DxItem } from 'devextreme-vue/form'
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
  public rawDataSource = RawModule.rawDataSource

  public validationRules: any = {
    name: [
      { type: 'required', message: 'Не указано название стандарта' }
    ],
    quantity: [
      { type: 'required', message: 'Не указано количество сырья на ед. стандарта' }
    ],
    raw_id: [
      { type: 'required', message: 'Не выбрано сырье' }
    ]
  }

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
      await this.state.crudStandards.save(this.entity)
      await this.state.dataSource.reload()
      this.state.ResetCurrentRow()
      this.onClose()
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
