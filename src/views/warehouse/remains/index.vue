<template>
  <div class="app-container">
    <table-grid
      table-title="Остатки"
      ref="tablegrid"
      :data-source="rawState.rawDataSource"
      :columns="columns"
      :row-click="onRowClick"
      :dbl-row-click="empty"
      selection-mode="single"
    >
    </table-grid>
    <ShowRemainsDetailsPopup/>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
import TableGrid from "@/components/TableGrid/grid.vue";
import {RawModule} from "@/views/references/materials/service";
import {RemainsModule} from './service'
import request from '@/utils/request'
import ShowRemainsDetailsPopup from './components/show-remains-details.vue'
import {confirm} from "devextreme/ui/dialog";
import _ from 'lodash'

@Component({
  name: 'Remains',
  components: {
    TableGrid,
    ShowRemainsDetailsPopup
  }
})

export default class extends Vue {
  public state = RemainsModule
  public rawState = RawModule
  public columns: any[] = [
    {
      dataField: 'id',
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
      dataField: 'category_id',
      dataType: 'string',
      caption: 'Категория',
      lookup: {
        allowClearing: true,
        dataSource: RawModule.rawCategoryDataSource.store(),
        valueExpr: 'id',
        displayExpr: 'name'
      },
      width: 200
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
          dataField: 'quantity',
          dataType: 'number',
          caption: 'Кол-во',
          allowSorting: false,
          width: 70
        },
        {
          dataField: 'reserved',
          caption: 'Резерв',
          dataType: 'number',
          allowSorting: false,
          width: 70
        },
        {
          dataField: 'available_quantity',
          dataType: 'number',
          caption: 'Итого',
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
      buttons: [{
        hint: 'Детализация остатков',
        icon: 'info',
        visible: true,
        onClick: this.onRawDetail
      },
        {
          hint: 'Распаковать',
          icon: 'group',
          visible: this.isOpeningVisible,
          onClick: this.onOpening
        }]
    }
  ]

  onRawDetail(e: any) {
    this.state.SetCurrentRow(e.row.data)
    this.state.ShowRemainsDetails(true)
  }

  isOpeningVisible(e: any) {
    if (!_.isNil(e.row.data.piece_raw_id) && e.row.data.quantity > 0) {
      return true
    }
    return false
  }

  onOpening(e: any) {
    confirm(`Вы уверены, что хотите разупаковать сырье ${e.row.data.name}?`, 'Распаковка сырья')
      .then(async (answer: boolean) => {
        if (!answer) {
          return
        }
        try {
          await request({
            url: `opening/${e.row.data.id}`,
            method: 'post'
          })
          await this.rawState.rawDataSource.reload()
        } catch (e) {
          console.log(e)
        }
      })
  }

  created() {
  }

  onRowClick() {

  }

  empty() {

  }

}
</script>
