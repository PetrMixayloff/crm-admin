<template>
  <div class="app-container">
    <!--    <div class="top-panel">-->
    <!--      <div class="export">-->
    <!--        <d-button-->
    <!--          btn-text="Новая категория"-->
    <!--          icon="plus"-->
    <!--          btn-type="default"-->
    <!--          :on-click="createNewCategory"-->
    <!--        />-->
    <!--      </div>-->
    <!--      <div class="search">-->
    <!--        <el-input-->
    <!--          v-model="filterText"-->
    <!--          placeholder="Поиск"-->
    <!--          class="input-with-select"-->
    <!--        >-->
    <!--          <el-button-->
    <!--            slot="append"-->
    <!--            icon="el-icon-search"-->
    <!--          />-->
    <!--        </el-input>-->
    <!--      </div>-->
    <!--    </div>-->
    <div class="main-box-content">
      <DxScrollView
        direction="both"
        show-scrollbar="always"
        class="filter-tree"
      >
        <d-button
          btn-text="Новая категория"
          icon="plus"
          btn-type="default"
          :on-click="createNewCategory"
        />
        <DxTreeView
          id="treeview"
          :data-source="categoryDataSource"
          :search-enabled="true"
          data-structure="plain"
          parent-id-expr="parent_id"
          key-expr="id"
          display-expr="name"
          @item-click="handleNodeClick"
        >
          <template #item="item">
            <div class="flex-between-c">
              <span>{{ item.data.name }}</span>
              <div v-if="item.data.id === state.currentCategory.id">
                <dx-button
                  icon="plus"
                  type="default"
                  styling-mode="text"
                  hint="Добавить подкатегорию"
                  :on-click="createNewCategory"
                />
                <dx-button
                  icon="edit"
                  type="normal"
                  styling-mode="text"
                  hint="Редактировать категорию"
                  :on-click="editCategory"
                />
                <dx-button
                  icon="trash"
                  type="danger"
                  styling-mode="text"
                  hint="Удалить категорию"
                  :on-click="deleteCategory"
                />
              </div>

            </div>
          </template>
        </DxTreeView>
        <!--        <el-tree-->
        <!--          ref="tree"-->
        <!--          node-key="id"-->
        <!--          :data="state.items"-->
        <!--          :props="defaultProps"-->
        <!--          default-expand-all-->
        <!--          :expand-on-click-node="false"-->
        <!--          :highlight-current="true"-->
        <!--          :filter-node-method="filterNode"-->
        <!--          @node-click="handleNodeClick"-->
        <!--        >-->
        <!--          <div-->
        <!--            slot-scope="{node, data}"-->
        <!--            class="custom-tree-node"-->
        <!--          >-->
        <!--            <div class="node-label">-->
        <!--              {{ node.label }}-->
        <!--            </div>-->
        <!--            <div v-if="node.isCurrent && data.raws" class="manage-buttons">-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </el-tree>-->
      </DxScrollView>
      <div
        v-if="state.currentRow"
        class="doc-view-box"
      >
        <table-actions
          :on-create-new="createNewRaw"
          :show-create-new="state.currentCategory.id"
          :on-edit="editRaw"
          :on-delete="deleteRaw"
          :table-title="state.currentCategory.name"
          :selected="state.currentRaw.id"
        />
        <div v-if="state.currentCategory.id">
          <table-grid
            ref="tablegrid"
            :data-source="rawDataSource"
            :columns="rawColumns"
            :filter-sync-enabled="true"
            :filter-value="['category_id', '=', state.currentCategory.id]"
            :row-click="onRowClick"
            :dbl-row-click="empty"
            selection-mode="single"
            @cell-prepared="onCellPrepared"
          />
        </div>
        <DxScrollView v-else-if="showProductDeatils">
          <div class="flex-l-b">
            <img
              :src="state.currentRaw.image > 0 ? state.currentRaw.image :
                ['https://baloon-crm.s3-eu-west-1.amazonaws.com/default.png']"
              alt=""
              width="25%"
            >
            <p style="margin-left: 20px; width: 100%">
              {{ state.currentRaw.description }}
            </p>
          </div>
          <div class="flex-l-c">
            <d-numberbox
              class="textbox-field"
              :input-data="state.currentRaw.quantity"
              title="Общий остаток на складе"
              :is-read-only="true"
            />
            <d-button
              style="margin-left: 20px;"
              btn-text="Детализация"
              icon="info"
              btn-type="default"
              :on-click="detailView"
            />
          </div>
          <d-numberbox
            class="textbox-field"
            :input-data="state.currentRaw.price"
            title="Суммарная стоимость остатка"
            :is-read-only="true"
          />
          <d-textbox
            class="textbox-field"
            :input-data="state.currentRaw.unit"
            title="Единица измерения"
            :is-read-only="true"
          />
          <d-numberbox
            v-if="state.currentRaw.per_pack"
            class="textbox-field"
            :input-data="state.currentRaw.per_pack"
            title="Количество в упаковке"
            :is-read-only="true"
          />
          <d-numberbox
            class="textbox-field"
            :input-data="state.currentRaw.green_signal"
            title="Зеленый остаток"
            :is-read-only="true"
          />
          <d-numberbox
            class="textbox-field"
            :input-data="state.currentRaw.yellow_signal"
            title="Желтый остаток"
            :is-read-only="true"
          />
          <d-numberbox
            class="textbox-field"
            :input-data="state.currentRaw.red_signal"
            title="Красный остаток"
            :is-read-only="true"
          />
        </DxScrollView>
      </div>
    </div>
    <RawCategoryPopupEdit/>
    <RawPopupEdit/>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator'
import DxTreeView from 'devextreme-vue/tree-view'
import {RawModule, table_name} from './service'
import {DxForm, DxItem} from 'devextreme-vue/form'
import RawCategoryPopupEdit from './components/category-edit-popup.vue'
import RawPopupEdit from './components/raw-edit-popup.vue'
import DButton from '@/components/DButton/button.vue'
import DTextbox from '@/components/DTextbox/textbox.vue'
import DNuberbox from '@/components/DNumberbox/numberbox.vue'
import TableGrid from '@/components/TableGrid/grid.vue'
import DHintBox from '@/components/DHintBox/index.vue'
import TableActions from '@/components/TableActions/actions.vue'
import DTextarea from '@/components/DTextarea/textarea.vue'
import {DxScrollView} from 'devextreme-vue'
import {confirm} from 'devextreme/ui/dialog'
import DNumberbox from '@/components/DNumberbox/numberbox.vue'
import dbSchemaService from '@/services/db_schema_service'
import DxButton from 'devextreme-vue/button'
import _ from 'lodash'

@Component({
  name: 'Materials',
  components: {
    DNumberbox,
    DxTreeView,
    DButton,
    DxButton,
    DHintBox,
    DxScrollView,
    DxForm,
    DxItem,
    DTextbox,
    DNuberbox,
    TableActions,
    TableGrid,
    DTextarea,
    RawCategoryPopupEdit,
    RawPopupEdit
  }
})
export default class extends Vue {
  public state = RawModule
  public rawDataSource = this.state.rawDataSource
  public categoryDataSource = this.state.rawCategoryDataSource
  public showProductDeatils = false
  private filterText = ''
  public rawColumns: Array<any> = [];
  public emptyEntity: any = {};
  public selection = {
    allowSelectAll: true,
    deferred: false,
    mode: 'multiple',
    selectAllMode: 'allPages',
    showCheckBoxesMode: 'always'
  }

  private defaultProps = {
    id: 'id',
    children: 'raws',
    label: 'name'
  }

  created() {
    this.initColumns()
  }

  initColumns() {
    const included = ['image', 'category_id', 'name', 'unit', 'price', 'quantity'];

    [this.rawColumns, this.emptyEntity] = dbSchemaService.prepareGridColumns(
      table_name, included, this.categoryDataSource)
  }

  // @Watch('filterText')
  // findValue(val: any) {
  //   const tree: any = this.$refs.tree
  //   tree.filter(val)
  // }

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

  deleteCategory() {
    confirm('Внимание!!! Удаление категории приведет к удалению всех дочерних подкатегорий и их сырья. Удалить выбранную категорию?', 'Удаление категории')
      .then(async(answer: boolean) => {
        if (!answer) {
          return
        }
        try {
          await this.state.crudRawCategory.delete(this.state.currentCategory.id)
          await this.state.rawCategoryDataSource.reload()
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

  handleNodeClick(e: any) {
    // let {is_active, ...rowData} = data;
    this.state.SetCurrentRow(e.itemData)
    if (e.itemData.raws) {
      this.state.ResetCurrentRaw()
      this.state.SetCurrentCategory(e.itemData)
    } else {
      this.state.SetCurrentRaw(e.itemData)
    }
  }

  createNewCategory() {
    this.state.ResetCurrentCategory()
    this.state.SetCategoryEditVisible(true)
  }

  createNewSubCategory() {
    this.state.SetCategoryEditVisible(true)
  }

  createNewRaw() {
    this.state.SetRawEditVisible(true)
  }

  detailView() {
    //
  }

  editRaw() {
    this.state.SetRawEditVisible(true)
    this.state.SetRawEditMode(true)
  }

  deleteRaw() {
    confirm('Вы уверены, что хотите удалить?', 'Удаление сырья')
      .then(async(answer: boolean) => {
        if (!answer) {
          return
        }
        try {
          await this.state.crudRaw.delete(this.state.currentRaw.id)
          await this.state.rawDataSource.reload()
          await this.state.initItems()
          this.state.ResetCurrentRaw()
        } catch (e) {
          console.log(e)
        }
      })
  }

  onRowClick(e: any) {
    this.state.SetCurrentRaw(e.data)
  }

  onCellPrepared(e: any) {
    if (e.columnIndex === 0 && e.cellElement.attributes[1].nodeName === 'aria-describedby') {
      e.cellElement.innerHTML = '<img\n' +
        '                src="https://baloon-crm.s3-eu-west-1.amazonaws.com/default.png"\n' +
        '                alt=""\n' +
        '                width="30%"\n' +
        '                heigh="30%"\n' +
        '              >'
    }
  }

  empty() {
    //
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

.textbox-field {
  font-size: 18px;
  padding-top: 20px;
  line-height: 1.5;
}
</style>
