<template>
  <div class="view">
    <!-- {{cashUnitIndex}} -->
    <v-card min-width="900">
      <v-card-title>常规</v-card-title>
      <v-card-text class="d-flex">
        <v-btn color="primary" @click="$store.__s('dialog.setLabel', true)">修改标签</v-btn>
        <v-btn class="ml-5" color="primary" @click="$store.__s('dialog.language', true)">修改语言</v-btn>
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn color="primary" outlined dark v-on="on" class="ml-5 d-flex justify-center">
              <v-icon>keyboard_arrow_down</v-icon>
              <div>{{cashUnitItems[cashUnitIndex]}}</div>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in cashUnitItems"
              :key="index"
              @click="onClickCash(index)"
            >
              <v-list-item-title>{{ item }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-card-text>
    </v-card>
    <v-card min-width="900" class="mt-5">
      <v-card-title>安全</v-card-title>
      <v-card-text class="d-flex">
        <v-btn color="primary" @click="setPin">修改PIN码</v-btn>
        <v-btn class="ml-5" color="primary" @click="checkSeed">验证助记词</v-btn>
        <v-btn class="ml-5" color="error" @click="wipeDevice">擦除设备</v-btn>
      </v-card-text>
    </v-card>
    <v-card min-width="900" class="mt-5">
      <v-card-title>版本信息</v-card-title>
      <v-card-text class="d-flex">
        <div>固件版本号：{{c_firmVersion}}</div>
        <div class="ml-10">软件版本号：{{app.version}}</div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'setting',
  data() {
    return {
    }
  },
  computed: {
    ...mapState(['usb', 'app', 'cashUnitItems', 'cashUnitIndex']),
    c_isDeviceConnect: vm => vm.$store.__s('usb.connect'),
    c_firmVersion() {
      return `${this.usb.majorVersion}.${this.usb.minorVersion}.${this.usb.patchVersion}`
    }
  },
  methods: {
    async wipeDevice() {
      const proto = {}
      const result = await this.$usb.cmd('WipeDevice', proto)
      console.log('wipeDevice', result)
    },
    async setPin() {
      const proto = {}
      const result = await this.$usb.cmd('ChangePin', proto)
      console.log('setPin', result)
    },
    async checkSeed() {
      const proto = {
        dry_run: true
      }
      const result = await this.$usb.cmd('RecoveryDevice', proto)
      console.log('checkSeed', result)
    },
    onClickCash(index) {
      this.$store.__s('cashUnitIndex', index)
    }
  }
}
</script>

<style lang="scss" scoped>
.view {
  background: transparent;
}
</style>
