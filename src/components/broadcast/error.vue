<template>
  <v-snackbar v-model="d_show" :vertical="true" :multi-line="true" top color="error" :timeout="0">
    <div class="d-flex flex-row align-center flex-wrap justify-center ma-2 pa-4">
      <v-icon color="white" class="mr-4">mdi-wifi-off</v-icon>
      <v-divider vertical class="mr-3" />
      <div class="subtitle-2  pr-3 d-flex flex-column" style="word-wrap:break-word;">
        <span class="subtitle-1  mr-1">{{ $t('Reason for unsuccessful broadcast:') }} </span>
        <div style="width:500px;height:auto;">{{ $t(`${this.reason}`) }}</div>
        <div class="d-flex align-center">
          <v-btn v-if="reason === 'nonce too low'" @click="updateNonce" color="#fff" class="mr-3" outlined line text>
            {{ $t('Update Nonce') }}
          </v-btn>
          <v-btn color="#fff" class="mr-3" outlined line text @click="close">
            {{ $t('Close') }}
          </v-btn>
        </div>
      </div>
    </div>
  </v-snackbar>
</template>

<script>
export default {
  props: {
    show: Boolean,
    reason: String
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
  methods: {
    updateNonce() {
      this.$emit('update-nonce')
    },
    close() {
      this.$emit('close')
    }
  },
  i18n: {
    messages: {
      zhCN: {
        'Update Nonce': '更新nonce',
        'intrinsic gas too low': 'Gas limit 太低,不会广播给矿工',
        'insufficient funds for gas * price + value': '你的余额不够发起此次支付，请检查你的可用额度',
        'exceeds block gas limit': '没有足够的余额，不会广播给他矿工',
        'already known': '该笔交易数据已经发送，正在确认中，请耐心等待...',
        'nonce too low': '上一笔交易已经确认，为了获取最新随机数，请点击立即更新nonce，并重新发送交易请求。',
        'Reason for unsuccessful broadcast:': '广播未成功的原因:',
        'replacement transaction underpriced': '上笔交易未确认，并且当前gas price不高于上笔交易的110%，如需覆盖上笔交易，建议增大手续费再次发起交易！'
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
