<template>
  <v-container class="account-wrap">
    <wallet-account :coin="c_coinInfo.name" :cash="c_cashUnitItems[c_cashUnitIndex]" :xpub="c_xpub" />
  </v-container>
</template>

<script>
import MixWallet from '@/mixins/wallet'

export default {
  name: 'Account',
  mixins: [MixWallet],
  computed: {
    c_xpub: vm => vm.$store.__s('usb.xpub')
  }
}
</script>

<style lang="scss" scoped>
.account-wrap {
  margin: 20px auto;
  max-width: 960px;
}
</style>
