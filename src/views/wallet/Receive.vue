<template>
  <v-container>
    <wallet-receive
      :name="c_coinInfo.name"
      :symbol="c_coinInfo.symbol"
      :currency="c_cashUnitItems[c_cashUnitIndex]"
      :xpub="c_xpub"
    />
  </v-container>
</template>

<script>
import MixWallet from '@/mixins/wallet'
export default {
  name: 'Receive',
  mixins: [MixWallet]
}
</script>
