<template>
  <div class="app-container">
    <div class="flex-l-t">
      <el-card>
        <DxTreeView
          id="simple-treeview"
          :items="products"
          :width="300"
          :search-enabled="true"
          search-mode="contains"
          @item-click="selectItem"
        />
      </el-card>
      <el-card style="width: 100%;">
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DxTreeView from 'devextreme-vue/tree-view'

@Component({
  name: 'Products',
  components: {
    DxTreeView
  }
})
export default class extends Vue {
  public products = []
  public currentItem = {}

  selectItem(e: any) {
    this.currentItem = e.itemData
  }
}
</script>
