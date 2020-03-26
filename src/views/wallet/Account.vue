<template>
  <v-container class="account-wrap">
    <wallet-account :name="c_coinInfo.name" :currency="c_cashUnitItems[c_cashUnitIndex]" :xpub="c_xpub" />
  </v-container>
</template>

<script>
import MixWallet from '@/mixins/wallet'
import { mapState } from 'vuex'

export default {
  name: 'Account',
  mixins: [MixWallet],
  computed: {
    ...mapState(['usb'])
  }
}
</script>

<style lang="scss" scoped>
.account-wrap {
  margin: 20px auto;
  max-width: 960px;
}
</style>
