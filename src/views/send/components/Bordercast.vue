<template>
  <v-dialog v-model="d_show" max-width="500" persistent>
    <v-card>
      <v-card-title class="headline">{{ $t('Transaction signed successfully') }}</v-card-title>
      <v-divider />
      <v-card-text class="mt-6">
        {{ $props.signHash }}
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" text @click="copyAndColse">
          {{ $t('Copy signatur') }}
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
  methods: {
    copyAndColse() {
      try {
        clipboard.writeText(this.$props.signHash)
        this.$message.success(this.$t('Copy successfully'))
        this.$message.success('复制成功')
      } catch (error) {
        this.$message.error(this.$t('Copy failed'))
      }
      this._close()
    },
    autoBordercast() {
      console.log('auto')
      this._close()
    },
    _close() {
      this.$emit('close-dialog')
    }
  },
  i18n: {
    messages: {
      zhCN: {
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
