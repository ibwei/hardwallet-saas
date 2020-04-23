// @ts-nocheck
import Vue from 'vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import vuetify from './plugins/vuetify'
import '@/components'
import './plugins'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  router,
  i18n,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
