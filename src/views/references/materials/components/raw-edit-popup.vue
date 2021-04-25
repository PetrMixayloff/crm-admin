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
          data-field="name"
          :validation-rules="validationRules.name"
          :label="{text: 'Название сырья'}"
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
          data-field="helium_consumption"
          :label="{text: 'Расход гелия'}"
          help-text="Если не заполняется гелием, оставьте равным нулю"
          editor-type="dxNumberBox"
          :editor-options="{min: 0}"
        />
        <DxItem
          data-field="unit"
          :label="{text: 'Единица измерения'}"
        />
        <DxItem
          data-field="per-pack"
          :label="{text: 'Количество в упаковке/таре'}"
          help-text="Если сырье поставляется штучно, оставьте равным нулю"
          editor-type="dxNumberBox"
          :editor-options="{min: 0}"
        />
        <DxItem
          data-field="yellow_signal"
          :label="{text: 'Желтый остаток'}"
          editor-type="dxNumberBox"
          :editor-options="{min: 0}"
        />
        <DxItem
          data-field="red_signal"
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
import {DxFileUploader} from 'devextreme-vue/file-uploader'
import DEditPopup from '@/components/DEditPopup/editpopup.vue'
import {Raw, RawModule} from '../service'
import DButton from '@/components/DButton/button.vue'
import _ from 'lodash'
import {UserModule} from '@/store/modules/user'
import {filePost, fileDelete} from '@/utils/file-upload'
import axios, {AxiosResponse} from 'axios';

@Component({
  name: 'RawPopupEdit',
  components: {
    DxForm,
    DxItem,
    DButton,
    DEditPopup,
    DxFileUploader
  }
})
export default class extends Vue {
  private entity: Raw = new Raw();
  public state = RawModule;
  private imageToDelete: string | null = null
  private uploadUrl = `${process.env.VUE_APP_BASE_API}/files`

  public validationRules: any = {
    name: [
      {type: 'required', message: 'Название сырья не задано'}
    ]
  }

  async created() {
  }

  empty() {
  }

  onShow() {
    if (this.state.rawEditMode) {
      this.entity = _.cloneDeep(this.state.currentRaw)
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
