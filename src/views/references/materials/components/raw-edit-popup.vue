<template>
  <d-edit-popup
    :title="state.rawEditMode ? 'Изменение данных о сырье' : 'Создание нового сырья'"
    default-width="600"
    default-height="900"
    :visible="state.rawEditVisible"
    validation-group="rawEntity"
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
        :col-count="2"
        :show-validation-summary="true"
        validation-group="rawEntity"
      >
        <DxItem
          data-field="category_id"
          :label="{text: 'Категория'}"
          editor-type="dxSelectBox"
          :editor-options="{
          dataSource: state.rawCategoryDataSource,
          valueExpr: 'id',
          displayExpr: 'name',
          searchEnabled: true,
          searchExpr: 'name'
        }"
          :is-required="true"
        />
        <DxItem
          data-field="name"
          :label="{text: 'Наименование'}"
          :is-required="true"
        />
        <DxItem
          data-field="article_number"
          :label="{text: 'Артикул'}"
        />
        <DxItem
          data-field="manufacturer"
          :label="{text: 'Производитель'}"
        />
        <DxItem
          data-field="unit"
          :label="{text: 'Единица измерения'}"
          editor-type="dxSelectBox"
          :editor-options="{
          dataSource: units,
          valueExpr: 'code',
          displayExpr: (item) => { return item && item.name + ', ' + item.caption; },
          searchEnabled: true,
          searchExpr: 'name'
        }"
          :is-required="true"
        />
        <DxItem
          item-type="simple"
          name="needOpening"
          help-text="Если товар поставляется в упаковках, а используется поштучно"
        >
            <template #default>
                <DxCheckBox
                  v-model:value="needOpening"
                  text="Разборный"
                />
            </template>
        </DxItem>
        <DxItem
          data-field="piece_unit"
          :label="{text: 'Единица измерения разборного сырья'}"
          editor-type="dxSelectBox"
          :editor-options="{
          dataSource: units,
          valueExpr: 'code',
          displayExpr: (item) => { return item && item.name + ', ' + item.caption; },
          searchEnabled: true,
          searchExpr: 'name'
        }"
          :is-required="needOpening"
          :visible="needOpening"
        />
        <DxItem
          data-field="per_pack"
          :label="{text: 'Количество в упаковке/таре'}"
          editor-type="dxNumberBox"
          :editor-options="{min: 0}"
          :is-required="needOpening"
          :visible="needOpening"
        />
        <DxItem
          data-field="helium_consumption"
          :label="{text: 'Расход гелия'}"
          help-text="Если не заполняется гелием, оставьте равным нулю"
          editor-type="dxNumberBox"
          :editor-options="{min: 0}"
        />
        <DxItem
          item-type="empty"
        />
        <DxItem
          data-field="yellow_label"
          :label="{text: 'Желтый остаток'}"
          editor-type="dxNumberBox"
          :editor-options="{min: 0}"
        />
        <DxItem
          data-field="red_label"
          :label="{text: 'Красный остаток'}"
          editor-type="dxNumberBox"
          :editor-options="{min: 0}"
        />
        <DxItem
          data-field="description"
          :label="{text: 'Описание'}"
          :col-span="2"
          editor-type="dxTextArea"
        />
      </DxForm>
      <h5>Изображение</h5>
      <img
        :src="rawImage"
        alt=""
        width="25%"
      >
      <el-upload
        ref="rawImage"
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
    </div>
  </d-edit-popup>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import {DxForm, DxItem} from 'devextreme-vue/form'
import {DxCheckBox} from "devextreme-vue";
import {DxFileUploader} from 'devextreme-vue/file-uploader'
import DEditPopup from '@/components/DEditPopup/editpopup.vue'
import {Raw, RawModule} from '../service'
import DButton from '@/components/DButton/button.vue'
import _ from 'lodash'
import {filePost, fileDelete} from '@/utils/file-upload'
import axios, {AxiosResponse} from 'axios';
import {MeasureUnits} from '@/const'

@Component({
  name: 'RawPopupEdit',
  components: {
    DxForm,
    DxItem,
    DButton,
    DEditPopup,
    DxFileUploader,
    DxCheckBox
  }
})
export default class extends Vue {
  private entity: Raw = new Raw();
  public state = RawModule;
  private imageToDelete: string | null = null
  private uploadUrl = `${process.env.VUE_APP_BASE_API}/files`
  private units = MeasureUnits
  private needOpening: boolean = false;

  async created() {
  }

  empty() {
  }

  onShow() {
    if (this.state.rawEditMode) {
      this.entity = _.cloneDeep(this.state.currentRaw)
      this.needOpening = !_.isNil(this.entity.piece_raw_id)
    } else {
      this.entity = new Raw()
      this.entity.category_id = this.state.currentCategory.id
      this.state.SetCurrentRaw(this.entity)
    }
  }

  onClose() {
    this.state.SetRawEditVisible(false)
    this.state.SetRawEditMode(false)
    if (!_.isNil((this.$refs.rawImage as any).uploadFiles[0])) {
      (this.$refs.rawImage as any).clearFiles()
    }
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
      if (!_.isNil((this.$refs.rawImage as any).uploadFiles[0])) {
        const file: File = (this.$refs.rawImage as any).uploadFiles[0].raw
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
          (this.$refs.rawImage as any).clearFiles()
        } catch (e) {
          console.log(e)
          return
        }
      }
      try {
        await this.state.crudRaw.save(this.entity)
        await this.state.rawDataSource.reload()
        this.state.SetCurrentRaw(this.entity)
        this.state.SetRawEditVisible(false)
        this.state.SetRawEditMode(false)
      } catch (e) {
        console.log(e)
      }
    }
  }

  onCancel(e: any) {
    this.state.SetRawEditVisible(false)
  }

  async onImageRemove() {
    if (!_.isNil(this.$refs.rawImage) && !_.isNil((this.$refs.rawImage as any).uploadFiles)) {
      (this.$refs.rawImage as any).clearFiles()
    }
    if (!_.isNil(this.entity.image)) {
      this.imageToDelete = this.entity.image.split('/')[0]
      this.entity.image = null
    }
  }

  get rawImage() {
    if (!_.isNil(this.$refs.rawImage) && !_.isNil((this.$refs.rawImage as any).uploadFiles[0])) {
      return URL.createObjectURL((this.$refs.rawImage as any).uploadFiles[0].raw)
    }
    if (!this.entity.image) {
      return require('@/assets/defaults/default_baloon.png')
    }
    return `https://baloon-crm.s3-eu-west-1.amazonaws.com/${this.entity.image}`
  }

  get showDeleteButton() {
    if (!_.isNil(this.$refs.rawImage) && !_.isNil((this.$refs.rawImage as any).uploadFiles) && (this.$refs.rawImage as any).uploadFiles.length > 0) {
      return true
    }
    return !_.isNil(this.entity.image)
  }

  onImageChange() {
    if (!_.isNil(this.state.currentRaw.image)) {
      this.imageToDelete = this.state.currentRaw.image
    }
    if (!_.isNil(this.$refs.rawImage) && !_.isNil((this.$refs.rawImage as any).uploadFiles) && (this.$refs.rawImage as any).uploadFiles.length > 1) {
      (this.$refs.rawImage as any).uploadFiles.shift()
    }
  }
}
</script>

<style lang="scss" scoped>
#form-container {
  margin: 10px 10px 30px;
}
</style>
