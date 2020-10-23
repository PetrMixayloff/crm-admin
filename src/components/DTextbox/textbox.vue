<template>
  <div class="textbox-field">
    <div class="field-label">
      {{ title }}
    </div>

    <div class="field-input w100">
      <dx-text-box
        v-model="syncInputData"
        :read-only="isReadOnly"
        :is-valid="isValid"
        :disabled="isDisabled"
        @valueChanged="$emit('update:syncInputData', syncInputData)"
      >
        <dx-validator v-if="isRequired">
          <dx-required-rule message="Обязательное поле" />
        </dx-validator>
      </dx-text-box>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'vue-property-decorator'
import {
  DxTextBox
} from 'devextreme-vue/ui/text-box'
import {
  DxValidator,
  DxRequiredRule,
  DxEmailRule,
  DxStringLengthRule
} from 'devextreme-vue/validator'

@Component({
  name: 'DTextbox',
  components: {
    DxTextBox,
    DxValidator,
    DxRequiredRule,
    DxEmailRule,
    DxStringLengthRule
  }
})
export default class extends Vue {
  @PropSync('inputData') syncInputData!: string
  @Prop({ default: '' }) public title!: string;
  @Prop({ default: true }) public isValid!: boolean;
  @Prop({ default: false }) public isRequired!: boolean;
  @Prop({ default: false }) public isReadOnly!: boolean;
  @Prop({ default: false }) public isDisabled!: boolean;

  created() {
  }
}
</script>

<style lang="scss" scoped>
.textbox-field {
  width: 100%;
}

</style>
