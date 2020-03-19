<template>
  <div id="app">
    <v-app>
      <v-content class="blue lighten-5">
        <v-container fluid class="pa-0">
          <!-- drawer -->
          <v-navigation-drawer value="true" class="elevation-2" app>
            <v-row justify="center">
              <div
                class="d-flex pa-2 mt-4 justify-center align-center blue lighten-5"
                style="border-radius:20px;width:80%;"
              >
                <div class="body-2">{{ c_deviceName }}</div>
                <i class="icon pl-2">&#xe606;</i>
              </div>
              <side-navbar :routerList="d_routerList" class="mt-4" />
            </v-row>
          </v-navigation-drawer>
          <!-- drawer end -->
          <!-- router display -->
          <div
            class="blue lighten-4 elevation-3"
            style="height:60px;border-bottom-right-radius:4px;border-bottom-left-radius:4px;"
          ></div>
          <div
            class="white ma-auto mt-10 pa-6 elevation-1"
            style="width:960px;min-height:300px;border-radius:2px;"
          >
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
      <dialog-set-label />
    </v-app>
  </div>
</template>

<script>
import { loadLanguageAsync } from '@/i18n/index'
import SideNavbar from '@/views/components/SideNavBar'
import { mapState } from 'vuex'
export default {
  name: 'App',
  components: {
    SideNavbar
  },
  data () {
    return {
      name: 'nihao',
      d_publicKey: '',
      d_scriptType: 'SPENDP2SHWITNESS',
      d_purpose: 49,
      d_request: '',
      d_response: '',
      d_showDisplay: false,
      d_routerList: [
        {
          name: 'wallet',
          icon: '&#xea03;',
          url: '/wallet',
          children: [{
            name: 'Account',
            icon: '&#xea03;',
            url: '/wallet/account'
          }, {
            name: 'Receive',
            icon: '&#xea03;',
            url: '/wallet/receive'
          }]
        },
        {
          name: 'Send',
          icon: '&#xea06;',
          url: '/send'
        },
        {
          name: 'Setting',
          icon: '&#xe9f2;',
          url: '/setting'
        },
        {
          name: 'ABC1 Extension',
          icon: '&#xe9fb;',
          url: 'extension'
        }
      ]
    }
  },
  computed: {
    ...mapState(['version', 'app', 'usb']),
    c_deviceName () {
      return this.app.product ? this.app.product : 'Waiting for connect'
    }
  },
  mounted () {
    this.initLanguage()
  },
  watch: {
    $route () {
      window.document.title = this.$route.meta.title
    }
  },
  methods: {
    /**
     * @method - init the application's language
     * @return {void}
     */
    initLanguage () {
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
    changeLanguage (type) {
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
</style>
