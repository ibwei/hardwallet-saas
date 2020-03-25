<template>
  <div id="app">
    <v-app>
      <connect v-if="usb.connect" />
      <v-content v-else class="blue lighten-4" style="min-height:100vh;">
        <v-container fluid class="pa-0">
          <!-- drawer -->
          <v-navigation-drawer value="true" class="elevation-2" app>
            <v-row class="d-flex justify-start align-center text-left">
              <v-col cols="4">
                <img
                  @click="$store.__s('dialog.chooseType', true)"
                  :src="c_coinPicture"
                  class="ma-2 mt-4 coin-type"
                  height="50"
                  width="auto"
                />
              </v-col>
              <v-col cols="8" class="pa-0">
                <div class="d-flex flex-column justify-start align-start text-left">
                  <div class="d-flex justify-start align-center">
                    <span class="subtitle-1">{{coinInfo.symbol.toUpperCase()}}</span>
                    <v-btn
                      x-small
                      color="blue lighten-2 ml-3 caption"
                      @click="$store.__s('dialog.chooseType', true)"
                      dark
                    >{{$t('Change')}}</v-btn>
                  </div>
                  <div class="caption font-weight-medium">
                    <span>{{coinInfo.name}}</span>
                    <span></span>
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-divider />
            </v-row>
            <v-row>
              <side-navbar :routerList="d_routerList" />
            </v-row>
          </v-navigation-drawer>
          <!-- drawer end -->
          <!-- router display -->
          <div class="d-flex flex-row justify-end align-center blue lighten-3 shadow">
            <div
              class="d-flex flex-row justify-center align-center pa-2 ma-2 pl-4 pr-4 blue lighten-5"
              style="border-radius:20px; width:auto;"
            >
              <div class="body-2">{{ c_deviceName }}</div>
              <i class="icon pl-2">&#xe606;</i>
            </div>
          </div>
          <router-view />
          <!-- router end -->
        </v-container>
      </v-content>
      <dialog-choose-type />
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
import coinbook from '@/utils/coinbook'
import SideNavbar from '@/views/components/SideNavBar'
import { mapState } from 'vuex'
import Connect from './views/Connect'
export default {
  name: 'App',
  components: {
    SideNavbar,
    Connect
  },
  data () {
    return {
      d_addressList: ['3323kpuDSksfSWOMQSKsfkj'],
      d_path: `m/49'/0'/0'/0/0`,
      d_scriptType: 'SPENDP2SHWITNESS',
      d_showDisplay: false,
      d_purpose: 49,
      d_routerList: [
        {
          name: 'Account',
          icon: '&#xea03;',
          url: '/wallet/account'
        },
        {
          name: 'Receive',
          icon: '&#xe9fd;',
          url: '/receive'
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
        }
      ]
    }
  },
  computed: {
    ...mapState(['version', 'app', 'usb', 'cashUnitItems', 'cashUnitIndex', 'coinInfo']),
    c_coinPicture () {
      const pictureName = this.c_coinType.toUpperCase()
      return require(`./assets/cointype/${pictureName}.png`)
    },
    c_deviceName () {
      return this.usb.connect ? this.usb.product : 'Waiting for connect'
    },
    isDeviceConnect: vm => vm.usb.connect,
    c_addressN () {
      const address_n = []
      const path = this.d_path.match(/\/[0-9]+('|H)?/g)
      for (const item of path) {
        let id = parseInt(item.match(/[0-9]+/g)[0])
        if (item.match(/('|H)/g)) id = (id | 0x80000000) >>> 0
        address_n.push(id)
      }
      return address_n
    },
    c_coinType: vm => vm.$store.__s('coinType')
  },
  created () {
    this.initCoinInfo()
  },
  watch: {
    $route () {
      window.document.title = this.$route.meta.title ? this.$route.meta.title : 'abckey-webusb'
    },
    /**
     * @method - Hook function - Execute after the device is connected
     * @return {void}
     */
    isDeviceConnect (e) {
      if (e === true) {
        console.log('Device is Connected!')
        this.initDevice()
        this.m_getPublickKey()
      }
    },
    c_coinType () {
      this.initCoinInfo()
    }
  },
  methods: {
    onClickCash (index) {
      this.$store.__s('cashUnitIndex', index)
    },
    async initDevice () {
      await this.$usb.cmd('Initialize')
      const { data } = await this.$usb.cmd('GetFeatures')
      await this.$usb.cmd('Initialize')
      this.$store.__s('usb.majorVersion', data.data.major_version)
      this.$store.__s('usb.minorVersion', data.data.minor_version)
      this.$store.__s('usb.patchVersion', data.data.patch_version)
    },
    async m_getPublickKey () {
      if (!this.c_addressN) return (this.d_response = 'path error')
      const proto = {
        address_n: this.c_addressN,
        script_type: this.d_scriptType,
        show_display: this.d_showDisplay
      }
      await this.$usb.cmd('Initialize')
      await this.$usb.cmd('GetPublicKey', proto)
    },
    initCoinInfo () {
      this.$store.__s('coinInfo', coinbook[this.c_coinType])
    }
  },
  i18n: {
    messages: {
      zhCN: {
        'Switch Currencies': '切换货币',
        Safe: '安全',
        Change: '切换'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.shadow {
  box-shadow: -1px 1px 5px rgba(22, 22, 22, 0.1);
}

.switch-button {
  position: fixed;
  bottom: 30px;
}
.coin-type {
  border-radius: 50%;
  box-shadow: 1px 1px 20px rgba(0, 0, 0, 0.4);
  cursor: pointer;
}
.coin-type:hover {
  box-shadow: 1px 1px 40px rgba(0, 0, 0, 0.4);
}
</style>
