<template>
  <v-container>
    <wallet-receive
      name="bitcoin"
      symbol="btc"
      :currency="cashUnitItems[cashUnitIndex]"
      :xpub="xpub"
    />
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Receive',
  data: () => ({}),
  computed: {
    ...mapState(['xpub', 'cashUnitItems', 'cashUnitIndex'])
  },
  methods: {}
}
</script>

<style lang="scss" scoped></style>
