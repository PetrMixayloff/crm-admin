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
            <div v-if="node.isCurrent" class="manage-buttons">
              <dfn>
                <DHintBox hint="Редактировать категорию">
                  <el-button
                    type="text"
                    icon="el-icon-edit"
                    class="custom-icon"
                    @click="editCategory"
                  />
                </DHintBox>
              </dfn>
              <dfn>
                <DHintBox hint="Удалить категорию">
                  <el-button
                    type="text"
                    icon="el-icon-delete"
                    class="custom-icon"
                    @click="removeCategory"
                  />
                </DHintBox>
              </dfn>
            </div>
          </div>
        </el-tree>
      </DxScrollView>
      <div class="doc-view-box">
        <div v-if="!state.currentRaw.id">
          <d-button
            btn-text="Добавиьт сырье в категорию"
            icon="plus"
            btn-type="default"
            :disabled="!state.currentCategory.id"
            :on-click="createNewRaw"
          />
          <DxForm
            id="form"
            ref="dxform"
            :form-data.sync="state.currentCategory"
            :read-only="true"
          >
            <DxItem
              data-field="name"
              :label="{text: 'Название категории'}"
            />
            <DxItem
              data-field="description"
              :label="{text: 'Описание'}"
            />
          </DxForm>
        </div>
      </div>
    </div>
    <RawCategoryPopupEdit/>
    <RawPopupEdit/>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator'
import DxTreeView from 'devextreme-vue/tree-view'
import {RawModule} from './service'
import {DxForm, DxItem} from 'devextreme-vue/form'
import RawCategoryPopupEdit from './components/category-edit-popup.vue'
import RawPopupEdit from './components/raw-edit-popup.vue'
import DButton from '@/components/DButton/button.vue'
import DHintBox from '@/components/DHintBox/index.vue'
import {DxScrollView} from 'devextreme-vue'
import {confirm} from 'devextreme/ui/dialog'

@Component({
  name: 'Materials',
  components: {
    DxTreeView,
    DButton,
    DHintBox,
    DxScrollView,
    DxForm,
    DxItem,
    RawCategoryPopupEdit,
    RawPopupEdit
  }
})
export default class extends Vue {
  public state = RawModule
  public rawDataSource = this.state.rawDataSource
  public categoryDataSource = this.state.rawCategoryDataSource
  private filterText = ''

  private defaultProps = {
    id: 'id',
    children: 'raws',
    label: 'name'
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
    confirm('Внимание!!! Удаление категории приведет к удалению всего ее сырья. Удалить выбранную категорию?', 'Удаление категории')
      .then(async (answer: boolean) => {
        if (!answer) {
          return
        }
        try {
          await this.state.crudRawCategory.delete(this.state.currentCategory.id)
          await this.state.initItems()
          this.state.ResetCurrentRow()
        } catch (e) {
          console.log(e)
        }
      })
  }

  editCategory() {
    this.state.SetCategoryEditVisible(true)
    this.state.SetCategoryEditMode(true)
  }

  handleNodeClick(data: any, node: any) {
    if (data.raws) {
      let {is_active, ...category} = data;
      this.state.SetCurrentCategory(category)
    } else {
      this.state.SetCurrentRaw(data)
    }
  }

  createNewCategory() {
    this.state.SetCategoryEditVisible(true)
  }

  createNewRaw() {
    this.state.SetRawEditVisible(true)
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
  justify-content: flex-start;
  height: 100%;
  margin-top: 10px;
}

.filter-tree {
  width: 28%;
  height: 100%;
}

.doc-view-box {
  padding: 0 20px;
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
