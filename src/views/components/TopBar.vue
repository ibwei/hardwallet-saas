<template>
  <div class="d-flex flex-row justify-end align-center blue lighten-3 shadow">
    <div
      class="d-flex flex-row justify-center align-center pa-2 ma-2 pl-4 pr-4 blue lighten-5"
      style="border-radius:20px; width:auto;"
    >
      <div class="body-2">{{ c_deviceName }}</div>
      <i class="icon pl-2">&#xe606;</i>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    c_deviceName() {
      if (this.$store.__s('usb.connect')) return this.$store.__s('usb.label') ? this.$store.__s('usb.label') : this.$store.__s('usb.product')
      else return 'Waiting for connect'
    }
  }
}
</script>

<style lang="scss" scoped></style>
