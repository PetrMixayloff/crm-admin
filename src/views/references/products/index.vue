<template>
  <div class="app-container">
    <div class="flex-l-t">
      <div>
        <d-button
          btn-text="Новая категория"
          icon="plus"
          btn-type="default"
          :on-click="createNewCategory"
        />
        <DxTreeView
          id="simple-treeview"
          :items="items"
          :width="300"
          :search-enabled="true"
          search-mode="contains"
          @item-click="selectItem"
        />
      </div>
      <div style="width: 100%;"/>
    </div>
    <CategoryPopupEdit/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DxTreeView from 'devextreme-vue/tree-view'
import { ProductsModule } from './service'
import CategoryPopupEdit from './components/category-edit-popup.vue'
import DButton from '@/components/DButton/button.vue'

@Component({
  name: 'Products',
  components: {
    DxTreeView,
    DButton,
    CategoryPopupEdit
  }
})
export default class extends Vue {
  public state = ProductsModule
  public productDataSource = this.state.productDataSource
  public categoryDataSource = this.state.categoryDataSource
  public items = this.state.items

  public currentItem = {}

  async mounted() {
    await this.initItems()
  }

  async initItems() {
    const newItems: Array<any> = []
    const categories: any = await this.state.crudCategory.load()
    // const products = this.state.crudProduct.load()
    categories.data.forEach((category: any) => {
      newItems.push({
        id: category.id,
        text: category.name,
        expanded: false,
        items: category.products
      })
    })
    this.state.SetItems(newItems)
  }

  selectItem(e: any) {
    this.currentItem = e.itemData
  }

  createNewCategory() {
    this.state.SetCategoryEditVisible(true)
  }
}
</script>
