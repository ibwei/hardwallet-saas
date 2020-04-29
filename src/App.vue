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
              <v-col class="grow">{{ $t('Your device is not backed up. To ensure the safety of your funds, please backup immediately!') }}</v-col>
              <v-col class="shrink">
                <v-btn rounded @click="m_backupDevice">👉{{ $t('Backup Now') }}</v-btn>
              </v-col>
            </v-row>
          </v-alert>
          <loading v-show="c_pageLoading" />
          <router-view />
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
    c_brand: vm => vm.$store.__s('brand'),
    c_coinInfo: vm => vm.$store.__s('coinInfo'),
    c_needsBackup: vm => vm.$store.__s('usb.needsBackup')
  },
  async created() {
    const coinType = this.$store.__s('coinType').toLowerCase()
    this.$store.__s('coinInfo', coinbook[coinType])
  },
  watch: {
    $route() {
      window.document.title = this.$route.meta.title ? this.$route.meta.title : this.c_brand.name
    },
    async c_isConnect(value) {
      if (value === true) {
        this.$message.success(this.$t('Device is connected'))
        await this.$usb.cmd('Initialize')
      }
    },
    c_msg(msg) {
      if (msg.data.message === 'Device successfully initialized' || msg.data.message === 'Device recovered') {
        this.$router.push({ path: `/${this.c_coinInfo.symbol}/wallet/account/` })
        this.$store.__s('usb.initialized', false)
      }
    }
  },
  i18n: {
    messages: {
      zhCN: {
        'Device is connected': '设备连接成功',
        'Your device is not backed up. To ensure the safety of your funds, please backup immediately!': '您的设备未备份。 为了确保您的资金安全，请立即备份！',
        'Backup Now': ' 立即备份 '
      }
    }
  }
}
</script>
