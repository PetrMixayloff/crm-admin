<template>
  <div class="dx-state-hover"
       :title="hint">
    <slot />
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
/*
 ... Компонент для добавления сообщения-подсказки к элементу
 ... Обернуть элемент тегом <s-hint-box> и передать текст подсказки в свойстве hint
 */
@Component({
  name: 'DHintBox',
  components: {
  }
})
export default class extends Vue {
  @Prop({default: undefined}) public hint!: string;
  created() {
  }

}
</script>

<style lang="scss" >
</style>
