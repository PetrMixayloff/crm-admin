<template>
  <d-edit-popup
    :title="state.categoryEditMode ? 'Изменение данных категории' : 'Создание новой категории'"
    default-width="450"
    default-height="500"
    :visible="state.categoryEditVisible"
    validation-group="categoryEntity"
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
        validation-group="categoryEntity"
      >
        <DxItem
          data-field="name"
          :validation-rules="validationRules.name"
          :label="{text: 'Название категории'}"
        />
        <DxItem
          data-field="description"
          :label="{text: 'Описание'}"
        />
      </DxForm>
    </div>
  </d-edit-popup>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { DxForm, DxItem } from 'devextreme-vue/form'
import { DxFileUploader } from 'devextreme-vue/file-uploader'
import DEditPopup from '@/components/DEditPopup/editpopup.vue'
import { RawCategory, RawModule } from '../service'
import _ from 'lodash'

@Component({
  name: 'RawCategoryPopupEdit',
  components: {
    DxForm,
    DxItem,
    DEditPopup,
    DxFileUploader
  }
})
export default class extends Vue {
  private entity: RawCategory = new RawCategory();
  public state = RawModule;

  public validationRules: any = {
    name: [
      { type: 'required', message: 'Название категории не задано' }
    ]
  }

  async created() {
  }

  empty() {
  }

  onShow() {
    if (this.state.categoryEditMode) {
      this.entity = _.cloneDeep(this.state.currentCategory)
    } else {
      this.entity = new RawCategory()
      if (!_.isNil(this.state.currentCategory.id)) {
        this.entity.parent_id = this.state.currentCategory.id
      }
      this.state.SetCurrentCategory(this.entity)
    }
  }

  onClose() {
    this.state.SetCategoryEditVisible(false)
    this.state.SetCategoryEditMode(false)
  }

  async onOk(e: any) {
    const result = e.validationGroup.validate()
    if (result.isValid) {
      try {
        await this.state.crudRawCategory.save(this.entity)
        await this.state.rawCategoryDataSource.reload()
        this.state.SetCurrentCategory(this.entity)
        this.state.SetCategoryEditVisible(false)
        this.state.SetCategoryEditMode(false)
      } catch (e) {
        console.log(e)
      }
    }
  }

  onCancel(e: any) {
    this.state.SetCategoryEditVisible(false)
  }
}
</script>

<style lang="scss" scoped>
#form-container {
  margin: 10px 10px 30px;
}
</style>
