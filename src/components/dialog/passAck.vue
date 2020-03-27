<template>
  <v-dialog v-model="d_show" max-width="333" persistent scrollable>
    <v-card>
      <v-card-title class="headline" />
      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field v-model="d_passphrase" :type="d_eye ? 'text' : 'password'" :label="$t('Passphrase')" :append-icon="d_eye ? 'mdi-eye' : 'mdi-eye-off'" @click:append="d_eye = !d_eye" outlined hide-details @keyup.enter.native="enterPass()" autofocus />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn @click="enterPass()" color="primary" large depressed block>{{ $t('Confirm') }}</v-btn>
            <br />
            <v-btn color="error" large depressed block>{{ $t('Cancel') }}</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      <v-overlay :value="d_loading">
        <v-progress-circular indeterminate size="64" />
      </v-overlay>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    d_eye: false,
    d_show: false,
    d_passphrase: '',
    d_loading: false
  }),
  computed: {
    c_msg: vm => vm.$store.__s('usb.msg')
  },
  watch: {
    async c_msg(msg) {
      if (msg?.type === 'PassphraseRequest') this.d_show = true
      this.d_loading = false
      this.d_pin = ''
    }
  },
  methods: {
    async enterPass() {
      this.d_loading = true
      this.d_show = false
      await this.$usb.cmd('PassphraseAck', { passphrase: this.d_passphrase })
    }
  }
}
</script>
