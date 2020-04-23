<template>
  <v-snackbar v-model="show" :vertical="true" :multi-line="true" top color="success" :timeout="0">
    <div class="d-flex flex-row align-center flex-wrap justify-center ma-2 pa-4">
      <v-icon color="white" class="mr-4">mdi-cast</v-icon>
      <v-divider vertical class="mr-3" />
      <div class="subtitle-1  pr-3 d-flex flex-column" style="word-wrap:break-word;">
        <span class="subtitle-2  mr-1">{{ $t('TX Hash') }} : </span>
        <div style="width:500px;height:auto;">{{ this.transactionHash }}</div>
        <div class="d-flex align-center">
          <v-btn color="#fff" class="mr-3" outlined line text @click="openBlockchainBrowser">
            {{ $t('Transaction Detail') }}
          </v-btn>
          <v-btn color="#fff" class="mr-3" outlined line text @click="copy">
            {{ $t('Copy') }}
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
import * as clipboard from 'clipboard-polyfill'
export default {
  props: {
    show: Boolean,
    transactionHash: String,
    coinType: String
  },
  data() {
    return {
      apiUrl: 'https://www.blockchain.com'
    }
  },
  methods: {
    openBlockchainBrowser() {
      const type = this.coinType === 'usdt' ? 'eth' : this.coinType
      window.open(`${this.apiUrl}/${type}/tx/${this.transactionHash}`, 'blank')
    },
    async copy() {
      await clipboard.writeText(this.transactionHash)
      this.$message.success(this.$t('Copy Success!'))
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped></style>
