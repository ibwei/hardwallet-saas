<template>
  <v-container fill-height class="d-flex flex-column justify-center text-center align-center">
    <v-alert prominent width="80%" type="error" v-show="!d_usb">
      <v-row align="center">
        <v-col class="grow">Your browser is not support abckey.</v-col>
      </v-row>
    </v-alert>
    <div class="content">
      <div class="d-flex flex-row justify-center align-center">
        <img class="mr-4" src="../assets/logo.png" height="30" />
        <h1 class="title">{{ $t('Please Connect ABCKEY') }}</h1>
      </div>
      <v-btn dark rounded color="primary" :disabled="d_usb ? false : true" @click="connect" class="mt-6">
        <v-icon size="20" color="#fff">mdi-usb</v-icon>
        <span class="subtitle-2 pl-2">{{ $t('Check For Device') }}</span>
      </v-btn>
    </div>
    <div class="footer">
      <span class="subtitle-2">&copy; abckey.com</span>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'Connect',
  data() {
    return {
      d_usb: ''
    }
  },
  computed: {
    c_connect: vm => vm.$store.__s('usb.connect')
  },
  mounted() {
    this.d_usb = window.navigator.usb
  },
  methods: {
    /**
     * @method  connect - usbdevice
     * @return void
     */
    async connect() {
      await this.$usb.add()
    }
  },
  i18n: {
    messages: {
      zhCN: {
        'Please Connect ABCKEY...': '等待连接'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-content: center;
}
.footer {
  height: 100px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-content: center;
}
</style>
