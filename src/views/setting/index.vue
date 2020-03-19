<template>
  <div class="view">
    <v-card min-width="900">
      <v-card-title>常规</v-card-title>
      <v-card-text class="d-flex">
        <v-btn color="primary" @click="$store.__s('dialog.setLabel', true)">修改标签</v-btn>
        <v-btn class="ml-5" color="primary" @click="$store.__s('dialog.language', true)">修改语言</v-btn>
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn color="primary" outlined dark v-on="on" class="ml-5">
              {{d_cashUnitItems[d_cashUnitIndex]}}
              <v-icon>keyboard_arrow_down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item-group v-model="d_cashUnitIndex" color="primary">
              <v-list-item v-for="(item, i) in d_cashUnitItems" :key="i">
                <v-list-item-content>
                  <v-list-item-title v-html="item"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
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
        <div class="ml-10">软件版本号：{{c_softVersion}}</div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'setting',
  data() {
    return {
      d_cashUnitItems: ['CNY', 'USD'],
      d_cashUnitIndex: 0
    }
  },
  computed: {
    c_isDeviceConnect: vm => vm.$store.__s('usb.connect'),
    c_firmVersion() {
      const major = this.$store.__s('usb.initDeviceData.major_version')
      const minor = this.$store.__s('usb.initDeviceData.minor_version')
      const patch = this.$store.__s('usb.initDeviceData.patch_version')
      return `${major}.${minor}.${patch}`
    },
    c_softVersion: vm => vm.$store.__s('app.version')
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
    }
  }
}
</script>

<style lang="scss" scoped>
.view {
  background: transparent;
}
</style>
