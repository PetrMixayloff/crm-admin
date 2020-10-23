<template>
  <div class="textbox-field">
    <div class="field-label">
      {{ title }}
    </div>

    <div class="field-input">
      <dx-select-box
        v-model="syncInputData"
        :read-only="isReadOnly"
        :disabled="isDisabled"
        :data-source="dataSource"
        :display-expr="displayExpr"
        :value-expr="valueExpr"
        :is-valid="isValid"
        :show-clear-button="showClearButton"
        @valueChanged="$emit('update:syncInputData', syncInputData)"
      >
        <dx-validator v-if="isRequired">
          <dx-required-rule message="Обязательное поле" />
        </dx-validator>
      </dx-select-box>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'vue-property-decorator'
import {
  DxSelectBox
} from 'devextreme-vue/ui/select-box'
import {
  DxValidator,
  DxRequiredRule,
  DxEmailRule,
  DxStringLengthRule
} from 'devextreme-vue/validator'

@Component({
  name: 'DSelectbox',
  components: {
    DxSelectBox,
    DxValidator,
    DxRequiredRule,
    DxEmailRule,
    DxStringLengthRule
  }
})
export default class extends Vue {
  @Prop() public dataSource!: any;
  @PropSync('inputData') syncInputData!: any
  @Prop({ default: '' }) public title!: string;
  @Prop({ default: true }) public isValid!: boolean;
  @Prop({ default: false }) public isRequired!: boolean;
  @Prop({ default: null }) public valueExpr!: string;
  @Prop({ default: null }) public displayExpr!: string;
  @Prop({ default: false }) public isReadOnly!: boolean;
  @Prop({ default: false }) public isDisabled!: boolean;
  @Prop({ default: false }) public showClearButton!: boolean;

  created() {

  }
}
</script>

<style lang="scss" scoped>
.component-container {
  margin: 5px;
}
</style>
