<template>
  <div class="d-flex flex-column justify-center text-center align-center" style="height:100vh;">
    <div style="transform:translateY(-50%)">
      <div>
        <v-icon size="100" color="info">mdi-usb</v-icon>
        <h1 class="display-1 mt-6">{{ $t('Please Connect ABCKEY') }}</h1>
      </div>
      <v-btn dark rounded color="primary" @click="m_connect" class="mt-6">
        <v-icon dark>mdi-plus</v-icon>
        <span class="subtitle-2 pl-2">{{ $t('Check For Device') }}</span>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Connect',
  data () {
    return {}
  },
  computed: {
    ...mapState(['usb']),
    c_connect: vm => vm.$store.__s('usb.connect')
  },
  created () {
    if (this.usb.connect) {
      this.$router.push('/wallet/account')
    }
  },
  methods: {
    /**
     * @method  connect - usbdevice
     * @return void
     */
    async m_connect () {
      await this.$usb.add(res => {
        console.log('you have already choose device')
        this.$usb.syncVuex(res)
      })
    }
  },
  watch: {
    c_connect (newV) {
      if (newV) {
        this.$router.push('/wallet/account')
      } else {
        this.$router.push('/')
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
