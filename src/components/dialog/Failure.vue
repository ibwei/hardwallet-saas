<template>
  <v-dialog v-model="d_show" max-width="450" persistent scrollable>
    <v-card>
      <v-card-title class="subtitle-1"> <v-icon left>mdi-alert-circle-outline</v-icon>{{ $t('Failure') }}</v-card-title>
      <v-divider></v-divider>
      <div class="d-flex justify-center align-center subtitle-2" style="min-height:50px">{{ $t(this.d_msg) }}</div>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="close" color="primary" text>{{ $t('Close') }}</v-btn>
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
    c_msg: vm => vm.$store.__s('usb.msg'),
    c_err: vm => vm.$store.__s('usb.err')
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
    },
    c_err(err) {
      if (!err) return
      this.d_show = true
      this.d_msg = err.message
    }
  },
  methods: {
    close() {
      if (this.d_msg === 'PIN invalid') {
        window.location.reload()
      }
      this.d_show = false
    }
  },
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
        'Action cancelled by user': '操作已取消。',
        'Device is already initialized. Use Wipe first.': '设备已初始化。',
        'Unable to claim interface.': '请检查设备是否被其他网页所占用。'
      }
    }
  }
}
</script>
