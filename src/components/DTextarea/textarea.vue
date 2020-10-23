<template>
  <div class="textbox-field">
    <div class="field-label">
      {{ title }}
    </div>

    <div class="field-input">
      <dx-text-area
        v-model="syncInputData"
        :height="height"
        :read-only="isReadOnly"
        :disabled="isDisabled"
        :visible="true"
        styling-mode="outlined"
        @valueChanged="$emit('update:syncInputData', syncInputData)"
      >
        <dx-validator v-if="isRequired">
          <dx-required-rule message="Обязательное поле" />
        </dx-validator>
      </dx-text-area>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'vue-property-decorator'
import {
  DxTextArea
} from 'devextreme-vue/ui/text-area'
import {
  DxValidator,
  DxRequiredRule,
  DxEmailRule,
  DxStringLengthRule
} from 'devextreme-vue/validator'

@Component({
  name: 'DTextarea',
  components: {
    DxTextArea,
    DxValidator,
    DxRequiredRule,
    DxEmailRule,
    DxStringLengthRule
  }
})
export default class extends Vue {
  @PropSync('inputData') syncInputData!: string
  @Prop({ default: '' }) public title!: string;
  @Prop({ default: false }) public isRequired!: boolean;
  @Prop({ default: false }) public isReadOnly!: boolean;
  @Prop({ default: false }) public isDisabled!: boolean;
  @Prop() public height!: string | number | Function;

  created() {

  }
}
</script>

<style lang="scss" scoped>
  .component-container {
    margin: 5px;
  }
  .field-input {
    margin-top: 15px;
  }
</style>
