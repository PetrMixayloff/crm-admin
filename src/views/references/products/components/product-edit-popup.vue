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
        :col-count="2"
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
      <h5>Изображение</h5>
      <img
        :src="productImage"
        alt=""
        width="25%"
      >
      <el-upload
        ref="productImage"
        class="btn-upload"
        accept="png"
        :show-file-list="false"
        :auto-upload="false"
        :action="uploadUrl"
        :multiple="false"
        :on-change="onImageChange"
      >
        <d-button
          btn-text="Сменить"
          btn-type="primary"
          styling-mode="contained"
          :on-click="empty"
          hint="Сменить изображение"
        />
      </el-upload>
      <d-button
        v-if="showDeleteButton"
        btn-text="Удалить"
        btn-type="danger"
        styling-mode="contained"
        :on-click="onImageRemove"
        hint="Удалить изображение"
      />
      <h5>Состав сырья</h5>
      <table-grid
        ref="productsTableGrid"
        :data-source="entity.raw"
        :columns="rawColumns"
        :allow-editing="true"
        :height="300"
        :filter-row-visible="false"
        :row-click="empty"
        :dbl-row-click="empty"
        editing-mode="row"
        @row-removing="onRowRemoving"
      />
    </div>
  </d-edit-popup>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { DxForm, DxItem } from 'devextreme-vue/form'
import { DxFileUploader } from 'devextreme-vue/file-uploader'
import DEditPopup from '@/components/DEditPopup/editpopup.vue'
import DButton from '@/components/DButton/button.vue'
import { Product, ProductsModule } from '../service'
import _ from 'lodash'
import { fileDelete, filePost } from '@/utils/file-upload'
import TableGrid from '@/components/TableGrid/grid.vue'
import { RawModule } from '@/views/references/materials/service'
import { RawUsageStandardsModule } from '../../rawusagestandards/service'
import request from '@/utils/request'
import axios, { AxiosResponse } from 'axios'

@Component({
  name: 'ProductPopupEdit',
  components: {
    DxForm,
    DxItem,
    DEditPopup,
    DButton,
    DxFileUploader,
    TableGrid
  }
})
export default class extends Vue {
  private entity: Product = new Product();
  public state = ProductsModule;
  private uploadUrl = `${process.env.VUE_APP_BASE_API}/files`
  private imageToDelete: string | null = null
  private rawToDelete: any[] = []

  public rawColumns: any[] = [
    {
      dataField: 'id',
      dataType: 'string',
      visible: false
    },
    {
      dataField: 'product_id',
      dataType: 'string',
      visible: false
    },
    {
      dataField: 'raw_id',
      caption: 'Сырье',
      lookup: {
        allowClearing: true,
        dataSource: RawModule.rawDataSource.store(),
        valueExpr: 'id',
        displayExpr: 'name'
      },
      allowSorting: false,
      allowFiltering: false,
      validationRules: [{ type: 'required' }]
    },
    {
      dataField: 'quantity',
      dataType: 'number',
      caption: 'Кол-во',
      allowSorting: false,
      allowFiltering: false,
      width: 70,
      validationRules: [{ type: 'required' }]
    }
  ]

  public validationRules: any = {
    name: [
      { type: 'required', message: 'Название товара не задано' }
    ]
  }

  async created() {
  }

  empty() {

  }

  onRowRemoving(e: any) {
    this.rawToDelete.push(e.data.id)
  }

  onShow() {
    this.imageToDelete = null
    this.rawToDelete = []
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
    if (!_.isNil((this.$refs.productImage as any).uploadFiles[0])) {
      (this.$refs.productImage as any).clearFiles()
    }
    this.rawToDelete = []
    this.imageToDelete = null
  }

  async onOk(e: any) {
    const result = e.validationGroup.validate()
    if (result.isValid) {
      if (!_.isNil(this.imageToDelete)) {
        try {
          await fileDelete(this.imageToDelete)
        } catch (e) {
          console.log(e)
          return
        }
      }
      if (!_.isNil((this.$refs.productImage as any).uploadFiles[0])) {
        const file: File = (this.$refs.productImage as any).uploadFiles[0].raw
        this.entity.image = file.name
        try {
          const signedUrl: AxiosResponse['data'] = await filePost(file)
          if (signedUrl) {
            const options = {
              headers: {
                'Content-Type': file.type
              }
            }
            await axios.put(signedUrl, file, options)
          }
          (this.$refs.productImage as any).clearFiles()
        } catch (e) {
          console.log(e)
          return
        }
      }
      if (this.rawToDelete.length > 0) {
        this.entity['raw_to_delete'] = this.rawToDelete
      }
      try {
        await this.state.crudProduct.save(this.entity)
        await this.state.productDataSource.reload()
        this.state.ResetCurrentProduct()
        this.onClose()
      } catch (e) {
        console.log(e)
      }
    }
  }

  onImageRemove() {
    if (!_.isNil(this.$refs.productImage) && !_.isNil((this.$refs.productImage as any).uploadFiles)) {
      (this.$refs.productImage as any).clearFiles()
    }
    if (!_.isNil(this.entity.image)) {
      this.imageToDelete = this.entity.image
      this.entity.image = null
    }
  }

  get productImage() {
    if (!_.isNil(this.$refs.productImage) && !_.isNil((this.$refs.productImage as any).uploadFiles[0])) {
      return URL.createObjectURL((this.$refs.productImage as any).uploadFiles[0].raw)
    }
    if (!this.entity.image) {
      return require('@/assets/defaults/default_baloon.png')
    }
    return `https://baloon-crm.s3-eu-west-1.amazonaws.com/${this.entity.image}`
  }

  get showDeleteButton() {
    if (!_.isNil(this.$refs.productImage) && !_.isNil((this.$refs.productImage as any).uploadFiles) && (this.$refs.productImage as any).uploadFiles.length > 0) {
      return true
    }
    return !_.isNil(this.entity.image)
  }

  onImageChange() {
    if (!_.isNil(this.state.currentProduct.image)) {
      this.imageToDelete = this.state.currentProduct.image
    }
    if (!_.isNil(this.$refs.productImage) && !_.isNil((this.$refs.productImage as any).uploadFiles) && (this.$refs.productImage as any).uploadFiles.length > 1) {
      (this.$refs.productImage as any).uploadFiles.shift()
    }
  }
}
</script>

<style lang="scss" scoped>
#form-container {
  margin: 10px 10px 30px;
}
</style>
