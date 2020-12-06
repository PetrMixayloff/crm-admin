<template>
  <d-edit-popup
    :title="state.productEditMode ? 'Изменение данных о товаре' : 'Создание нового товара'"
    default-width="600"
    default-height="900"
    :visible="state.productEditVisible"
    validation-group="productEntity"
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
        validation-group="productEntity"
      >
        <DxItem
          data-field="name"
          :validation-rules="validationRules.name"
          :label="{text: 'Название товара'}"
        />
        <DxItem
          data-field="description"
          :label="{text: 'Описание'}"
        />
        <DxItem
          data-field="url"
          :label="{text: 'URL'}"
        />
        <DxItem
          data-field="price"
          :label="{text: 'Цена'}"
          editor-type="dxNumberBox"
        />
        <DxItem
          data-field="old_price"
          :label="{text: 'Старая цена'}"
          editor-type="dxNumberBox"
        />
        <DxItem
          data-field="images"
          editor-type="dxGallery"
          :label="{text: 'Изображения товара'}"
          :editor-options="{dataSource: entity.images.length > 0 ? entity.images : ['https://baloon-crm.s3-eu-west-1.amazonaws.com/default.png'],
                            width: 200}"
        />
        <DxItem
          data-field="show_on_store"
          editor-type="dxCheckBox"
          :label="{text: 'Отображать на витрине'}"
          :editor-options="{text: 'Отображать на витрине'}"
        />
      </DxForm>
      <DxFileUploader
        select-button-text="Выбрать фото"
        label-text=""
        accept="image/*"
        upload-mode="useButtons"
        :multiple="true"/>
    </div>
  </d-edit-popup>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import {DxForm, DxItem} from 'devextreme-vue/form'
import {DxFileUploader} from 'devextreme-vue/file-uploader'
import DEditPopup from '@/components/DEditPopup/editpopup.vue'
import {Product, ProductsModule} from '../service'
import _ from 'lodash'

@Component({
  name: 'ProductPopupEdit',
  components: {
    DxForm,
    DxItem,
    DEditPopup,
    DxFileUploader
  }
})
export default class extends Vue {
  private entity: Product = new Product();
  public state = ProductsModule;

  public validationRules: any = {
    name: [
      {type: 'required', message: 'Название товара не задано'}
    ]
  }

  async created() {
  }

  empty() {
  }

  onShow() {
    if (this.state.productEditMode) {
      this.entity = _.cloneDeep(this.state.currentProduct)
    } else {
      this.entity = new Product()
      this.entity.category_id = this.state.currentCategory.id
      this.state.SetCurrentProduct(this.entity)
    }
  }

  onClose() {
    this.state.SetProductEditVisible(false)
  }

  async onOk(e: any) {
    const result = e.validationGroup.validate()
    if (result.isValid) {
      try {
        await this.state.crudProduct.save(this.entity)
        this.state.SetCurrentProduct(this.entity)
        this.state.SetProductEditVisible(false)
        this.state.SetProductEditMode(false)
      } catch (e) {
        console.log(e)
      }
    }
  }

  onCancel(e: any) {
    this.state.SetProductEditVisible(false)
  }
}
</script>

<style lang="scss" scoped>
#form-container {
  margin: 10px 10px 30px;
}
</style>
