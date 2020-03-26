// see language list : https://vuetifyjs.com/zh-Hans/customization/internationalization/

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
