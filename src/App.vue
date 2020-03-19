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
              <side-navbar :routerList="d_routerList" class="mt-4" />
            </v-row>
          </v-navigation-drawer>
          <!-- drawer end -->
          <!-- router display -->
          <div class="blue lighten-3 shadow" style="height:60px"></div>
          <div class="white ma-auto mt-10 pa-6 elevation-1" style="width:960px;min-height:300px;border-radius:2px;">
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
  data() {
    return {
      d_addressList: ['3323kpuDSksfSWOMQSKsfkj'],
      d_path: `m/49'/0'/0'/0/0`,
      d_scriptType: 'SPENDP2SHWITNESS',
      d_showDisplay: false,
      d_purpose: 49,
      d_routerList: [
        {
          name: 'wallet',
          icon: '&#xea03;',
          url: '/wallet',
          children: [
            {
              name: 'Account',
              icon: '&#xea03;',
              url: '/wallet/account'
            },
            {
              name: 'Receive',
              icon: '&#xea03;',
              url: '/wallet/receive'
            }
          ]
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
    c_deviceName() {
      return this.usb.connect ? this.usb.product : 'Waiting for connect'
    },
    isDeviceConnect: vm => vm.usb.connect,
    c_addressN() {
      const address_n = []
      const path = this.d_path.match(/\/[0-9]+('|H)?/g)
      for (const item of path) {
        let id = parseInt(item.match(/[0-9]+/g)[0])
        if (item.match(/('|H)/g)) id = (id | 0x80000000) >>> 0
        address_n.push(id)
      }
      return address_n
    }
  },
  mounted() {
    this.initLanguage()
  },
  watch: {
    $route() {
      window.document.title = this.$route.meta.title ? this.$route.meta.title : 'abckey-webusb'
    },
    isDeviceConnect(e) {
      if (e === true) {
        this.initDevice()
        this.m_getPublickKey()
      }
    }
  },
  methods: {
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
    },
    async initDevice() {
      const result = await this.$usb.cmd('Initialize')
      console.log('Initialize', result)
      this.$store.__s('usb.majorVersion', result.data.major_version)
      this.$store.__s('usb.minorVersion', result.data.minor_version)
      this.$store.__s('usb.patchVersion', result.data.patch_version)
    },
    async m_getPublickKey() {
      if (!this.c_addressN) return (this.d_response = 'path error')
      const proto = {
        address_n: this.c_addressN,
        script_type: this.d_scriptType,
        show_display: this.d_showDisplay
      }
      await this.$usb.cmd('Initialize')
      await this.$usb.cmd('GetPublicKey', proto)
    }
  }
}
</script>
<style lang="scss" scoped>
.shadow {
  box-shadow: 1px 1px 20px rgba(0, 0, 0, 0.2);
}
</style>
