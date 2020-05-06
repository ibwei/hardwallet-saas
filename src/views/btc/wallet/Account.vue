<template>
  <v-container class="account-wrap">
    <wallet-account :coin="c_coinInfo.symbol" :cash="c_cashUnit" :xpub="c_xpub" />
  </v-container>
</template>

<script>
export default {
  name: 'Account',
  computed: {
    c_cashUnit: (vm) => vm.$store.__s('cashUnit'),
    c_xpub: (vm) => vm.$store.__s('usb.xpub'),
    c_cashUnitItems: (vm) => vm.$store.__s('cashUnitItems'),
    c_cashUnitIndex: (vm) => vm.$store.__s('cashUnitIndex'),
    c_coinInfo: (vm) => vm.$store.__s('coinInfo')
  }
}
</script>

<style lang="scss" scoped>
.account-wrap {
  margin: 20px auto;
  max-width: 960px;
}
</style>
