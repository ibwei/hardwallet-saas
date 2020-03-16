<template>
  <div id="app">
    <v-app>
      <v-content>
        <v-container fluid>
          <v-row>
            <dialog-choose-type />
          </v-row>
          <v-row>
            <dialog-connect-device />
          </v-row>
        </v-container>
      </v-content>
    </v-app>
    <!--  <v-app>
      <div id="nav">
        <v-row>
          <v-col cols="6" sm="24">
            <v-btn class="app" small @click="connect()">connect</v-btn>
          </v-col>
          <v-col cols="6" sm="24">DeviceName ：{{ this.usb.connect ? this.usb.product : 'Please choose device' }}</v-col>
        </v-row>
        <v-row>
          <v-col cols="6" sm="24">
            <v-btn class="app" small @click="getPbk()">getPublickKey</v-btn>
          </v-col>
          <v-col cols="6" sm="24">publickey ：{{ this.d_response }}</v-col>
        </v-row>

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
    </v-app> -->
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
      name: 'nihao',
      d_publicKey: '',
      d_scriptType: 'SPENDP2SHWITNESS',
      d_purpose: 49,
      d_request: '',
      d_response: '',
      d_showDisplay: false
    }
  },
  computed: {
    ...mapState(['version', 'app', 'usb'])
  },
  mounted() {
    this.initLanguage()
  },
  watch: {
    $route() {
      window.document.title = this.$route.meta.title
    }
  },
  methods: {
    /**
     * @method  getPublicKey
     * @return void
     */
    async getPbk() {
      /*  const proto = {
        address_n: [(this.d_purpose | 0x80000000) >>> 0, (this.d_coinType | 0x80000000) >>> 0, (this.d_account | 0x80000000) >>> 0],
        script_type: this.d_scriptType,
        show_display: false
      }
      const result = await this.$usb.cmd('GetPublicKey', proto) */
      const result = await this.$usb.cmd('GetPublicKey', {
        address_n: [2147483697, 2147483648, 2147483648],
        script_type: 'SPENDP2SHWITNESS',
        show_display: false
      })
      // this.d_request = `abckey.cmd('GetPublicKey', ` + JSON.stringify(proto, null, 4) + ')'
      this.d_response = JSON.stringify(result, null, 4)
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
      this.$store.__s('version', '0.0.3')
    }
  }
}
</script>

<style lang="less">
#app {
  font-family: '微软雅黑', Helvetica, Arial, sans-serif;
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
