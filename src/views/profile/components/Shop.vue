<template>
  <div>
    <el-form
      v-if="!shop"
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
    <div v-else>
      <h5>Название магазина:</h5>
      <p>{{ shop.name }}</p>
      <h5>Адресс:</h5>
      <textarea>{{ shop.address }}</textarea>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import request from '@/utils/request'
import { Form as ElForm } from 'element-ui/types/element-ui'

@Component({
  name: 'Shop'
})
export default class extends Vue {
  private shopId: string = UserModule.shopId
  private shop: any = null
  private firstInit: boolean = true
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

  private validateAddress = (rule: any, value: string, callback: Function) => {
    if (value.trim().length === 0) {
      callback(new Error('Пожалуйста, задайте адрес магазина.'))
    } else {
      callback()
    }
  }

  private shopRules = {
    name: [{ required: true, validator: this.validateShopName, trigger: 'blur' }],
    address: [{ required: true, validator: this.validateAddress, trigger: 'blur' }]
  }

  async created() {
    if (this.shopId.length > 0) {
      await this.getShopInfo()
      this.firstInit = false
    } else {
      this.firstInit = true
    }
  }

  async getShopInfo() {
    const resp = await request({
      url: '/shop',
      method: 'get'
    })
    if (resp.data) {
      this.shop = {
        name: resp.data.name,
        address: resp.data.address
      }
    }
  }

  async onShopCreate() {
    (this.$refs.shopForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        const resp = await request({
          url: '/shop',
          method: 'post',
          data: this.shopForm
        })
        if (resp) {
          this.shopId = resp.data.id
          this.shop = {
            name: resp.data.name,
            address: resp.data.address
          }
        }
      } else {
        return false
      }
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
