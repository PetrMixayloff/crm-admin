<template>
  <DxValidationGroup :height="groupHeight">
    <slot />
  </DxValidationGroup>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import DxValidationGroup from 'devextreme-vue/validation-group'

    @Component({
      name: 'DValidationGroup',
      components: {
        DxValidationGroup
      }
    })
export default class extends Vue {
        @Prop({ default: '' }) public title!: string;
        @Prop() public height!: any;

        created() {
        }

        groupHeight() {
          if (this.height) {
            return this.height
          }
          return undefined
        }
}
</script>

<style lang="scss" scoped>

</style>
