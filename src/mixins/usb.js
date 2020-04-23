import { mapState } from 'vuex'
export default {
  data() {
    return {
      d_addressList: ['3323kpuDSksfSWOMQSKsfkj'],
      d_scriptType: '',
      d_showDisplay: false
    }
  },
  computed: {
    ...mapState(['coinInfo', 'brand']),
    c_addressType: vm => vm.$store.__s('addressType'),
    c_coinProtocol: vm => vm.$store.__s('coinProtocol'),
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
        return `m/${this.c_purpose}'/${this.coinInfo.slip44}'/0'`
      } catch (error) {
        this.$router.push({ path: process.env.NODE === 'production' ? this.brand.buildPath : '/' })
      }
    },
    c_purpose() {
      if (Reflect.has(this.coinInfo.bip, '49')) {
        if (this.c_addressType === 'new') {
          this.$store.__s('coinProtocol', 49)
          this.d_scriptType = 'SPENDP2SHWITNESS'
          return 49
        } else {
          this.d_scriptType = 'SPENDADDRESS'
          this.$store.__s('coinProtocol', 44)
          return 44
        }
      } else {
        this.d_scriptType = 'SPENDADDRESS'
        this.$store.__s('coinProtocol', 44)
        return 44
      }
    }
  },
  methods: {
    async btcGetPublickKey(showDisplay = false) {
      if (!this.c_addressN) {
        this.$message.error({ message: this.$t('Initializer failed'), duration: -1 })
        return
      }
      const proto = {
        coin_name: this.coinInfo.name,
        address_n: this.c_addressN,
        script_type: this.d_scriptType,
        show_display: showDisplay
      }
      await this.$usb.cmd('GetPublicKey', proto, true)
    },
    async m_recoveryDevice() {
      const proto = {
        word_count: this.d_wordCount,
        passphrase_protection: false,
        pin_protection: false,
        language: 'en-US',
        label: this.brand.name,
        enforce_wordlist: false
      }
      await this.$usb.cmd('RecoveryDevice', proto)
    },
    async m_resetDevice() {
      const proto = {
        display_random: false,
        strength: 256,
        passphrase_protection: false,
        pin_protection: false,
        language: 'en-US',
        label: this.brand.name,
        skip_backup: true,
        no_backup: false,
        backup_type: 0
      }
      await this.$usb.resetDevice(proto)
    },
    async m_backupDevice() {
      const proto = {}
      await this.$usb.cmd('BackupDevice', proto)
    },
    async m_initialize() {
      await this.$usb.cmd('Initialize')
    }
  },
  i18n: {
    messages: {
      zhCN: {
        'Initializer failed': '初始化程序失败'
      }
    }
  }
}
