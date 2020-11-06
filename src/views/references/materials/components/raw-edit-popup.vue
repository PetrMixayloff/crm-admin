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
          data-field="price"
          :label="{text: 'Цена'}"
          editor-type="dxNumberBox"
        />
        <DxItem
          data-field="quantity"
          :label="{text: 'Остаток на складе'}"
          editor-type="dxNumberBox"
        />
        <DxItem
          data-field="unit"
          :label="{text: 'Единица измерения'}"
        />
        <DxItem
          data-field="per-pack"
          :label="{text: 'Количество в упаковке'}"
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
        <DxItem
          data-field="images"
          editor-type="dxGallery"
          :label="{text: 'Изображения'}"
          :editor-options="{dataSource: entity.images.length > 0 ? entity.images : ['https://baloon-crm.s3-eu-west-1.amazonaws.com/default.png'],
                            width: 200}"
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
import {Raw, RawModule} from '../service'
import _ from 'lodash'

@Component({
  name: 'RawPopupEdit',
  components: {
    DxForm,
    DxItem,
    DEditPopup,
    DxFileUploader
  }
})
export default class extends Vue {
  private entity: Raw = new Raw();
  public state = RawModule;

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
  }

  async onOk(e: any) {
    const result = e.validationGroup.validate()
    if (result.isValid) {
      try {
        await this.state.crudRaw.save(this.entity)
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
}
</script>

<style lang="scss" scoped>
#form-container {
  margin: 10px 10px 30px;
}
</style>
