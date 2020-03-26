// src/plugins/vuetify.js
import Vue from 'vue'
import Vuetify from 'vuetify/lib'

import '@/styles/theme.scss'
import Store from '@/store'

/**
 * the vuetify-i18n language list
 * see more :  https://vuetifyjs.com/en/customization/internationalization/
 */
const localList = ['zhHans', 'en', 'ko', 'zhHant', 'ja']

const files = require.context('vuetify/lib/locale/', true, /\.js$/)
const locales: Array<any> = []
files.keys().forEach(key => {
  const languageName = key
    .replace('./', '')
    .replace('.js', '')
    .replace('-', '')
  if (localList.includes(languageName)) {
    locales.push({ [languageName]: files(key).default })
  }
})

const current = Store.__s('app.language')
console.log(current)

interface TranslateItem {
  [key: string]: string
}

/**
 *  Keep I18n and vuetify iternational be consistent
 */
export const TranslateTable: TranslateItem = {
  enUS: 'en',
  zhCN: 'zhHans',
  zhTW: 'zhHant',
  ja: 'ja',
  ko: 'ko'
}

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
    locales,
    current,
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
