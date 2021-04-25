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
          id="productsTreeView"
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
          :on-create-new="createNewProduct"
          :show-create-new="state.currentCategory.id && state.currentCategory.id !== '0'"
          :on-edit="editProduct"
          :on-delete="deleteProduct"
          :table-title="state.currentCategory.name"
          :selected="state.currentProduct.id"
        />
        <table-grid
          ref="productsTableGrid"
          :data-source="productDataSource"
          :columns="columns"
          :master-detail-enable="true"
          :filter-value="state.currentCategory.id && state.currentCategory.id !== '0' ?
          ['category_id', '=', state.currentCategory.id] : null"
          :row-click="onRowClick"
          :dbl-row-click="editProduct"
          selection-mode="single"
        >
          <template #masterDetailTemplate="{rowKey, rowData}">
            <div>
              <div class="master-detail-caption"> Товары:</div>
              <dx-data-grid
                :data-source="rowData.raw"
                :allow-column-resizing="true"
                :row-alternation-enabled="true"
                :show-borders="true"
                :show-column-lines="true"
                :show-row-lines="true"
                :columns="rawColumns"
                :height="200"
                @row-click="empty"
                @row-dbl-click="empty"
              >
                <dx-load-panel
                  :enabled="true"
                />
              </dx-data-grid>
            </div>

          </template>
        </table-grid>
      </div>
    </div>
    <CategoryPopupEdit/>
    <ProductPopupEdit/>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import DxTreeView from 'devextreme-vue/tree-view'
import DxButton from 'devextreme-vue/button'
import {ProductsModule} from './service'
import {DxForm, DxItem} from 'devextreme-vue/form'
import CategoryPopupEdit from './components/category-edit-popup.vue'
import ProductPopupEdit from './components/product-edit-popup.vue'
import TableGrid from '@/components/TableGrid/grid.vue'
import TableActions from '@/components/TableActions/actions.vue'
import {DxScrollView} from 'devextreme-vue'
import {confirm} from 'devextreme/ui/dialog'
import {RawModule} from "@/views/references/materials/service";
import {
  DxDataGrid,
  DxLoadPanel
} from 'devextreme-vue/data-grid'

@Component({
  name: 'Products',
  components: {
    DxTreeView,
    DxButton,
    TableGrid,
    TableActions,
    DxScrollView,
    DxForm,
    DxItem,
    CategoryPopupEdit,
    ProductPopupEdit,
    DxDataGrid,
    DxLoadPanel
  }
})
export default class extends Vue {
  public state = ProductsModule
  private rawState = RawModule
  public productDataSource = this.state.productDataSource
  public categoryDataSource = this.state.categoryDataSource
  private columns: Array<any> = [
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
      dataField: 'price',
      dataType: 'number',
      caption: 'Цена',
      allowSorting: false,
      width: 70
    },
    {
      dataField: 'old_price',
      dataType: 'number',
      caption: 'Старая цена',
      allowSorting: false,
      width: 100
    }
  ];
  private rawColumns: Array<any> = [
    {
      dataField: 'id',
      dataType: 'string',
      visible: false
    },
    {
      dataField: 'raw_id',
      dataType: 'string',
      caption: 'Название',
      allowSorting: false,
      allowFiltering: false,
      lookup: {
        dataSource: this.rawState.rawDataSource.store(),
        valueExpr: 'id',
        displayExpr: 'name'
      }
    },
    {
      dataField: 'quantity',
      dataType: 'number',
      caption: 'Количество',
      width: 100,
      allowSorting: false,
      allowFiltering: false
    }
  ];

  created() {
  }

  deleteCategory() {
    confirm('Внимание!!! Удаление категории приведет к удалению всех дочерних подкатегорий и их товаров. Удалить выбранную категорию?', 'Удаление категории')
      .then(async (answer: boolean) => {
        if (!answer) {
          return
        }
        try {
          await this.state.crudCategory.delete(this.state.currentCategory.id)
          await this.state.categoryDataSource.reload()
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
    this.state.ResetCurrentProduct()
  }

  createNewCategory() {
    this.state.ResetCurrentCategory()
    this.state.SetCategoryEditVisible(true)
  }

  createNewProduct() {
    this.state.SetProductEditVisible(true)
  }

  editProduct() {
    this.state.SetProductEditVisible(true)
    this.state.SetProductEditMode(true)
  }

  deleteProduct() {
    confirm('Вы уверены, что хотите удалить?', 'Удаление продукта')
      .then(async (answer: boolean) => {
        if (!answer) {
          return
        }
        try {
          await this.state.crudProduct.delete(this.state.currentProduct.id)
          await this.state.productDataSource.reload()
          this.state.ResetCurrentProduct()
        } catch (e) {
          console.log(e)
        }
      })
  }

  onRowClick(e: any) {
    this.state.SetCurrentProduct(e.data)
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
  width: 28%;
  height: 100%;
}

.products-list {
  padding: 0 20px;
  width: 70%;
  height: 700px;
  margin-bottom: 10px;
}
</style>
