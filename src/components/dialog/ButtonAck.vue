<template>
  <v-dialog v-model="d_show" max-width="450" persistent scrollable>
    <v-card height="150">
      <v-card-title class="title">{{ $t('ButtonAck') }}</v-card-title>
      <v-card-text class="subtitle-1 card-text">{{ $t('Confirm the action on your device!') }}</v-card-text>
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
    // c_show: vm => vm.$store.__s('dialog.buttonAck')
  },
  watch: {
    c_msg(msg) {
      if (msg.type === 'ButtonRequest') this.d_show = true
      else this.d_show = false
    }
  },
  methods: {},
  i18n: {
    messages: {
      zhHans: {
        ButtonAck: '按键确认',
        'Confirm the action on your device!': '请在设备上确认您的操作！'
      },
      en: {
        ButtonAck: 'ButtonAck',
        'Confirm the action on your device!': 'Confirm the action on your device!'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.card-text {
  line-height: 4rem
}
</style>
