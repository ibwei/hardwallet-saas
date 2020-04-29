<template>
  <v-dialog v-model="d_show" max-width="450" persistent scrollable>
    <v-card>
      <v-card-title class="subtitle-1"><v-icon class="mr-2">mdi-gesture-tap-button</v-icon>{{ $t('ButtonAck') }}</v-card-title>
      <v-divider></v-divider>
      <v-card-text class="subtitle-2 card-text">{{ $t('Confirm the action on your device!') }}</v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    d_show: false
  }),
  computed: {
    c_msg: vm => vm.$store.__s('usb.msg')
  },
  watch: {
    c_msg(msg) {
      if (msg?.type === 'ButtonRequest' && msg.data?.code !== 'ButtonRequest_Address') this.d_show = true
      else this.d_show = false
    }
  },
  methods: {},
  i18n: {
    messages: {
      zhCN: {
        ButtonAck: '按键确认',
        'Confirm the action on your device!': '请在设备上确认您的操作！'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.card-text {
  line-height: 4rem;
}
</style>
