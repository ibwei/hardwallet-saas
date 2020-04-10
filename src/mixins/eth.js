import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['eth'])
  },
  methods: {
    async ethGetPublicKey() {
      if (!this.c_addressN) return (this.d_response = 'path error')
      const proto = {
        address_n: this.c_addressN,
        show_display: this.d_showDisplay
      }
      console.log(proto)
      await this.$usb.cmd('EthereumGetPublicKey', proto, true)
    },
    async ethGetAddress() {
      const result = await this.$usb.cmd('EthereumGetAddress', {
        address_n: [(44 | 0x80000000) >>> 0, (this.c_coinInfo.slip44 | 0x80000000) >>> 0, (0 | 0x80000000) >>> 0, 0, this.eth.account],
        show_display: false
      })
      return result.data.address
    }
  }
}
