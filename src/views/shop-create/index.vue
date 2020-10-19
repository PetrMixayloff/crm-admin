<template>
  <div class="app-container">
    <el-card class="box-card">
      <h1>Создание магазина</h1>
      <p> Добро пожаловать в нашу CRM. Для начала работы создайте магазин.</p>
      <el-form
        ref="shopForm"
        :model="shopForm"
        :rules="shopRules"
        autocomplete="on"
      >
        <el-form-item
          label="Название"
          prop="name"
        >
          <el-input v-model.trim="shopForm.name"/>
        </el-form-item>
        <el-form-item
          label="Адрес"
          prop="address"
        >
          <el-input
            v-model.trim="shopForm.address"
            type="textarea"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onShopCreate"
          >
            Создать
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
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
  private shopForm = {
    name: '',
    address: ''
  }

  private validateShopName = (rule: any, value: string, callback: Function) => {
    if (value.trim().length === 0) {
      callback(new Error('Пожалуйста, задайте название магазина.'))
    } else {
      callback()
    }
  }

  private shopRules = {
    name: [{ required: true, validator: this.validateShopName, trigger: 'blur' }],
    address: [{ required: false, trigger: 'blur' }]
  }
}

</script>

<style lang="scss">
.box-card {
  min-width: 600px;
  width: 50%;
  margin: 0 auto;
}
</style>
