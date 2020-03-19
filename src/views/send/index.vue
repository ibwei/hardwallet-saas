<template>
  <div>
    <div class="qr" v-show="this.d_selectedId > -1">
      <div id="qrcode"></div>
    </div>
    <v-snackbar v-model="d_snackbar" top>
      地址已经复制到剪贴板
    </v-snackbar>
    <v-overlay v-model="d_overlay"> </v-overlay>
    <v-card>
      <v-tabs v-model="d_tab" class="pa-6 pb-3">
        <v-tab>新地址</v-tab>
        <v-tab>旧地址</v-tab>
      </v-tabs>
      <v-tabs-items v-model="d_tab">
        <v-tab-item>
          <v-card flat class="pa-6 pt-0 d-flex flex-column justify-start">
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">索引</th>
                    <th class="text-left">地址</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(address, index) in d_addressList" :key="index" @click="m_clickAddress(index)" style="position:relative;">
                    <td class="text-left">{{ index }}</td>
                    <td class="text-left d-flex flex-row justify-start align-center" style="cursor:pointer">
                      <span class="s-address caption pl-2 pr-2" :class="d_selectedId === index ? 'highlight' : ''">
                        <i class="icon" style="font-size:12px;" v-html="d_selectedId === index ? '&#xe804;' : '&#xe9cf;'" @click="m_copyAddress(index)"></i>
                        {{ address }}
                      </span>
                    </td>
                    <div v-if="d_selectedId === index">
                      <span class="pa-1 caption highlight-2">请在设备上核对地址</span>
                    </div>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <v-btn small class="blue lighten-1 white--text d-flex mt-4" style="width:100px;" @click="m_addAddress">
              <i class="icon" style="font-size:20px;">&#xe612;</i>
              <span>更多地址</span>
            </v-btn>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat class="pa-6 pt-0">
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">索引</th>
                    <th class="text-left">地址</th>
                    <th class="text-left">累计接受</th>
                  </tr>
                </thead>
                <tbody v-if="d_receiveList.length">
                  <tr v-for="(address, index) in d_receiveList" :key="index">
                    <td class="text-left">{{ index }}</td>
                    <td class="text-left d-flex flex-row justify-start align-center">
                      <span class="s-address body-2 pl-2 pr-2">{{ address }}</span>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <div v-if="!d_receiveList.length" class="d-flex justify-center align-center body-2 mt-4 grey--text">No Record</div>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
    <div @click="m_getPublickKey">fsdfds</div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
export default {
  name: 'Send',
  data() {
    return {
      d_tab: null,
      d_overlay: false,
      d_snackbar: false,
      d_receiveList: [],
      d_selectedId: -1,
      d_addressList: ['3323kpuDSksfSWOMQSKsfkj'],
      d_path: `m/49'/0'/0'/0/0`,
      d_scriptType: 'SPENDP2SHWITNESS',
      d_showDisplay: false
    }
  },
  computed: {
    c_addressN() {
      const address_n = []
      const path = this.d_path.match(/\/[0-9]+('|H)?/g)
      for (const item of path) {
        let id = parseInt(item.match(/[0-9]+/g)[0])
        if (item.match(/('|H)/g)) id = (id | 0x80000000) >>> 0
        address_n.push(id)
      }
      return address_n
    }
  },
  methods: {
    m_addAddress() {
      const newAddress = '3323kpuDSksfSWOMQSKsfkj'
      this.d_addressList.push(newAddress)
    },
    m_clickAddress(index) {
      if (this.d_overlay) {
      } else {
        this._showOverlay(index)
      }
    },
    _showOverlay(index) {
      this.d_overlay = true
      this.d_selectedId = index
      this._qrcode(this.d_addressList[this.d_selectedId])
    },
    _hideOverlay() {
      this.d_selectedId = -1
      this.d_overlay = false
    },
    _qrcode(address) {
      document.getElementById('qrcode').innerHTML = ''
      const qr = new QRCode('qrcode', {
        width: 132,
        height: 132,
        text: address,
        colorDark: '#000',
        colorLight: '#fff'
      })
      console.log(qr)
    },
    m_copyAddress(index) {
      if (!this.d_overlay) {
        return
      }
      const oInput = document.createElement('input')
      oInput.value = this.d_addressList[index]
      document.body.appendChild(oInput)
      oInput.select()
      document.execCommand('Copy')
      oInput.className = 'oInput'
      oInput.style.display = 'none'
      this.d_snackbar = true
    },
    async m_getPublickKey() {
      if (!this.c_addressN) return (this.d_response = 'path error')
      const proto = {
        address_n: this.c_addressN,
        script_type: this.d_scriptType,
        show_display: this.d_showDisplay
      }
      const result = await this.$usb.cmd('GetPublicKey', proto)
      result.data.node.chain_code = Buffer.from(result.data.node.chain_code, 'base64').toString('hex')
      result.data.node.public_key = Buffer.from(result.data.node.public_key, 'base64').toString('hex')
      const response = JSON.stringify(result, null, 4)
      console.log(response)
    }
  }
}
</script>

<style lang="scss" scoped>
.s-address {
  text-align: left;
  color: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  border: 1px dashed rgba(0, 0, 0, 0.2);
}
.highlight {
  position: relative;
  z-index: 999;
  border: 1px dashed #f00;
  background: #fff;
  color: #f00;
}
.highlight-2 {
  position: relative;
  z-index: 999;
  left: -270px;
  border-radius: 4px;
  top: -10px;
  background: #000;
  color: #fff;
}
#qrcode {
  display: inline-block;
  img {
    width: 132px;
    height: 132px;
  }
}
.qr {
  position: fixed;
  z-index: 99999;
  padding: 6px;
  background: #fff;
  right: 20%;
  top: 30%;
}
</style>
