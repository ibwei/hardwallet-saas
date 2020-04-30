<template>
  <div class="setting-wrap">
    <v-card class="pa-3">
      <v-card-title>
        <div class="d-flex align-center">
          <v-icon color="#333" class="mr-2">mdi-settings-outline</v-icon>
          <span>{{ $t('General') }} </span>
        </div>
      </v-card-title>
      <v-card-text class="d-flex">
        <v-btn rounded color="primary" @click="$store.__s('dialog.setLabel', true)">{{ $t('Edit Device Label') }}</v-btn>
        <v-sheet :max-width="$store.__s('app.language') === 'zhCN' ? 180 : 250">
          <v-select class="ml-5" v-model="c_cashUnit" :items="c_cashUnitItems" :label="$t('Switch Fiat Unit')" dense outlined />
        </v-sheet>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-title>
        <div class="d-flex align-center">
          <v-icon color="#333" class="mr-2">mdi-security</v-icon>
          <span>{{ $t('Safe') }} </span>
        </div>
      </v-card-title>
      <v-card-text class="d-flex  flex-row align-center  justify-start">
        <v-btn rounded color="primary" @click="setPin">{{ $t('Modify PIN') }}</v-btn>
        <v-btn rounded class="ml-5" :color="c_passphraseProtection ? 'error' : 'success'" @click="setPassphrase">{{ c_passphraseProtection ? $t('Disabled Passphrase') : $t('Enable Passphrase') }}</v-btn>
        <v-btn rounded class="ml-5" color="error" @click="closePin">{{ $t('Close Pin') }}</v-btn>
        <v-btn rounded class="ml-5" color="primary" @click="checkSeed">{{ $t('Verification Mnemonics') }}</v-btn>
        <v-btn rounded class="ml-5" color="error" @click="wipeDevice">{{ $t('Wipe Device') }}</v-btn>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-title
        ><div class="d-flex align-center">
          <v-icon color="#333" class="mr-2">mdi-update</v-icon>
          <span>{{ $t('Version') }} </span>
        </div></v-card-title
      >
      <v-card-text class="d-flex subtitle-2">
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
    ...mapState(['usb', 'app']),
    c_cashUnitItems: vm => vm.$store.__s('cashUnitItems'),
    c_cashUnit: {
      set(val) {
        if (val !== undefined) {
          this.$store.__s('cashUnit', val)
        }
      },
      get() {
        return this.$store.__s('cashUnit')
      }
    },
    c_isDeviceConnect: vm => vm.$store.__s('usb.connect'),
    c_firmVersion: vm => `${vm.usb.majorVersion}.${vm.usb.minorVersion}.${vm.usb.patchVersion}`,
    c_passphraseProtection: vm => vm.$store.__s('usb.passphraseProtection')
  },
  methods: {
    async wipeDevice() {
      const proto = {}
      await this.$usb.cmd('WipeDevice', proto)
      location.reload()
    },
    async setPin() {
      const proto = {}
      await this.$usb.cmd('ChangePin', proto)
    },
    async closePin() {
      const proto = {
        remove: true
      }
      await this.$usb.cmd('ChangePin', proto)
    },
    async checkSeed() {
      const proto = {
        dry_run: true
      }
      await this.$usb.cmd('RecoveryDevice', proto)
    },
    onClickCash(index) {
      this.$store.__s('c_cashUnitIndex', index)
    },
    async setPassphrase() {
      const proto = {
        use_passphrase: !this.c_passphraseProtection
      }
      await this.$usb.cmd('ApplySettings', proto)
      await this.$usb.cmd('Initialize')
    }
  },
  i18n: {
    messages: {
      zhCN: {
        General: '常规',
        Safe: '安全',
        'Close Pin': '关闭PIN码',
        Version: '版本信息',
        'Edit Device Label': '修改设备标签',
        'Modify PIN': '修改 PIN 码',
        'Verification Mnemonics': '验证助记词',
        'Wipe Device': '擦除设备',
        'Firmware Version': '固件版本号',
        'Software Version': '软件版本号',
        'Enable Passphrase': '开启密码短语',
        'Disabled Passphrase': '关闭密码短语',
        'Switch Fiat Unit': '切换法币单位'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.setting-wrap {
  background: #fff;
  width: auto;
  max-width: 960px;
  margin: 20px auto;
}
</style>
