<template>
  <div id="app">
    <v-app>
      <connect v-if="!c_usb.connect" />
      <first-guide v-else-if="!c_usb.initialized" />
      <load-data v-else-if="!c_usb.xpub" />
      <v-content v-else class="blue lighten-5" style="min-height:100vh;">
        <top-bar />
        <v-container fluid class="pa-0">
          <side-navbar />
          <v-alert prominent type="error" v-if="c_needsBackup">
            <v-row align="center">
              <v-col class="grow">Your device is not backed up. To ensure the safety of your funds, please backup immediately!</v-col>
              <v-col class="shrink">
                <v-btn @click="m_backupDevice">👉backup now</v-btn>
              </v-col>
            </v-row>
          </v-alert>
          <loading v-show="c_pageLoading" />
          <router-view />
          <v-footer class="pa-3" dark absolute>
            <v-spacer></v-spacer>
            <div class="body-2">&copy;&nbsp;ABCKEY&nbsp;{{ new Date().getFullYear() }}</div>
          </v-footer>
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
import SideNavbar from '@/views/components/SideNavBar'
import Connect from './views/Connect'
import TopBar from '@/views/components/TopBar'
import Loading from '@/views/components/Loading'
import LoadData from '@/views/LoadData'
import FirstGuide from '@/views/FirstGuide'
import coinbook from '@/utils/coinbook'
import UsbMixin from '@/mixins/usb'
export default {
  name: 'App',
  mixins: [UsbMixin],
  components: {
    SideNavbar,
    Connect,
    TopBar,
    LoadData,
    Loading,
    FirstGuide
  },
  computed: {
    c_usb: vm => vm.$store.__s('usb'),
    c_pageLoading: vm => vm.$store.__s('pageLoading'),
    c_isConnect: vm => vm.$store.__s('usb.connect'),
    c_msg: vm => vm.$store.__s('usb.msg'),
    c_needsBackup: vm => vm.$store.__s('usb.needsBackup')
  },
  async created() {
    const coinType = this.$store.__s('coinType').toLowerCase()
    this.$store.__s('coinInfo', coinbook[coinType])
  },
  watch: {
    $route() {
      window.document.title = this.$route.meta.title ? this.$route.meta.title : 'abckey-webusb'
    },
    async c_isConnect(value) {
      if (value === true) await this.$usb.cmd('Initialize')
    },
    c_msg(msg) {
      if (msg.data.message === 'Device successfully initialized' || msg.data.message === 'Device recovered') {
        this.$router.push({ path: '/' })
        this.$store.__s('usb.initialized', false)
      }
    }
  }
}
</script>
