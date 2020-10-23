<template>
  <div class="component-container">
    <dx-button
      :type="btnType"
      :styling-mode="stylingMode"
      :icon="icon"
      :text="btnText"
      :disabled="disabled"
      :validation-group="validationGroup"
      :use-submit-behavior="useSubmitBehavior"
      @click="onClick($event)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import {
  DxButton
} from 'devextreme-vue/ui/button'

@Component({
  name: 'DButton',
  components: {
    DxButton
  }
})
export default class extends Vue {
  @Prop({
    default: () => {
    }
  }) public onClick!: Function;

  @Prop({ default: 'success' }) public btnType!: string;
  @Prop({ default: '' }) public btnText!: string;
  @Prop({ default: 'contained' }) public stylingMode!: string;
  @Prop({ default: '' }) public icon!: string;
  @Prop({ default: false }) public disabled!: boolean;
  @Prop({ default: false }) public useSubmitBehavior!: boolean;
  @Prop({ default: '' }) public validationGroup!: string;

  created() {

  }
}
</script>

<style lang="scss" scoped>
.component-container {
  margin: 5px;
}
</style>
