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
        <DxItem
          data-field="show_on_store"
          :label="{text: 'Отображать на витрине'}"
          editor-type="dxCheckBox"
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
import { ProductCategory, ProductsModule } from '../service'
import _ from 'lodash'

@Component({
  name: 'CategoryPopupEdit',
  components: {
    DxForm,
    DxItem,
    DEditPopup,
    DxFileUploader
  }
})
export default class extends Vue {
  private entity: ProductCategory = new ProductCategory();
  public state = ProductsModule;

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
      this.entity = new ProductCategory()
      this.state.SetCurrentCategory(this.entity)
    }
  }

  onClose() {
    this.state.SetCategoryEditVisible(false)
  }

  async onOk(e: any) {
    const result = e.validationGroup.validate()
    if (result.isValid) {
      try {
        await this.state.crudCategory.save(this.entity)
        this.state.categoryDataSource.reload()
        this.state.SetCategoryEditVisible(false)
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
