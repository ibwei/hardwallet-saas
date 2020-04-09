export default {
  methods: {
    async ethGetPublicKey() {
      if (!this.c_addressN) return (this.d_response = 'path error')
      const proto = {
        address_n: this.c_addressN,
        show_display: this.d_showDisplay
      }
      console.log(proto)
      await this.$usb.cmd('EthereumGetPublicKey', proto, true)
    }
  }
}
