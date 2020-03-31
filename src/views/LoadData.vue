<template>
  <v-container class="fill-height">
    <v-layout class="d-flex justify-center align-center text-center">
      <div>
        <v-progress-circular indeterminate size="188" color="primary">{{ $t('Loading ABCKEY') }}</v-progress-circular>
      </div>
    </v-layout>
  </v-container>
</template>

<script>
import UsbMixin from '@/mixins/usb'
export default {
  name: 'LoadData',
  mixins: [UsbMixin],
  async created() {
    await this.m_getPublickKey()
    if (this.$route.path !== '/wallet/account') this.$router.push({ path: '/wallet/account' })
  },
  computed: {
    c_msg: vm => vm.$store.__s('usb.msg')
  },
  watch: {
    c_msg(msg) {
      if (msg.data.message === 'Device successfully initialized' || msg.data.message === 'Device recovered') {
        this.$router.push({ path: '/' })
        this.$store.__s('usb.initialized', false)
      }
    }
  }
}
</script>
