<template>
  <v-dialog v-model="d_show" max-width="500" persistent>
    <v-card>
      <v-card-title class="headline d-flex justify-space-between"
        >{{ $t('Transaction signed successfully') }}
        <v-icon @click="_close('mannual')">mdi-close</v-icon>
      </v-card-title>
      <v-divider />
      <v-card-text class="mt-6">
        {{ $props.signHash }}
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" text @click="copyAndColse">
          {{ $t('Copy signature') }}
        </v-btn>
        <v-btn color="green darken-1" text @click="autoBordercast">
          {{ $t('Broadcast now') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import * as clipboard from 'clipboard-polyfill'
import Axios from 'axios'
export default {
  props: {
    show: Boolean,
    signHash: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      d_show: false
    }
  },
  created() {
    this.d_show = this.$props.show
  },
  watch: {
    show(newV) {
      this.d_show = newV
    }
  },
  computed: {
    c_coinInfo: vm => vm.$store.__s('coinInfo')
  },
  methods: {
    copyAndColse() {
      try {
        clipboard.writeText(this.$props.signHash)
        this.$message.success(this.$t('Copy successfully'))
      } catch (error) {
        this.$message.error(this.$t('Copy failed'))
      }
      this._close('mannual')
    },
    async autoBordercast() {
      let res = null
      try {
        const newSymbol = this.c_coinInfo.symbol === 'usdt' ? 'eth' : this.c_coinInfo.symbol
        res = await Axios.get(`https://api.abckey.com/${newSymbol}/sendtx/${this.$props.signHash}`)
        if (res.data.result) {
          this._close('auto', res.data.result)
        } else {
          this.$emit('error-broadcast', res.data.error)
        }
      } catch (e) {
        this.$message.error({ message: this.$t('Network error,manual broadcast is recommended!'), duration: -1 })
      }
    },
    _close(type, transactionHash) {
      this.$emit('close-dialog', type, transactionHash)
    }
  },
  i18n: {
    messages: {
      zhCN: {
        'Unable to broadcast:': '无法广播，原因：',
        'Network error,manual broadcast is recommended!': '网络错误，建议手动广播',
        'Transaction signed successfully': '签名交易成功',
        'Copy signature': '复制签名',
        'Broadcast now': '马上广播',
        'Copy failed': '复制失败',
        'Copy successfully': '交易签名已经复制到剪贴板'
      }
    }
  }
}
</script>
<style lang="scss" scoped></style>
