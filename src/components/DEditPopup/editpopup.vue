<template>
  <dx-popup
    :title="title"
    :visible="visible"
    :width="fitPopupWidth"
    :height="fitPopupHeight"
    :show-close-button="false"
    :resize-enabled="true"
    @shown="onShow"
    @hidden="onClose"
  >
    <div :class="'d-popup-container' + (cssClass ? ' ' + cssClass : '')">
      <DxScrollView
        direction="both"
        show-scrollbar="always"
      >
        <slot />
      </DxScrollView>

      <slot name="prefooter" />

      <div class="flex d-popup-action-container">
        <div class="flex-l-b">
          <slot name="footerleft" />
        </div>
        <div class="flex-r-b">
          <div>
            <d-button
              v-if="showOkButton"
              :btn-text="okButtonCaption"
              btn-type="success"
              styling-mode="contained"
              :disabled="disableOkButton"
              hint="Сохранить изменения"
              :on-click="onOk"
              :validation-group="validationGroup"
              :use-submit-behavior="true"
            />
          </div>

          <div>
            <d-button
              :btn-text="cancelButtonCaption"
              btn-type="danger"
              styling-mode="outlined"
              hint="Закрыть окно без сохранения измениний"
              :on-click="onCancel"
            />
          </div>
        </div>
      </div>
    </div>
  </dx-popup>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import {
  DxPopup, DxScrollView
} from 'devextreme-vue'

import DButton from '@/components/DButton/button.vue'
import { fitPopupHeight, fitPopupWidth } from '@/utils/index'

@Component({
  name: 'DEditPopup',
  components: {
    DxPopup,
    DxScrollView,
    DButton
  }
})
export default class extends Vue {
  @Prop({ default: '' }) public title!: string;
  @Prop({ required: true }) public visible!: boolean;
  @Prop({ default: undefined }) public defaultWidth!: number;
  @Prop({ default: undefined }) public defaultHeight!: number;
  @Prop({ default: 'Сохранить' }) public okButtonCaption!: string;
  @Prop({ default: 'Отменить' }) public cancelButtonCaption!: string;
  @Prop({ default: true }) public showOkButton!: boolean;
  @Prop({ default: false }) public disableOkButton!: boolean;
  @Prop({ default: '' }) public cssClass!: string;
  @Prop({ default: '' }) public validationGroup!: string;

  public empty() {

  }

  public fitPopupWidth() {
    return fitPopupWidth(this.defaultWidth)
  }

  public fitPopupHeight() {
    return fitPopupHeight(this.defaultHeight)
  }

  @Emit('shown')
  onShow() {
  }

  @Emit('hidden')
  onClose() {
  }

  @Emit('ok')
  onOk(e: any): any {
    return e
  }

  @Emit('cancel')
  onCancel(e: any): any {
    return e
  }
}
</script>

<style lang="scss">
.d-popup-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;

  .d-popup-edit-container {
    flex-grow: 1;
    flex-shrink: 1;

    .fields-contaner {
      .textbox-field, .selectbox-field {
        margin-top: 20px;
      }
    }
  }

  .d-popup-action-container {
    flex-grow: 0;
    flex-shrink: 0;
    margin-top: 30px;
    align-items: center;

    .dx-button {
      margin-left: 10px;
    }
  }
}
</style>
