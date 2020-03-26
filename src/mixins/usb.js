export default {
  data() {
    return {
      d_addressList: ['3323kpuDSksfSWOMQSKsfkj'],
      d_path: `m/49'/0'/0'/0/0`,
      d_scriptType: 'SPENDP2SHWITNESS',
      d_showDisplay: false,
      d_purpose: 49
    }
  },
  computed: {
    c_addressN() {
      const address_n = []
      const path = this.d_path.match(/\/[0-9]+('|H)?/g)
      for (const item of path) {
        let id = parseInt(item.match(/[0-9]+/g)[0])
        if (item.match(/('|H)/g)) id = (id | 0x80000000) >>> 0
        address_n.push(id)
      }
      return address_n
    }
  },
  methods: {
    async m_getPublickKey() {
      if (!this.c_addressN) return (this.d_response = 'path error')
      const proto = {
        address_n: this.c_addressN,
        script_type: this.d_scriptType,
        show_display: this.d_showDisplay
      }
      await this.$usb.cmd('GetPublicKey', proto, true)
    }
  }
}
