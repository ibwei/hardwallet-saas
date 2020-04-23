<template>
  <v-container class="fill-height">
    <v-layout class="d-flex justify-center align-center text-center">
      <div>
        <v-progress-circular indeterminate size="188" color="primary">{{ brand.name === 'ABCKEY' ? $t('Loading ABCKEY') : $t('Loading DF-UKey') }}</v-progress-circular>
      </div>
    </v-layout>
  </v-container>
</template>

<script>
import UsbMixin from '@/mixins/usb'
import ETH from '@/mixins/eth'
import { mapState } from 'vuex'
export default {
  name: 'LoadData',
  mixins: [UsbMixin, ETH],
  async created() {
    this.initPublickey()
    if (this.$route.path !== `/${this.coinInfo.symbol}/wallet/account`) this.$router.push({ path: `/${this.coinInfo.symbol}/wallet/account` })
  },
  computed: {
    ...mapState(['brand', 'coinInfo'])
  },
  methods: {
    async initPublickey() {
      switch (this.coinInfo.symbol) {
        case 'usdt':
        case 'eth':
          await this.ethGetPublicKey()
          break
        default:
          await this.btcGetPublickKey()
      }
    }
  },
  i18n: {
    message: {
      zhCN: {
        'Loading ABCKEY': `ABCKEY 加载中`,
        'Loading DF-UKey': `迪富U盾 加载中`
      }
    }
  }
}
</script>
