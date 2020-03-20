<template>
  <v-container>
    <wallet-account
      name="bitcoin"
      symbol="btc"
      :currency="cashUnitItems[cashUnitIndex]"
      :xpub="xpub"
    ></wallet-account>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Account',
  data: () => ({}),
  computed: {
    ...mapState(['xpub', 'cashUnitItems', 'cashUnitIndex'])
  }
}
</script>

<style lang="scss" scoped></style>
