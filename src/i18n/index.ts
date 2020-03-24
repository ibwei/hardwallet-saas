/**
 * vue-i18n
 * *see more : https://kazupon.github.io/vue-i18n/zh/guide/lazy-loading.html
 */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Axios from 'axios'

import Store from '@/store'
import messages from './lang/en'

Vue.use(VueI18n)

const locale = _initLanguage()
const loadedLanguages = [locale]

export const i18n = new VueI18n({
  locale,
  fallbackLocale: 'en',
  messages
})

function _initLanguage() {
  let lang = Store.__s('app.language')
  if (!lang) {
    lang = window.navigator.language.split('-').join('')
    Store.__s('app.language', lang)
  }
  return lang
}

/**
 * @functin _setI18nLanguage - set the app's language
 * @param {string} lang - the language will be setted
 * @return {string} lang - langguage name
 */
function _setI18nLanguage(lang: string): string {
  i18n.locale = lang
  i18n.fallbackLocale = lang
  Axios.defaults.headers.common['Accept-Language'] = lang
  Store.__s('app.language', lang)
  return lang
}

/**
 * @functin loadLanguageAsync - load language asynchronous
 * @param {string} lang - the language will be loading
 * @return {string} lang - loaded language name
 */
export function loadLanguageAsync(lang: string): Promise<string> {
  if (i18n.locale !== lang) {
    if (!loadedLanguages.includes(lang)) {
      return import(
        /* webpackChunkName: "lang-[request]" */ `@/i18n/lang/${lang}`
      ).then(msgs => {
        i18n.setLocaleMessage(lang, msgs.default[lang])
        loadedLanguages.push(lang)
        return _setI18nLanguage(lang)
      })
    }
    return Promise.resolve(_setI18nLanguage(lang))
  }
  return Promise.resolve(lang)
}
