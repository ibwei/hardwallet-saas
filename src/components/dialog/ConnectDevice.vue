<template>
  <v-dialog justify="center" overlay-opacity="0.1" v-model="c_connect" width="500" persistent>
    <v-sheet color="white" class="pa-5">
      <v-row>
        <v-col cols="12">
          <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <span class="title">Waiting for device to connect</span>
        </v-col>
      </v-row>
      <v-row class="pa-5">
        <v-col cols="12">
          <v-btn dark rounded color="primary" @click="m_connect">
            <v-icon dark>mdi-plus</v-icon>
            <span class="subtitle-2 pl-2">check for device</span>
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
  data () {
    return {}
  },
  computed: {
    ...mapState(['usb']),
    c_connect () {
      return !this.usb.connect
    }
  },
  methods: {
    /**
     * @method  connect - usbdevice
     * @return void
     */
    m_connect () {
      this.$usb.add(res => {
        console.log('you have already choose device')
        this.$usb.syncVuex(res)
      })
    }
  }
}
</script>
