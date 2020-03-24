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

class I18n {
  i18n: VueI18n
  locale = ''
  langs = ['']
  constructor() {
    this.initLang()
    this.i18n = new VueI18n({
      locale: this.locale,
      fallbackLocale: 'en',
      messages
    })
  }

  private initLang() {
    let lang = Store.__s('app.language')
    if (!lang) {
      lang = window.navigator.language.split('-').join('')
      Store.__s('app.language', lang)
    }
    this.locale = lang
  }

  /**
   * @functin setLang - set the app's language
   * @param {string} lang - the language will be setted
   * @return {string} lang - langguage name
   */
  private setLang(lang: string): string {
    this.i18n.locale = lang
    this.i18n.fallbackLocale = lang
    Axios.defaults.headers.common['Accept-Language'] = lang
    Store.__s('app.language', lang)
    return lang
  }

  /**
   * @functin loadLangAsync - load language asynchronous
   * @param {string} lang - the language will be loading
   * @return {string} lang - loaded language name
   */
  loadLangAsync(lang: string): Promise<string> {
    if (this.locale !== lang) {
      if (!this.langs.includes(lang)) {
        return import(/* webpackChunkName: "lang-[request]" */ `@/i18n/lang/${lang}`).then(msgs => {
          this.i18n.setLocaleMessage(lang, msgs.default[lang])
          this.langs.push(lang)
          return this.setLang(lang)
        })
      }
      return Promise.resolve(this.setLang(lang))
    }
    return Promise.resolve(lang)
  }
}

export default new I18n()
