import { mapState } from 'vuex'
export default {
  data() {
    return {
      d_addressList: ['3323kpuDSksfSWOMQSKsfkj'],
      d_scriptType: 'SPENDP2SHWITNESS',
      d_showDisplay: false
    }
  },
  computed: {
    ...mapState(['coinInfo']),
    c_addressN() {
      const address_n = []
      const path = this.c_path.match(/\/[0-9]+('|H)?/g)
      for (const item of path) {
        let id = parseInt(item.match(/[0-9]+/g)[0])
        if (item.match(/('|H)/g)) id = (id | 0x80000000) >>> 0
        address_n.push(id)
      }
      return address_n
    },
    c_path() {
      try {
        const coinIndex = this.coinInfo.slip44
        return `m/${this.c_purpose}'/${coinIndex}'/0'/0/0`
      } catch (error) {
        console.log('get coin type is error!', error)
        this.$router.push({ path: '/' })
      }
    },
    c_purpose() {
      if (Reflect.has(this.coinInfo.bip, '49')) {
        return 49
      } else {
        return 44
      }
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
    },
    async m_recoveryDevice() {
      const proto = {
        word_count: this.d_wordCount,
        passphrase_protection: false,
        pin_protection: false,
        language: 'en-US',
        label: 'ABCKEY',
        enforce_wordlist: false
      }
      await this.$usb.cmd('RecoveryDevice', proto)
      this.$router.push({ path: '/wallet/account' })
    }
  }
}
