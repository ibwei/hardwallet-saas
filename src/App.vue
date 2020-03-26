<template>
  <div id="app">
    <v-app>
      <connect v-if="!c_usb.connect" />
      <load-data v-else-if="!c_usb.xpub" />
      <v-content v-else class="blue lighten-5" style="min-height:100vh;">
        <v-container fluid class="pa-0">
          <side-navbar />
          <top-bar />
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
import LoadData from '@/views/LoadData'
export default {
  name: 'App',
  components: {
    SideNavbar,
    Connect,
    TopBar,
    LoadData
  },
  computed: {
    c_usb: vm => vm.$store.__s('usb')
  },
  watch: {
    $route() {
      window.document.title = this.$route.meta.title ? this.$route.meta.title : 'abckey-webusb'
    }
  }
}
</script>
