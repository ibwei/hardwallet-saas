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
  async created () {
    await this.m_getPublickKey()
    if (this.$route.path !== '/wallet/account') this.$router.push({ path: '/wallet/account' })
  }
}
</script>
