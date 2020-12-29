<template>
  <div class="app-container">
    <p>Страница в разработке</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import {OrdersModule} from './service'
import TableGrid from '@/components/TableGrid/grid.vue'
import TableActions from '@/components/TableActions/actions.vue'
import {confirm} from 'devextreme/ui/dialog'

@Component({
  name: 'Orders',
  components: {
    TableGrid,
    TableActions
  }
})
export default class extends Vue {
  public state = OrdersModule
  public dataSource = this.state.productDataSource
  public columns: Array<any> = [];
}
</script>
