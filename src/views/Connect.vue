<template>
  <div class="d-flex flex-column justify-center text-center align-center" style="height:100vh;">
    <div style="transform:translateY(-50%)">
      <div>
        <v-icon size="100" color="info">mdi-usb</v-icon>
        <h1 class="display-1 mt-6">{{ $t('Please Connect ABCKEY') }}</h1>
      </div>
      <v-btn dark rounded color="primary" @click="connect" class="mt-6">
        <v-icon dark>mdi-plus</v-icon>
        <span class="subtitle-2 pl-2">{{ $t('Check For Device') }}</span>
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Connect',
  data() {
    return {}
  },
  computed: {
    c_connect: vm => vm.$store.__s('usb.connect')
  },
  methods: {
    /**
     * @method  connect - usbdevice
     * @return void
     */
    async connect() {
      await this.$usb.add()
    }
  }
}
</script>

<style lang="scss" scoped></style>
