<template>
  <div id="app">
    <div id="nav">
      <div class="app" @click="connect()">connect</div>
      <app-language></app-language>
      <span>{{ $t('app.name') }}</span>
      <div @click="changeLanguage('zhHans')">中文</div>
      <div @click="changeLanguage('en')">Enlish</div>
      <div>
        <v-input></v-input>
        <v-text-field append-icon="phone" prepend-icon="close" label="input"></v-text-field>
      </div>
      <v-btn color="#0000ff" :text="true" to="bitcoin">hello</v-btn>
      <router-link to="/">Home</router-link>|
      <router-link to="/about">About</router-link>
      <router-link to="/bitcoin">bitcoin</router-link>
      <br />
      <router-link to="/bitcoin/a">b-a</router-link>
      <br />
      <router-link to="/bitcoin/b">b-b</router-link>
      <br />
      <router-link to="/settings">setting</router-link>
      <br />
      <router-link to="/settings/a">setting-a</router-link>
      <div @click="changeApp">change</div>
    </div>
    <router-view />
  </div>
</template>

<script>
import { loadLanguageAsync } from '@/i18n/index'
import { mapState } from 'vuex'
export default {
  name: 'App',
  data() {
    return {
      name: 'nihao'
    }
  },
  computed: {
    ...mapState(['version', 'app'])
  },
  mounted() {
    this.initLanguage()
  },
  methods: {
    /**
     * @method  connect - usbdevice
     * @return void
     */
    connect() {
      console.log(this.$usb)
      this.$usb.requestDevice([]).then(res => {
        console.log('you have already choose device')
        console.log('device info:')
        console.log(res)
        this.$usb.syncVuex(res)
      })
    },
    /**
     * @method - init the application's language
     * @return {void}
     */
    initLanguage() {
      const store = JSON.parse(localStorage.getItem('vuex'))
      if (store.app.language) {
        loadLanguageAsync(store.app.language).then(lang => {
          console.log(`You have already change language:${lang}`)
        })
      }
    },

    /**
     * @method - change the application's language
     * @return {void}
     */
    changeLanguage(type) {
      loadLanguageAsync(type).then(res => {
        const html = document.getElementsByTagName('html')[0]
        if (html) {
          html.lang = res
        }
      })
    },

    changeApp() {
      console.log('change')
      this.$store.__s('app.language', 'ja_JP')
      this.$store.__s('version', '0.0.3')
    }
  }
}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
