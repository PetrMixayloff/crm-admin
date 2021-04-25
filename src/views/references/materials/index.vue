<template>
  <div class="app-container">
    <div class="main-box-content">
      <DxScrollView
        direction="both"
        show-scrollbar="always"
        class="filter-tree"
      >
        <dx-button
          text="Новая категория"
          icon="plus"
          type="default"
          :on-click="createNewCategory"
        />
        <h3>Категории</h3>
        <DxTreeView
          id="materialsTreeView"
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
              <div v-if="item.data.id === state.currentCategory.id && item.data.id !== '0'">
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
      </DxScrollView>
      <div class="products-list">
        <table-actions
          :on-create-new="createNewRaw"
          :show-create-new="state.currentCategory.id && state.currentCategory.id !== '0'"
          :on-edit="editRaw"
          :on-delete="deleteRaw"
          :table-title="state.currentCategory.name"
          :selected="state.currentRaw.id"
        />
        <table-grid
          ref="tablegrid"
          :data-source="rawDataSource"
          :columns="rawColumns"
          :filter-value="state.currentCategory.id && state.currentCategory.id !== '0' ? ['category_id', '=', state.currentCategory.id] : null"
          :row-click="onRowClick"
          :dbl-row-click="editRaw"
          selection-mode="single"
        />
      </div>
    </div>
    <RawCategoryPopupEdit/>
    <RawPopupEdit/>
    <ShowRemainsDetailsPopup/>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator'
import DxTreeView from 'devextreme-vue/tree-view'
import {RawModule, table_name} from './service'
import RawCategoryPopupEdit from './components/category-edit-popup.vue'
import RawPopupEdit from './components/raw-edit-popup.vue'
import ShowRemainsDetailsPopup from './components/show-remains-details.vue'
import TableGrid from '@/components/TableGrid/grid.vue'
import TableActions from '@/components/TableActions/actions.vue'
import DTextarea from '@/components/DTextarea/textarea.vue'
import {DxScrollView} from 'devextreme-vue'
import {confirm} from 'devextreme/ui/dialog'
import dbSchemaService from '@/services/db_schema_service'
import DxButton from 'devextreme-vue/button'

@Component({
  name: 'Materials',
  components: {
    DxTreeView,
    DxButton,
    DxScrollView,
    TableActions,
    TableGrid,
    DTextarea,
    RawCategoryPopupEdit,
    RawPopupEdit,
    ShowRemainsDetailsPopup
  }
})
export default class extends Vue {
  public state = RawModule
  public rawDataSource = this.state.rawDataSource
  public categoryDataSource = this.state.rawCategoryDataSource
  public rawColumns = [
    {
      dataField: 'id',
      dataType: 'string',
      visible: false
    },
    {
      dataField: 'category_id',
      dataType: 'string',
      visible: false
    },
    {
      dataField: 'image',
      dataType: 'string',
      caption: 'Изображение',
      allowFiltering: false,
      allowSorting: false,
      cellTemplate: 'image-cell-template',
      width: 100
    },
    {
      dataField: 'name',
      dataType: 'string',
      caption: 'Название'
    },
    {
      dataField: 'unit',
      dataType: 'string',
      caption: 'Ед. изм.',
      allowSorting: false,
      width: 70
    },
    {
      caption: 'Остатки',
      alignment: 'center',
      columns: [
        {
          caption: 'Кол-во',
          dataType: 'number',
          allowSorting: false,
          width: 70
        },
        {
          caption: 'Резерв',
          dataType: 'number',
          allowSorting: false,
          width: 70
        },
        {
          caption: 'Итого',
          dataType: 'number',
          allowSorting: false,
          width: 70
        },
      ]
    },
    {
      caption: 'Сумма',
      dataType: 'number',
      allowSorting: false,
      width: 100
    },
    {
      type: 'buttons',
      width: 40,
      fixed: true,
      buttons: [{
        hint: 'Детализация остатков',
        icon: 'info',
        visible: true,
        onClick: this.onRawDetail
      }]
    }
  ]

  public emptyEntity: any = {};

  onRawDetail(e: any) {
    this.state.SetCurrentRaw(e.row.data)
    this.state.ShowRemainsDetails(true)
  }

  deleteCategory() {
    confirm('Внимание!!! Удаление категории приведет к удалению всех дочерних подкатегорий и их сырья. Удалить выбранную категорию?', 'Удаление категории')
      .then(async (answer: boolean) => {
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
    this.state.SetCurrentCategory(e.itemData)
    this.state.ResetCurrentRaw()
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

  editRaw() {
    this.state.SetRawEditVisible(true)
    this.state.SetRawEditMode(true)
  }

  deleteRaw() {
    confirm('Вы уверены, что хотите удалить?', 'Удаление сырья')
      .then(async (answer: boolean) => {
        if (!answer) {
          return
        }
        try {
          await this.state.crudRaw.delete(this.state.currentRaw.id)
          await this.state.rawDataSource.reload()
          this.state.ResetCurrentRaw()
        } catch (e) {
          console.log(e)
        }
      })
  }

  onRowClick(e: any) {
    this.state.SetCurrentRaw(e.data)
  }

  empty() {
    //
  }

}
</script>

<style scoped>

.main-box-content {
  display: flex;
  justify-content: flex-start;
  height: 100%;
  margin-top: 10px;
}

.filter-tree {
  width: 25%;
  height: 100%;
}

.products-list {
  padding: 0 20px;
  width: 74%;
  height: 700px;
  margin-bottom: 10px;
}
</style>
