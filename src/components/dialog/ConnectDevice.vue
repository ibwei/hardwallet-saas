<template>
  <v-dialog justify="center" overlay-opacity="0.1" v-model="c_show" width="500" persistent>
    <v-sheet color="white" class="pa-6">
      <v-row class="mt-4">
        <v-col cols="12">
          <span class="title">{{ $t('Waiting for device to connect') }}</span>
        </v-col>
      </v-row>
      <v-row class="pa-5">
        <v-col cols="12">
          <v-btn dark rounded color="primary" @click="m_connect">
            <v-icon dark>mdi-plus</v-icon>
            <span class="subtitle-2 pl-2">{{ $t('Check For Device') }}</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-sheet>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ConnectDevice',
  data() {
    return {}
  },
  computed: {
    ...mapState(['usb']),
    c_connect: vm => vm.$store.__s('usb.connect'),
    c_show: vm => !vm.$store.__s('usb.connect')
  },
  methods: {
    /**
     * @method  connect - usbdevice
     * @return void
     */
    async m_connect() {
      await this.$usb.add(res => {
        console.log('you have already choose device')
        this.$usb.syncVuex(res)
      })
    }
  },
  i18n: {
    messages: {
      zhCN: {
        'Waiting for device to connect': '等待设备连接中',
        'Check For Device': '检查设备'
      }
    }
  }
}
</script>
