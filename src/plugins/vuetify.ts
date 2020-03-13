// src/plugins/vuetify.js

import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import { preset } from './vuetify-preset'

Vue.use(Vuetify)

export default new Vuetify({
  preset,
  rtl: false,
  theme: { dark: false }
})
