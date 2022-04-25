<template>
  <DxDropDownBox
    ref="dropDownBoxRef"
    :drop-down-options="dropDownOptions"
    :data-source="dataSource"
    :value.sync="currentValue"
    :display-expr="(item) => {return item && 'Номер ' + item.number + ' от ' + new Date(item.date).toLocaleDateString()}"
    value-expr="id"
    content-template="contentTemplate"
  >
    <template #contentTemplate="{}">
      <DxDataGrid
        :data-source="dataSource"
        :columns="columns"
        :remote-operations="true"
        :height="250"
        :selected-row-keys="[currentValue]"
        :hover-state-enabled="true"
        :on-selection-changed="onSelectionChanged"
        :focused-row-enabled="true"
        :focused-row-key="currentValue"
        key-expr="id"
      >
        <DxPaging
          :enabled="true"
          :page-size="10"
        />
        <DxScrolling mode="virtual"/>
        <DxSelection mode="single"/>
      </DxDataGrid>
    </template>
  </DxDropDownBox>
</template>

<script lang="ts">

import {
  DxDataGrid,
  DxPaging,
  DxSelection,
  DxScrolling,
  DxColumn
} from 'devextreme-vue/data-grid';
import DxDropDownBox from 'devextreme-vue/drop-down-box';
import {Component, Prop, Vue} from 'vue-property-decorator'
import {RawModule} from "@/views/references/materials/service";

@Component({
  name: 'remainsDropDownBox',
  components: {
    DxDropDownBox,
    DxDataGrid,
    DxPaging,
    DxSelection,
    DxScrolling,
    DxColumn
  }
})
export default class extends Vue {
  @Prop({default: 0}) private value!: number;
  @Prop({required: true}) private onValueChanged!: Function;
  @Prop({required: true}) private dataSource!: any;

  private currentValue = this.value
  private dropDownOptions: any = { width: 500 }

  private columns: any[] = [
    {
      dataField: 'id',
      dataType: 'string',
      visible: false
    },
    {
      dataField: 'number',
      dataType: 'string',
      caption: 'Номер'
    },
    {
      dataField: 'date',
      dataType: 'date',
      caption: 'Дата'
    },
    {
      dataField: 'quantity',
      dataType: 'number',
      caption: 'Кол-во'
    },
    {
      dataField: 'price',
      dataType: 'number',
      caption: 'Цена'
    }
  ]

  onSelectionChanged(selectionChangedArgs: any) {
      this.currentValue = selectionChangedArgs.selectedRowKeys[0];
      this.onValueChanged(this.currentValue);
      if(selectionChangedArgs.selectedRowKeys.length > 0) {
        (this.$refs.dropDownBoxRef as any).instance.close();
      }
    }

}
</script>
