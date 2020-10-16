<template>
  <div>
    <h1>Создание магазина</h1>
    <DxForm
      id="form"
      :form-data="company"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  DxButton,
  DxTextBox,
  DxNumberBox,
  DxSelectBox,
  DxTextArea,
  DxContextMenu,
  DxForm
} from 'devextreme-vue'
// eslint-disable-next-line no-unused-vars
import { confirm } from 'devextreme/ui/dialog'

@Component({
  name: 'QtEditor',
  components: {
    DxButton,
    DxTextBox,
    DxNumberBox,
    DxSelectBox,
    DxTextArea,
    DxContextMenu,
    DxForm
  }
})
export default class extends Vue {
  public company: any = {
    ID: '',
    CompanyName: '',
    Address: '',
    City: '',
    State: ''
  };
}

</script>

<style lang="scss">
</style>
