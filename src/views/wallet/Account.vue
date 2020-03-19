<template>
  <v-container>
    <wallet-account
      name="bitcoin"
      symbol="btc"
      currency="usd"
      :xpub="usb.xpub"
    ></wallet-account>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Account',
  data: () => ({
    d_path: `m/49'/3'/0'/0/0`,
    d_scriptType: 'SPENDP2SHWITNESS',
    d_showDisplay: false
  }),
  computed: {
    ...mapState(['usb']),
    c_addressN() {
      const address_n = []
      const path = this.d_path.match(/\/[0-9]+('|H)?/g)
      for (const item of path) {
        let id = parseInt(item.match(/[0-9]+/g)[0])
        if (item.match(/('|H)/g)) id = (id | 0x80000000) >>> 0
        address_n.push(id)
      }
      return address_n
    },
    c_isDeviceConnect: vm => vm.usb.connect
  },
  methods: {
    async getPbk() {
      // console.log(888888888)
      if (!this.c_addressN) return (console.error('path error'))
      const proto = {
        address_n: this.c_addressN,
        script_type: this.d_scriptType,
        show_display: this.d_showDisplay
      }
      await this.$usb.cmd('Initialize')
      const result = await this.$usb.cmd('GetPublicKey', proto)
      console.log('getPublicKey', result)
      // result.data.node.chain_code = Buffer.from(result.data.node.chain_code, 'base64').toString('hex')
      // result.data.node.public_key = Buffer.from(result.data.node.public_key, 'base64').toString('hex')
      // console.log('getPublicKey2', result)
      // this.d_request = `abckey.cmd("GetPublicKey", ` + JSON.stringify(proto, null, 4) + ')'
      // this.d_response = JSON.stringify(result, null, 4)
    }
  },
  watch: {
    c_isDeviceConnect(e) {
      if (e) this.getPbk()
    }
  }
}
</script>

<style lang="scss" scoped></style>
