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
        :show-validation-summary="true"
        validation-group="rawEntity"
      >
        <DxItem
          data-field="name"
          :validation-rules="validationRules.name"
          :label="{text: 'Название сырья'}"
        />
        <DxItem
          data-field="description"
          :label="{text: 'Описание'}"
        />
        <DxItem
          data-field="unit"
          :label="{text: 'Единица измерения'}"
        />
        <DxItem
          data-field="per-pack"
          :label="{text: 'Количество в упаковке'}"
          help-text="Если сырье поставляется штучно, оставьте равным нулю"
          editor-type="dxNumberBox"
        />
        <DxItem
          data-field="green_signal"
          :label="{text: 'Зеленый остаток'}"
          editor-type="dxNumberBox"
        />
        <DxItem
          data-field="yellow_signal"
          :label="{text: 'Желтый остаток'}"
          editor-type="dxNumberBox"
        />
        <DxItem
          data-field="red_signal"
          :label="{text: 'Красный остаток'}"
          editor-type="dxNumberBox"
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
        :on-success="onImageUploaded"
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
import { Component, Vue } from 'vue-property-decorator'
import { DxForm, DxItem } from 'devextreme-vue/form'
import { DxFileUploader } from 'devextreme-vue/file-uploader'
import DEditPopup from '@/components/DEditPopup/editpopup.vue'
import { Raw, RawModule } from '../service'
import DButton from '@/components/DButton/button.vue'
import _ from 'lodash'
import { UserModule } from '@/store/modules/user'

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
  private deletedRawImage: string | null = null
  private token = `Bearer ${UserModule.token}`

  private uploadUrl = `${process.env.VUE_APP_BASE_API}/files`

  public validationRules: any = {
    name: [
      { type: 'required', message: 'Название сырья не задано' }
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
  }

  async onOk(e: any) {
    const result = e.validationGroup.validate()
    if (result.isValid) {
      try {
        await this.state.crudRaw.save(this.entity)
        await this.state.rawDataSource.reload()
        await this.state.initItems()
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

  onUploaded(e: any) {
    //
  }

  onRemove() {
    //
  }

  async onImageRemove() {
    if (!_.isNil(this.$refs.rawImage) && !_.isNil((this.$refs.rawImage as any).uploadFiles)) {
      (this.$refs.rawImage as any).clearFiles()
    }
    if (!_.isNil(this.entity.image)) {
      this.deletedRawImage = this.entity.image.split('/')[0]
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
    return this.state.currentRaw.image
  }

  get showDeleteButton() {
    if (!_.isNil(this.$refs.rawImage) && !_.isNil((this.$refs.rawImage as any).uploadFiles) && (this.$refs.rawImage as any).uploadFiles.length > 0) {
      return true
    }
    return !_.isNil(this.entity.image)
  }

  onImageChange() {
    if (!_.isNil(this.$refs.rawImage) && !_.isNil((this.$refs.rawImage as any).uploadFiles) && (this.$refs.rawImage as any).uploadFiles.length > 1) {
      (this.$refs.rawImage as any).uploadFiles.shift()
    }
  }

  onImageUploaded(e: any) {
    this.entity.image = e.file_name
  }
}
</script>

<style lang="scss" scoped>
#form-container {
  margin: 10px 10px 30px;
}
</style>
