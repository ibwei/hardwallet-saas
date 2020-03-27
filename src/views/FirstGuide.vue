<template>
  <v-app>
    <v-app-bar app color="blue lighten-3">
      <v-toolbar-title>初始化设备</v-toolbar-title>
      <v-spacer />
      <div
        class="d-flex flex-row justify-center align-center pa-2 ma-2 pl-4 pr-4 blue lighten-5"
        style="border-radius:20px; min-width:150px"
      >
        <div class="body-2">新的ABCKEY设备</div>
        <i class="icon pl-2">&#xe606;</i>
      </div>
    </v-app-bar>
    <v-content>
      <v-container fluid>
        <div class="display-1 text--primary mb-5">初始化设备</div>
        <div class="d-flex justify-center mt-15">
          <div>
            <v-card class="mx-auto" min-width="344" min-height="185" color="teal lighten-5">
              <v-card-text>
                <p class="headline text--primary">创建新钱包</p>
                <div class="text--primary">
                  刚接触ABCKEY？ 别担心！
                  <br />轻松配置，即刻享用
                </div>
              </v-card-text>
              <v-divider />
              <v-card-actions class="d-flex justify-end">
                <v-btn color="success" @click="m_resetDevice()">创建钱包</v-btn>
              </v-card-actions>
            </v-card>
          </div>
          <div class="ml-5">
            <v-card class="mx-auto" min-width="344" min-height="185">
              <v-card-text>
                <p class="headline text--primary">恢复钱包</p>
                <div class="text--primary">
                  我已经拥有钱包！
                  <br />使用助记词恢复现有钱包
                </div>
              </v-card-text>
              <v-divider />
              <v-card-actions class="d-flex justify-end">
                <v-btn color="primary" @click="m_recoveryDevice()">恢复钱包</v-btn>
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
  computed: {
    c_msg: vm => vm.$store.__s('usb.msg')
  },
  watch: {
    c_msg(msg) {
      if (msg.data.message === 'Device successfully initialized') {
        this.$router.push({ path: '/wallet/account' })
        this.$store.__s('usb.initialized', true)
      }
    }
  }
}
</script>
