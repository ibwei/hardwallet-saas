<template>
  <div class="receive-wrap">
    <div class="qr" v-show="this.d_selectedId > -1">
      <div id="qrcode"></div>
    </div>
    <v-snackbar v-model="d_alertShow" top>{{ d_errorText }}</v-snackbar>
    <v-overlay v-model="d_overlay"></v-overlay>
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
                  <tr v-for="(address, index) in d_addressList" :key="index" @click="m_clickAddress(index, $event)" style="position:relative;">
                    <td class="text-left">{{ address.index }}</td>
                    <td class="text-left d-flex flex-row justify-start align-center" style="cursor:pointer">
                      <span class="s-address caption pl-2 pr-2" :class="d_selectedId === index ? 'highlight' : ''">
                        <i class="icon" style="font-size:12px;" v-html="d_selectedId === index ? '&#xe804;' : '&#xe9cf;'" @click="m_copyAddress(index)"></i>
                        <span v-text="d_selectedId === index ? address.newAddress : address.hideAddress"></span>
                      </span>
                    </td>
                    <div v-if="d_selectedId === index">
                      <span class="pa-1 caption highlight-2">请在设备上核对地址</span>
                    </div>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <v-btn small class="blue lighten-1 white--text d-flex mt-4" style="width:100px;" @click="m_getAddr">
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
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import Axios from 'axios'
import { mapState } from 'vuex'
import { getMousePos } from '@/utils/common'
import { StaticConfig } from '@/config'
export default {
  name: 'Receive',
  data() {
    return {
      d_tab: null,
      d_overlay: false,
      d_snackbar: false,
      d_receiveList: [],
      d_addressList: [],
      d_selectedId: -1,
      d_currentInex: 0,
      d_currentAddress: '0',
      d_alertShow: false,
      d_errorText: ''
    }
  },
  computed: {
    ...mapState(['xpub', 'usb'])
  },
  created() {
    this.m_getUsedTokens()
  },
  methods: {
    m_clickAddress(index, e) {
      if (this.d_overlay) {
      } else {
        this._showOverlay(index, e)
      }
    },
    async _showOverlay(index, e) {
      this.d_selectedId = index
      this._qrcode(this.d_addressList[this.d_selectedId])
      const coordinate = getMousePos(e)
      this.d_overlay = true
      document.getElementsByClassName('qr')[0].style.top = coordinate.y - 60 + 'px'
      await this.$usb.getAddr({
        address_n: [(49 | 0x80000000) >>> 0, (0 | 0x80000000) >>> 0, (0 | 0x80000000) >>> 0, 0, this.d_addressList[this.d_selectedId].index],
        script_type: 'SPENDP2SHWITNESS',
        show_display: true
      })
      this._hideOverlay()
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
      this.m_showAlert('地址已经复制到剪贴板')
    },
    async m_getUsedTokens() {
      /*  const result = await Axios.get(`https://btc.abckey.com/xpub/${this.xpub}?details=txs&tokens=used&t=${new Date().getTime()}`)
      this.d_currentInex = result.usedTokens ? result.usedTokens : '0'
      if (this.d_currentInex === '0') {
        // this.m_showAlert('获取地址出错')
        return
      } */
      this.d_currentAddress = 85
      this.m_getAddr()
    },
    async m_getAddr() {
      if (this.d_addressList.length > StaticConfig.maxReceiveAddress) {
        this.m_showAlert(`收款地址不能超过${StaticConfig.maxReceiveAddress}个`)
        return
      }
      try {
        const result = await this.$usb.getAddr({
          address_n: [(49 | 0x80000000) >>> 0, (0 | 0x80000000) >>> 0, (0 | 0x80000000) >>> 0, 0, this.d_currentInex],
          script_type: 'SPENDP2SHWITNESS',
          show_display: false
        })
        this.d_currentAddress = result.data.address
        const len = this.d_currentAddress.length
        const hideAddress = this.d_currentAddress.slice(0, 4) + new Array(len - 8).fill('#').join('') + this.d_currentAddress.slice(len - 8 + 4)
        const newAddress = {
          index: this.d_currentInex++,
          newAddress: this.d_currentAddress,
          hideAddress
        }
        this.d_addressList.push(newAddress)
      } catch {
        this.m_showAlert('获取设备地址错误')
      }
    },
    m_showAlert(content) {
      this.d_alertShow = true
      this.d_errorText = content
      setTimeout(() => {
        this.d_alertShow = false
      }, 2000)
    }
  }
}
</script>

<style lang="scss" scoped>
.receive-wrap {
  width: 960px;
  margin: 20px auto;
}
.s-address {
  width: 300px;
  text-align: center;
  color: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  border: 1px dashed rgba(0, 0, 0, 0.2);
}
.highlight {
  position: relative;
  z-index: 99999;
  border: 1px dashed #f00;
  background: #fff;
  color: #f00;
}
.highlight-2 {
  position: relative;
  z-index: 99999;
  left: -290px;
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
