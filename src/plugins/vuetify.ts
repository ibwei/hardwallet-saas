// src/plugins/vuetify.js
import Vue from 'vue'
import Vuetify from 'vuetify/lib'

import zhHans from 'vuetify/es5/locale/zh-Hans'
import en from 'vuetify/es5/locale/en'
import ko from 'vuetify/es5/locale/ko'
import zhHant from 'vuetify/es5/locale/zh-Hant'
import ja from 'vuetify/es5/locale/ja'
import '@/styles/theme.scss'

const preset: any = {
  breakpoint: {
    scrollBarWidth: 16,
    thresholds: {
      xs: 600,
      sm: 960,
      md: 1280,
      lg: 1920
    }
  },
  icons: {
    iconfont: 'mdiSvg',
    values: {}
  },
  lang: {
    locales: { zhHans, en, zhHant, ko, ja },
    current: 'zhHans',
    t: undefined as any
  },
  rtl: false,
  theme: {
    dark: false,
    default: 'light',
    disable: false,
    options: {
      cspNonce: undefined,
      customProperties: undefined,
      minifyTheme: undefined,
      themeCache: undefined
    },
    themes: {
      light: {
        primary: '#1976D2',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00'
      },
      dark: {
        primary: '#2196F3',
        secondary: '#424242',
        accent: '#FF4081',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00'
      }
    }
  }
}

Vue.use(Vuetify)

export default new Vuetify({
  preset,
  rtl: false,
  theme: { dark: false }
})
