<template>
  <v-container class="account-wrap">
    <eth-account :coin="c_coinInfo.symbol" :cash="c_cashUnit" :xpub="c_xpub" />
  </v-container>
</template>

<script>
import wallet from '@/mixins/wallet'
import ethAccount from '../components/account'
export default {
  name: 'Account',
  mixins: [wallet],
  components: {
    ethAccount
  },
  computed: {
    c_xpub: (vm) => vm.$store.__s('usb.xpub'),
    c_cashUnit: (vm) => vm.$store.__s('cashUnit')
  }
}
</script>

<style lang="scss" scoped>
.account-wrap {
  margin: 20px auto;
  max-width: 960px;
}
</style>
