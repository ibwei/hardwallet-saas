<template>
  <v-dialog v-model="d_show" max-width="450" persistent scrollable>
    <v-card>
      <v-card-title class="headline">{{ $t(d_title) }}</v-card-title>
      <v-card-text>
        <v-row>
          <v-col class="d-flex">
            <v-sheet color="grey lighten-2" min-height="30" width="500" class="psw-sheet">
              <v-icon v-for="n in d_pin.length" :key="n" color="black">mdi-lock</v-icon>
            </v-sheet>
            <v-btn class="al float-left" @click.stop="deletePin()" color="error" icon>
              <v-icon>mdi-backspace</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn @click="inputPin(7)" outlined>
              <v-icon>mdi-key</v-icon>
            </v-btn>
          </v-col>
          <v-col>
            <v-btn @click="inputPin(8)" outlined>
              <v-icon>mdi-key</v-icon>
            </v-btn>
          </v-col>
          <v-col>
            <v-btn @click="inputPin(9)" outlined>
              <v-icon>mdi-key</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn @click="inputPin(4)" outlined>
              <v-icon>mdi-key</v-icon>
            </v-btn>
          </v-col>
          <v-col>
            <v-btn @click="inputPin(5)" outlined>
              <v-icon>mdi-key</v-icon>
            </v-btn>
          </v-col>
          <v-col>
            <v-btn @click="inputPin(6)" outlined>
              <v-icon>mdi-key</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn @click="inputPin(1)" outlined>
              <v-icon>mdi-key</v-icon>
            </v-btn>
          </v-col>
          <v-col>
            <v-btn @click="inputPin(2)" outlined>
              <v-icon>mdi-key</v-icon>
            </v-btn>
          </v-col>
          <v-col>
            <v-btn @click="inputPin(3)" outlined>
              <v-icon>mdi-key</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div class="flex-grow-1"></div>
            <v-btn @click="enterPin()" color="primary" large depressed block>{{ $t('Enter PIN') }}</v-btn>
            <br />
            <v-btn @click="init()" color="error" large depressed block>{{ $t('Cancel') }}</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      <v-overlay :value="d_loading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    d_title: 'PIN',
    d_loading: false,
    d_show: false,
    d_pin: ''
  }),
  computed: {
    c_msg: vm => vm.$store.__s('usb.msg')
    // c_show: vm => vm.$store.__s('dialog.pinAck')
  },
  watch: {
    async c_msg(msg) {
      if (msg?.type === 'PinMatrixRequest') {
        this.d_show = true
        if (msg.data.type === 'PinMatrixRequestType_Current') this.d_title = 'PIN'
        if (msg.data.type === 'PinMatrixRequestType_NewFirst') this.d_title = 'Enter a new PIN'
        if (msg.data.type === 'PinMatrixRequestType_NewSecond') this.d_title = 'Re-enter PIN'
      } else {
        this.d_show = false
      }
      this.d_loading = false
      this.d_pin = ''
    }
  },
  methods: {
    inputPin(value) {
      if (this.d_pin.length > 8) return
      this.d_pin += value
    },
    deletePin() {
      if (window.event.keyCode === 13) return
      if (this.d_pin.length > 0) this.d_pin = this.d_pin.substr(0, this.d_pin.length - 1)
    },
    async enterPin() {
      this.d_loading = true
      await this.$usb.cmd('PinMatrixAck', { pin: this.d_pin })
    },
    async init() {
      await this.$usb.cmd('Initialize')
      this.d_show = false
    }
  },
  i18n: {
    messages: {
      zhCN: {
        'Enter a new PIN': '输入一个新PIN码',
        PIN: '请输入PIN码',
        'Re-enter PIN': '再次输入PIN码'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.psw-sheet {
  line-height: 36px;
}
</style>
