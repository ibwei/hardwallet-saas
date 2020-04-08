<template>
  <v-app>
    <v-app-bar app color="blue lighten-3">
      <v-toolbar-title>{{ $t('Initialize Device') }}</v-toolbar-title>
      <v-spacer />
      <div
        class="d-flex flex-row justify-center align-center pa-2 ma-2 pl-4 pr-4 blue lighten-5"
        style="border-radius:20px; min-width:150px"
      >
        <div class="body-2">{{ $t('New ABCKEY Device') }}</div>
        <i class="icon pl-2">&#xe606;</i>
      </div>
    </v-app-bar>
    <v-content>
      <v-container fluid>
        <div class="d-flex justify-center mt-15">
          <div>
            <v-card class="mx-auto" min-width="344" min-height="185" color="teal lighten-5">
              <v-card-text>
                <p class="headline text--primary">{{ $t('Create a new wallet') }}</p>
                <div class="text--primary">
                  {{ $t('New to ABCKEY? No worries!') }}
                  <br />{{ $t('Easy to configure and Enjoy now! ') }}
                </div>
              </v-card-text>
              <v-divider />
              <v-card-actions class="d-flex justify-end">
                <v-btn color="success" @click="m_resetDevice()">{{ $t('Create') }}</v-btn>
              </v-card-actions>
            </v-card>
          </div>
          <div class="ml-5">
            <v-card class="mx-auto" min-width="344" min-height="185">
              <v-card-text>
                <p class="headline text--primary">{{ $t('Recover an existing wallet') }}</p>
                <div class="text--primary">
                  {{ $t('I already have a wallet!') }}
                  <br />{{ $t('Recover existing wallet using mnemonic words!') }}
                </div>
              </v-card-text>
              <v-divider />
              <v-card-actions class="d-flex justify-end">
                <v-btn color="primary" @click="m_recoveryDevice()">{{ $t('Recover') }}</v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </div>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import MixUsb from '@/mixins/usb'
export default {
  mixins: [MixUsb],
  i18n: {
    messages: {
      zhCN: {
        'Create a new wallet': '创建新钱包',
        Create: '创建钱包',
        Recover: '恢复钱包',
        'New ABCKEY Device': '新的ABCKEY设备',
        'Recover an existing wallet': '恢复钱包',
        'New to ABCKEY? No worries!': '刚接触ABCKEY？ 别担心！',
        'Your new wallet will be ready to use in just a moment.': '轻松配置，即刻享用',
        'I already have a wallet!.': '我已经拥有钱包！',
        'Recover existing wallet using mnemonic words!': '使用助记词恢复现有钱包'
      }
    }
  }
}
</script>
