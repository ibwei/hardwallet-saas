<template>
  <v-dialog v-model="c_show" max-width="333" persistent scrollable>
    <v-card>
      <v-card-title class="headline"></v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field v-model="d_label" :label="$t('Label')" outlined hide-details @keyup.enter.native="setLabel()" autofocus />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn @click="setLabel()" color="primary" large depressed block>{{ $t('Enter Word') }}</v-btn>
            <br />
            <v-btn @click="cancel()" color="error" large depressed block>{{ $t('Cancel') }}</v-btn>
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
    d_label: '',
    d_loading: false
  }),
  computed: {
    c_msg: vm => vm.$store.__s('usb.msg'),
    c_show: vm => vm.$store.__s('dialog.setLabel')
  },
  watch: {
    async c_msg(msg) {
      if (msg?.type === 'WordRequest') this.d_show = true
      else this.d_show = false
      this.d_loading = false
    },
    async c_show() {
      const initData = await this.$usb.cmd('Initialize')
      this.d_label = initData.data.label
    }
  },
  methods: {
    async setLabel() {
      const proto = {
        label: this.d_label
      }
      const result = await this.$usb.cmd('ApplySettings', proto)
      this.d_response = JSON.stringify(result, null, 4)
      this.cancel()
    },
    async cancel() {
      this.$store.__s('dialog.setLabel', false)
    }
  },
  i18n: {
    messages: {
      zhCN: {
        Label: '标签'
      }
    }
  }
}
</script>
