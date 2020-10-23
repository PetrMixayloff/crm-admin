<template>
  <div class="textbox-field">
    <div class="field-label">
      {{ title }}
    </div>

    <div class="field-input">
      <dx-number-box
        ref="numberBox"
        v-model="syncInputData"
        :read-only="isReadOnly"
        :step="step"
        @valueChanged="$emit('update:syncInputData', syncInputData)"
      >
        <dx-validator v-if="isRequired">
          <dx-required-rule message="Обязательное поле" />
        </dx-validator>
      </dx-number-box>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'vue-property-decorator'
import {
  DxNumberBox
} from 'devextreme-vue/ui/number-box'
import {
  DxValidator,
  DxRequiredRule,
  DxEmailRule,
  DxStringLengthRule
} from 'devextreme-vue/validator'

@Component({
  name: 'DNumberbox',
  components: {
    DxNumberBox,
    DxValidator,
    DxRequiredRule,
    DxEmailRule,
    DxStringLengthRule
  }
})
export default class extends Vue {
  @PropSync('inputData') public syncInputData!: number;
  @Prop({ default: '' }) public title!: string;
  @Prop({ default: false }) public isRequired!: boolean;
  @Prop({ default: false }) public isReadOnly!: boolean;
  @Prop({ default: 1 }) public step!: number;

  created() {

  }

  public setFocus() {
    const numberBox = (this.$refs.numberBox as any).instance
    numberBox.focus()
  }
}
</script>

<style lang="scss" scoped>
.component-container {
  margin: 5px;
}
</style>
