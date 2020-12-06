<template>
  <d-edit-popup
    :title="state.productEditMode ? 'Изменение данных о товаре' : 'Создание нового товара'"
    default-width="600"
    default-height="900"
    :visible="state.productEditVisible"
    validation-group="productEntity"
    @hidden="onClose"
    @ok="onOk"
    @cancel="onClose"
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
          data-field="show_on_store"
          editor-type="dxCheckBox"
          :label="{text: 'Отображать на витрине'}"
          :editor-options="{text: 'Отображать на витрине'}"
        />
      </DxForm>
      <el-upload
        action="#"
        list-type="picture-card"
        :auto-upload="false"
        :limit="3">
        <i slot="default" class="el-icon-plus"></i>
        <div slot="file" slot-scope="{file}">
          <img
            class="el-upload-list__item-thumbnail"
            :src="file.url" alt=""
          >
          <span class="el-upload-list__item-actions">
        <span
          class="el-upload-list__item-preview"
          @click="handlePictureCardPreview(file)"
        >
          <i class="el-icon-zoom-in"></i>
        </span>
        <span
          class="el-upload-list__item-delete"
          @click="handleDownload(file)"
        >
          <i class="el-icon-download"></i>
        </span>
        <span
          class="el-upload-list__item-delete"
          @click="handleRemove(file)"
        >
          <i class="el-icon-delete"></i>
        </span>
      </span>
        </div>
      </el-upload>
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
    this.state.SetProductEditMode(false)
  }

  async onOk(e: any) {
    const result = e.validationGroup.validate()
    if (result.isValid) {
      try {
        await this.state.crudProduct.save(this.entity)
        this.state.SetCurrentProduct(this.entity)
        this.onClose()
      } catch (e) {
        console.log(e)
      }
    }
  }

  handleRemove(file: any) {
    console.log(file);
  }

  handlePictureCardPreview(file: any) {
    //
  }

  handleDownload(file: any) {
    console.log(file);
  }
}
</script>

<style lang="scss" scoped>
#form-container {
  margin: 10px 10px 30px;
}
</style>
