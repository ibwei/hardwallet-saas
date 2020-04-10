<template>
  <v-container class="account-wrap">
    <eth-account :coin="c_coinInfo.symbol" :cash="c_cashUnitItems[c_cashUnitIndex]" :xpub="c_xpub" />
  </v-container>
</template>

<script>
import MixWallet from '@/mixins/wallet'
import ethAccount from '../components/account'
export default {
  name: 'Account',
  mixins: [MixWallet],
  components: {
    ethAccount
  },
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
