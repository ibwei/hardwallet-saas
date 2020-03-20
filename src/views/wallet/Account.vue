<template>
  <v-container>
    <wallet-account
      :name="c_coinInfo.name"
      :symbol="c_coinInfo.symbol"
      :currency="c_cashUnitItems[c_cashUnitIndex]"
      :xpub="c_xpub"
    ></wallet-account>
  </v-container>
</template>

<script>
import mix_wallet from '@/mixins/Wallet'
export default {
  name: 'Account',
  mixins: [mix_wallet]
}
</script>
