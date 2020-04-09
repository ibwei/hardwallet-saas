<template>
  <v-dialog v-model="d_show" max-width="450" persistent scrollable>
    <v-card>
      <v-card-title class="subtitle-1">{{ $t('Failure') }}</v-card-title>
      <v-divider></v-divider>
      <v-card-text class="subtitle-2">{{ $t(this.d_msg) }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="d_show = false">{{ $t('Close') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      d_msg: null,
      d_show: false,
      d_whiteList: ['Failure_NotInitialized']
    }
  },
  computed: {
    c_msg: vm => vm.$store.__s('usb.msg')
  },
  watch: {
    c_msg(msg) {
      this.$store.__s('pageLoading', false)
      if (msg?.type === 'Failure') {
        this.d_whiteList.map(item => {
          if (msg.data.code.indexOf(item) === -1) {
            this.d_show = true
            this.d_msg = msg.data.message
          }
        })
      }
    }
  },
  methods: {},
  i18n: {
    messages: {
      zhCN: {
        'Wrong word retyped': '多次输入了错误的单词',
        'PIN mismatch': 'PIN码不匹配',
        'Access denied.': '拒绝访问。',
        'Unpaired device.': '未配对设备。',
        'No device selected.': '未选择设备。',
        'The transfer was cancelled.': '传输已取消。',
        "Cannot read property 'requestDevice' of undefined": '您的浏览器未支持 WebUSB。',
        'Device not initialized': '设备未初始化。',
        'Unknown message': '未知消息。',
        'Device disconnected': '设备已断开',
        'Action cancelled by user': '操作已取消。'
      }
    }
  }
}
</script>
