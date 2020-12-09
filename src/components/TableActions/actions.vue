<template>
  <div class="component-container">
    <div class="flex-between-c">
      <h2>
        {{ tableTitle || '' }}
      </h2>
      <div class="flex-r-c grid-actions">
        <d-button
          v-if="showCreateNew"
          :btn-text="compactMode ? '': relationMode === 'many' ? 'Добавить' : 'Создать'"
          icon="plus"
          btn-type="default"
          :on-click="createNew"
        />

        <d-button
          v-if="onEdit"
          :btn-text="compactMode ? '': 'Изменить'"
          icon="edit"
          btn-type="normal"
          :disabled="!selected"
          :on-click="edit"
        />

        <d-button
          v-if="onDelete"
          :btn-text="compactMode ? '': 'Удалить'"
          icon="trash"
          btn-type="danger"
          :disabled="!selected"
          :on-click="remove"
        />

        <d-button
          v-if="onGridRefresh"
          :btn-text="compactMode ? '': 'Обновить'"
          icon="refresh"
          btn-type="normal"
          :on-click="refresh"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import DButton from '@/components/DButton/button.vue'

@Component({
  name: 'TableActions',
  components: {
    DButton
  }
})
export default class extends Vue {
  @Prop() private onCreateNew!: Function;
  @Prop() private onEdit!: Function;
  @Prop() private onView!: Function;
  @Prop({ required: false }) private onDelete!: Function;
  @Prop({ required: false }) private onGridRefresh!: Function;
  @Prop({ required: true }) private selected!: boolean;
  @Prop() private tableTitle!: string;
  @Prop() public relationMode!: any;
  @Prop() public compactMode!: boolean;
  @Prop({ default: true }) public showCreateNew!: boolean;

  created() {

  }

  createNew() {
    this.onCreateNew()
  }

  edit() {
    this.onEdit()
  }

  view() {
    this.onView()
  }

  remove() {
    this.onDelete()
  }

  refresh() {
    this.onGridRefresh()
  }
}
</script>

<style lang="scss" scoped>
.grid-actions {
  margin-bottom: 20px;
}
</style>
