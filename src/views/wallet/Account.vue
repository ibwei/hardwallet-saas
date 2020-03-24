<template>
  <v-container class="account-wrap">
    <wallet-account :name="c_coinInfo.name" :currency="c_cashUnitItems[c_cashUnitIndex]" :xpub="c_xpub" />
  </v-container>
</template>

<script>
import mix_wallet from '@/mixins/Wallet'
export default {
  name: 'Account',
  mixins: [mix_wallet]
}
</script>

<style lang="scss" scoped>
.account-wrap {
  margin: 20px auto;
  max-width: 960px;
}
</style>
