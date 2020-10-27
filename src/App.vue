<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { loadMessages, locale } from 'devextreme/localization'
import { messagesRu } from './const'

@Component({
  name: 'App'
})
export default class extends Vue {
  created() {
    loadMessages(messagesRu)
    locale('ru')
  }
}
</script>
