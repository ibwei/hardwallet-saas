<template>
  <div id="app">
    <v-app>
      <v-content class="blue lighten-5">
        <v-container fluid class="pa-0">
          <!-- drawer -->
          <v-navigation-drawer value="true" class="elevation-2" app>
            <v-row justify="center">
              <div class="d-flex pa-2 mt-4 justify-center align-center blue lighten-5" style="border-radius:20px;width:80%;">
                <div class="body-2">{{ c_deviceName }}</div>
                <i class="icon pl-2">&#xe606;</i>
              </div>
            </v-row>
            <v-list class="mt-4" dense>
              <v-list-item v-for="(item, index) in d_routerList" :key="index" :class="item.selected ? 'blue lighten-5' : ''" link>
                <v-list-item-content @click="m_menuClick(index)">
                  <div class="d-flex justify-start align-center" :class="item.selected ? 'blue--text lighten-3--text' : 'black--text'">
                    <div class="dot mr-4" :class="item.selected ? 'blue lighten-3' : 'white'"></div>
                    <i class="icon pr-3" v-html="item.icon"></i>
                    <div class="body-2">{{ item.name }}</div>
                  </div>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>
          <!-- drawer end -->
          <!-- router display -->
          <div class="blue lighten-4" style="height:60px;border:1px solid red;"></div>
          <div class="d-flex  flex-column justify-center align-center white ma-auto mt-10" style="width:960px;">
            <router-view />
          </div>
          <!-- router end -->
        </v-container>
      </v-content>
      <dialog-choose-type />
      <dialog-connect-device />
      <dialog-language />
      <dialog-button-ack />
      <dialog-pin-ack />
      <dialog-pass-ack />
      <dialog-word-ack />
      <dialog-failure />
    </v-app>
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
      d_preSelectedIndex: 0,
      d_scriptType: 'SPENDP2SHWITNESS',
      d_purpose: 49,
      d_request: '',
      d_response: '',
      d_showDisplay: false,
      d_routerList: [
        {
          name: 'Wallet',
          icon: '&#xea03;',
          url: 'Wallet',
          children: [],
          selected: true
        },
        {
          name: 'Send',
          icon: '&#xea06;',
          url: 'send',
          children: [],
          selected: false
        },
        {
          name: 'Device Setting',
          icon: '&#xe9f2;',
          url: 'setting',
          children: [],
          selected: false
        },
        {
          name: 'ABC1 Extension',
          icon: '&#xe9fb;',
          url: 'extension',
          children: [],
          selected: false
        }
      ]
    }
  },
  computed: {
    ...mapState(['version', 'app', 'usb']),
    c_deviceName() {
      return this.app.product ? this.app.product : 'Waiting for connect'
    }
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
    m_menuClick(index) {
      if (index === this.d_preSelectedIndex) {
        return false
      }
      this.d_routerList.splice(this.d_preSelectedIndex, 1, { ...this.d_routerList[this.d_preSelectedIndex], selected: false })
      this.d_routerList.splice(index, 1, { ...this.d_routerList[index], selected: true })
      this.d_preSelectedIndex = index
      this.$router.push(this.d_routerList[index].url)
    },

    /**
     * @method - init the application's language
     * @return {void}
     */
    initLanguage() {
      const store = JSON.parse(localStorage.getItem('vuex'))
      if (store?.app?.language) {
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
    }
  }
}
</script>
<style lang="less" scoped>
.dot {
  width: 6px;
  height: 6px;
  border-radius: 100%;
}
.icon {
  font-size: 20px;
}
</style>
