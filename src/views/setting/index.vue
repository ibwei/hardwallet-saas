<template>
  <div class="setting-wrap">
    <!-- {{cashUnitIndex}} -->
    <v-card min-width="900">
      <v-card-title>{{ $t('General') }}</v-card-title>
      <v-card-text class="d-flex">
        <v-btn color="primary" @click="$store.__s('dialog.setLabel', true)">{{ $t('Edit Label') }}</v-btn>
        <v-btn class="ml-5" color="primary" @click="$store.__s('dialog.language', true)">{{ $t('Change Language') }}</v-btn>
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn color="primary" outlined dark v-on="on" class="ml-5 d-flex justify-center">
              <div>{{ cashUnitItems[cashUnitIndex] }}</div>
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(item, index) in cashUnitItems" :key="index" @click="onClickCash(index)">
              <v-list-item-title>{{ item }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-card-text>
    </v-card>
    <v-card min-width="900" class="mt-5">
      <v-card-title>{{ $t('Safe') }}</v-card-title>
      <v-card-text class="d-flex">
        <v-btn color="primary" @click="setPin">{{ $t('Modify PIN') }}</v-btn>
        <v-btn class="ml-5" color="primary" @click="checkSeed">{{ $t('Verification Mnemonics') }}</v-btn>
        <v-btn class="ml-5" color="error" @click="wipeDevice">{{ $t('Wipe Device') }}</v-btn>
      </v-card-text>
    </v-card>
    <v-card min-width="900" class="mt-5">
      <v-card-title>{{ $t('Version') }}</v-card-title>
      <v-card-text class="d-flex">
        <div>{{ $t('Firmware Version') }}: {{ c_firmVersion }}</div>
        <div class="ml-10">{{ $t('Software Version') }}: {{ app.version }}</div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'setting',
  data() {
    return {}
  },
  computed: {
    ...mapState(['usb', 'app', 'cashUnitItems', 'cashUnitIndex']),
    c_isDeviceConnect: vm => vm.$store.__s('usb.connect'),
    c_firmVersion: vm => `${vm.usb.majorVersion}.${vm.usb.minorVersion}.${vm.usb.patchVersion}`
  },
  methods: {
    async wipeDevice() {
      const proto = {}
      await this.$usb.cmd('WipeDevice', proto)
    },
    async setPin() {
      const proto = {}
      await this.$usb.cmd('ChangePin', proto)
    },
    async checkSeed() {
      const proto = {
        dry_run: true
      }
      await this.$usb.cmd('RecoveryDevice', proto)
    },
    onClickCash(index) {
      this.$store.__s('cashUnitIndex', index)
    }
  },
  i18n: {
    messages: {
      zhHans: {
        General: '常规',
        Safe: '安全',
        Version: '版本信息',
        'Edit Label': '修改标签',
        'Change Language': '修改语言',
        'Modify PIN': '修改PIN码',
        'Verification Mnemonics': '验证助记词',
        'Wipe Device': '擦除设备',
        'Firmware Version': '固件版本号',
        'Software Version': '软件版本号'
      },
      en: {
        General: 'General',
        Safe: 'Safe',
        Version: '版本信息',
        'Edit Label': 'Edit Label',
        'Change Language': 'Change Language',
        'Modify PIN': 'Modify PIN',
        'Verification Mnemonics': 'Verification Mnemonics',
        'Wipe Device': 'Wipe Device',
        'Firmware Version': 'Firmware Version',
        'Software Version': 'Software Version'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.setting-wrap {
  background: transparent;
  max-width: 960px;
  margin: 20px auto;
}
</style>
