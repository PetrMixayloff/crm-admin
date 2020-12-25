<template>
  <div :class="'component-container' + (addClass ? ' ' + addClass : '')">
    <dx-data-grid
      ref="dxdatagrid"
      :data-source="dataSource"
      :allow-column-reordering="true"
      :allow-column-resizing="true"
      :column-auto-width="true"
      :row-alternation-enabled="true"
      :show-column-headers="showColumnHeaders"
      :show-borders="true"
      :columns="columns"
      :height="gridHeight"
      :filter-sync-enabled="filterSyncEnabled"
      :filter-value="filterValue"
      :selected-row-keys.sync="syncedCheckedItems"
      :key-expr="keyExpr ? keyExpr : undefined"
      :disabled="disabled"
      @row-click="onRowClick"
      @row-dbl-click="onRowDblClick"
      @cell-click="onCellClick"
      @cell-dbl-click="onCellDblClick"
      @content-ready="onContentReady"
      @context-menu-preparing="addMenuItems"
      @init-new-row="onInitNewRow"
      @cell-prepared="onCellPrepared"
      @row-prepared="onRowPrepared"
      @row-removing="onRowRemoving"
      @selection-changed="onSelectionChanged"
    >
      >
      <dx-load-panel
        :enabled="true"
      />

      <DxEditing
        v-if="allowEditing"
        :allow-adding="allowRowsAddDelete"
        :allow-updating="true"
        :allow-deleting="allowRowsAddDelete"
        :mode="editingMode"
        start-edit-action="dblClick"
      />
      <DxStateStoring
        :enabled="stateStoringEnable"
        type="localStorage"
        :storage-key="stateStoringKey"
      />

      <DxColumnChooser
        mode="select"
        :enabled="columnChooserEnable"
      />
      <!--      <DxColumnFixing :enabled="true"/>-->

      <DxMasterDetail
        :enabled="masterDetailEnable"
        template="detailTemplate"
      />

      <template #detailTemplate="row">
        <slot
          name="masterDetailTemplate"
          :rowKey="row.data.data.id"
          :rowData="row.data.data"
        />
      </template>

      <dx-remote-operations
        :sorting="true"
        :paging="true"
        :filtering="true"
      />

      <dx-selection
        :show-check-boxes-mode="selectionMode === 'multiple' ? 'always' : 'none'"
        :mode="selectionMode"
      />
      <dx-filter-row
        :visible="filterRowVisible"
      />
      <dx-group-panel :visible="groupingEnabled" />
      <dx-grouping :auto-expand-all="false" />
      <dx-search-panel
        :visible="false"
        :highlight-case-sensitive="true"
      />
      <dx-pager
        :allowed-page-sizes="pageSizes"
        :show-page-size-selector="true"
      />
      <dx-paging :page-size="initialPageSize" />
      <template #image-cell-template="{data}">
        <img
          :src="src(data.value)"
          alt="Сырье"
          width="50px"
        >
      </template>
      <template #images-cell-template="{data}">
        <img
          :src="src(data.value)"
          alt="Товар"
          width="50px"
        >
      </template>
    </dx-data-grid>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, PropSync, Vue } from 'vue-property-decorator'
import { DxCheckBox } from 'devextreme-vue/check-box'

import {
  DxColumn,
  DxColumnChooser,
  DxColumnFixing,
  DxDataGrid,
  DxEditing,
  DxFilterRow,
  DxGrouping,
  DxGroupPanel,
  DxLoadPanel,
  DxMasterDetail,
  DxPager,
  DxPaging,
  DxRemoteOperations,
  DxSearchPanel,
  DxSelection,
  DxStateStoring
} from 'devextreme-vue/data-grid'
import _ from 'lodash'

function defaultPageSizes(): number[] {
  return [10, 25, 50, 100]
}

@Component({
  name: 'TableGrid',
  components: {
    DxDataGrid,
    DxEditing,
    DxRemoteOperations,
    DxSelection,
    DxFilterRow,
    DxColumn,
    DxLoadPanel,
    DxGrouping,
    DxGroupPanel,
    DxPager,
    DxPaging,
    DxSearchPanel,
    DxMasterDetail,
    DxColumnChooser,
    DxColumnFixing,
    DxStateStoring,
    DxCheckBox
  }
})
export default class extends Vue {
  @Prop() public dataSource!: any;
  @PropSync('checkedItems') public syncedCheckedItems!: Array<any>;
  @Prop({ required: false }) public keyExpr!: string | undefined;
  @Prop() public columns!: any;
  @Prop() public masterDetailEnable!: boolean;
  @Prop({ default: 'single' }) public selectionMode!: string;
  @Prop({ required: true }) private rowClick!: Function;
  @Prop({ required: true }) private dblRowClick!: Function;
  @Prop() public initNewRow!: Function;
  @Prop() public height!: any;
  @Prop() public filterValue!: any;
  @Prop() public filterSyncEnabled!: boolean;
  @Prop({ default: true }) public filterRowVisible!: boolean;
  @Prop() public relationMode!: any;
  @Prop({ default: false }) public columnChooserEnable!: boolean;
  @Prop({ default: false }) public stateStoringEnable!: boolean;
  @Prop() public stateStoringKey!: string;
  @Prop() public contextMenuItems!: Array<any>;
  @Prop() public groupingEnabled!: boolean;
  @Prop() public buttons!: any;
  @Prop({ default: true }) public showColumnHeaders!: boolean;
  @Prop() public allowEditing!: boolean;
  @Prop({ default: true }) public allowRowsAddDelete!: boolean;
  @Prop({ default: 'batch' }) public editingMode!: string;
  @Prop({ default: 10 }) public initialPageSize!: number;
  @Prop({ default: defaultPageSizes }) public pageSizes!: number[];
  @Prop() public addClass!: string;
  @Prop({ default: false }) public disabled!: boolean;

  @Emit('cell-prepared')
  onCellPrepared(e: any) {
    return e
  }

  @Emit('selection-changed')
  onSelectionChanged({ selectedRowsData }: any) {
    return selectedRowsData
  }

  @Emit('row-prepared')
  onRowPrepared(e: any) {
    return e
  }

  @Emit('row-removing')
  onRowRemoving(e: any) {
    return e
  }

  @Emit('cell-click')
  onCellClick(e: any): any {
    return e
  }

  @Emit('cell-dbl-click')
  onCellDblClick(e: any): any {
    return e
  }

  public getSelectedData() {
    const grid = (this.$refs.dxdatagrid as any).instance
    const selectedKeys = grid.getSelectedRowKeys()
    if (selectedKeys) {
      const selectedIndex = grid.getRowIndexByKey(selectedKeys[0])
      grid.selectRowsByIndexes(selectedIndex)
    }
    return grid.getSelectedRowsData()
  }

  public deselectAllRows() {
    const grid = (this.$refs.dxdatagrid as any).instance
    grid.deselectAll()
  }

  onContentReady(e: any) {

  }

  onInitNewRow(e: any) {
    if (this.initNewRow) {
      this.initNewRow(e)
    }
  }

  src(data: any) {
    if (!data) {
      return require('@/assets/defaults/default_baloon.png')
    }
    return `https://baloon-crm.s3-eu-west-1.amazonaws.com/${data}`
  }

  get gridHeight() {
    if (this.height) {
      return this.height
    }
    const h: any = document.getElementsByClassName('app-main')[0]
    if (h) {
      return h.offsetHeight - 200
    }

    return undefined
  }

  onRowClick(e: any) {
    // // expand/collapse master row
    // if (this.masterDetailEnable &&
    //     typeof e.isExpanded !== 'undefined' &&
    //     typeof e.key !== 'undefined' &&
    //     typeof this.$refs.dxdatagrid === 'object') {
    //   const grid = (this.$refs.dxdatagrid as any).instance;
    //   if (typeof grid === 'object') {
    //     if (e.isExpanded) {
    //       grid.collapseRow(e.key);
    //     } else {
    //       grid.expandRow(e.key);
    //     }
    //   }
    // }
    if (e.isSelected) {
      this.rowClick(e)
    }
  }

  onRowDblClick(e: any) {
    if (e.rowType !== 'data') {
      return
    }
    this.dblRowClick(e)
  }

  onGridRefresh() {
    this.dataSource.reload()
  }

  addMenuItems(e: any) {
    e.items = []

    if (e.row.rowType === 'data' && this.contextMenuItems) {
      this.contextMenuItems.forEach((x) => {
        e.items.push({
          text: x.text,
          onItemClick: () => {
            x.action(e)
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.grid-actions {
  margin-bottom: 20px;
}

.component-container {
  height: 100%;
}
</style>
