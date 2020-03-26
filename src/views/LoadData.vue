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
  data () {
    return {}
  },
  async created () {
    await this.m_getPublickKey()
    this.$router.push({ path: '/wallet/account' })
  }
}
</script>

<style lang="scss" scoped></style>
