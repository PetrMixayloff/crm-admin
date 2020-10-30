<template>
  <div class="app-container">
    <div class="top-panel">
      <div class="export">
        <d-button
          btn-text="Новая категория"
          icon="plus"
          btn-type="default"
          :on-click="createNewCategory"
        />
      </div>
      <div class="search">
        <el-input
          v-model="filterText"
          placeholder="Поиск"
          class="input-with-select"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
          />
        </el-input>
      </div>
    </div>
    <div class="main-box-content">
      <DxScrollView
        direction="both"
        show-scrollbar="always"
        class="filter-tree"
      >
        <el-tree
          ref="tree"
          node-key="id"
          :data="state.items"
          :props="defaultProps"
          default-expand-all
          :expand-on-click-node="false"
          :highlight-current="true"
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
        >
          <div
            slot-scope="{node, data}"
            class="custom-tree-node"
          >
            <div class="node-label">
              {{ node.label }}
            </div>
            <div class="manage-buttons">
              <DHintBox
                v-if="node.isCurrent"
                hint="Удалить категорию"
              >
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  class="custom-icon"
                  @click="removeCategory"
                />
              </DHintBox>
            </div>
          </div>
        </el-tree>
      </DxScrollView>
      <div class="doc-view-box"/>
    </div>
    <CategoryPopupEdit/>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import DxTreeView from 'devextreme-vue/tree-view'
import { ProductsModule } from './service'
import CategoryPopupEdit from './components/category-edit-popup.vue'
import DButton from '@/components/DButton/button.vue'
import DHintBox from '@/components/DHintBox/index.vue'
import { DxScrollView } from 'devextreme-vue'
import { confirm } from 'devextreme/ui/dialog'

@Component({
  name: 'Products',
  components: {
    DxTreeView,
    DButton,
    DHintBox,
    DxScrollView,
    CategoryPopupEdit
  }
})
export default class extends Vue {
  public state = ProductsModule
  public productDataSource = this.state.productDataSource
  public categoryDataSource = this.state.categoryDataSource
  private filterText = ''
  private currentNode: any = null

  public currentItem = {}

  private defaultProps = {
    id: 'id',
    children: 'children',
    label: 'label'
  }

  @Watch('filterText')
  findValue(val: any) {
    const tree: any = this.$refs.tree
    tree.filter(val)
  }

  async mounted() {
    await this.state.initItems()
  }

  filterNode(value: any, data: any) {
    // фильтр элементов дерева по введенному значению
    if (!value) return true
    return data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
  }

  async remove() {
    //
  }

  removeCategory() {
    confirm('Внимание!!! Удаление категории приведет к удалению всех ее товаров. Удалить выбранную категорию?', 'Удаление категории')
      .then(async(answer: boolean) => {
        if (!answer) {
          return
        }
        try {
          await this.state.crudCategory.delete(this.currentNode.id)
          await this.state.initItems()
          this.currentNode = null
        } catch (e) {
          console.log(e)
        }
      })
  }

  handleNodeClick(data: any, node: any) {
    this.currentNode = data
  }

  selectItem(e: any) {
    this.currentItem = e.itemData
  }

  createNewCategory() {
    this.state.SetCategoryEditVisible(true)
  }
}
</script>

<style scoped>
.content-box {
  width: 100%;
  height: 100%;
  padding-bottom: 50px;
}

.top-panel {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.export {
  flex-grow: 0;
  flex-shrink: 0;
  margin: 0 10px 0 0;
}

.search {
  flex-grow: 1;
  flex-shrink: 1;
}

.main-box-content {
  display: flex;
  justify-content: space-between;
  height: 100%;
  margin-top: 10px;
}

.filter-tree {
  width: 28%;
  height: 100%;
}

.doc-view-box {
  width: 70%;
  height: 700px;
  margin-bottom: 10px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.custom-tree-node > .manage-buttons {
  float: left;
  z-index: 2;
}

.custom-icon {
  font-size: 1.5rem;
  color: black;
}

.custom-icon:hover {
  opacity: 0.8;
}

dfn div {
  display: inline;
}
</style>
