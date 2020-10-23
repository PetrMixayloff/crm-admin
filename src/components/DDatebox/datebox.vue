<template>
  <div class="textbox-field w100">
    <div class="field-label">
      {{ title }}
    </div>

    <div class="field-input w100">
      <dx-date-box
        v-model="syncInputData"
        width="100%"
        type="date"
        @valueChanged="$emit('update:syncInputData', syncInputData)"
      >
        <dx-validator v-if="isRequired">
          <dx-required-rule message="Обязательное поле" />
        </dx-validator>
      </dx-date-box>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'vue-property-decorator'
import {
  DxDateBox
} from 'devextreme-vue/ui/date-box'
import {
  DxValidator,
  DxRequiredRule,
  DxEmailRule,
  DxStringLengthRule
} from 'devextreme-vue/validator'

@Component({
  name: 'DDatebox',
  components: {
    DxDateBox,
    DxValidator,
    DxRequiredRule,
    DxEmailRule,
    DxStringLengthRule
  }
})
export default class extends Vue {
  @PropSync('inputData') syncInputData!: Date
  @Prop({ default: '' }) public title!: string;
  @Prop({ default: false }) public isRequired!: boolean;

  created() {

  }
}
</script>

<style lang="scss" scoped>
.component-container {
  margin: 5px;
}
</style>
