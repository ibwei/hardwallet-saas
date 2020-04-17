<template>
  <div class="receive-wrap">
    <div class="qr" v-show="this.d_selectedId > -1">
      <div id="qrcode"></div>
      <div class>{{ `m/${this.c_protocol}'/${this.c_coinInfo.slip44}'/0'/0/${this.d_selectedId}` }}</div>
    </div>
    <v-snackbar v-model="d_alertShow" top>{{ d_errorText }}</v-snackbar>
    <v-overlay v-model="d_overlay"></v-overlay>
    <v-card>
      <v-tabs v-model="d_tab" class="pa-6 pb-3">
        <v-tab>{{ $t('New Address') }}</v-tab>
      </v-tabs>
      <v-tabs-items v-model="d_tab">
        <v-tab-item>
          <v-card flat class="pa-6 pt-0 d-flex flex-column justify-start">
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">{{ $t('Index') }}</th>
                    <th class="text-left">{{ $t('Address') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(address, index) in d_addressList" :key="index" @click="clickAddress(index, $event)" style="position:relative;">
                    <td class="text-left">{{ address.index }}</td>
                    <td class="text-left d-flex flex-row justify-start align-center" style="cursor:pointer">
                      <span class="s-address caption pl-2 pr-2" :class="d_selectedId === index ? 'highlight' : ''">
                        <i class="icon mr-2" style="font-size:18px;" v-html="d_selectedId === index ? '&#xe804;' : '&#xe9cf;'" @click="copyAddress(index)"></i>
                        <span v-text="d_selectedId === index ? address.newAddress : address.hideAddress"></span>
                      </span>
                    </td>
                    <div v-if="d_selectedId === index">
                      <span class="pa-1 caption highlight-2">{{ $t('Please check the address in your device') }}</span>
                    </div>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <v-divider></v-divider>
            <span class="d-flex mt-4 ml-2 mr-2 body-2 text-start">{{ $t('PS: For the ETH currency, only fixed address collection is currently supported. In subsequent versions, we will support obtaining multiple address collections.') }}</span>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat class="pa-6 pt-0">
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">{{ $t('Index') }}</th>
                    <th class="text-left">{{ $t('Address') }}</th>
                    <th class="text-left">{{ $t('Total Receive') }}</th>
                  </tr>
                </thead>
                <tbody v-if="d_receiveList.length">
                  <tr v-for="(address, index) in d_receiveList" :key="index">
                    <td class="text-left">{{ index }}</td>
                    <td class="text-left d-flex flex-row justify-start align-center">
                      <span class="old-address body-2 pl-2 pr-2">{{ address.name }}</span>
                    </td>
                    <td class="text-left">
                      <span class="old-address body-2 pl-2 pr-2">{{ receiveCoin(address.totalReceived) }}</span>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <div v-if="!d_receiveList.length" class="d-flex justify-center align-center body-2 mt-4 grey--text">{{ $t('No Record') }}</div>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import { mapState } from 'vuex'
import { getMousePos, copyText } from '@/utils/common'
import UsbMixin from '@/mixins/usb'
export default {
  name: 'Receive',
  mixins: [UsbMixin],
  data() {
    return {
      d_maxReceiveAddress: 20,
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
    ...mapState(['usb', 'pageLoading']),
    c_coinInfo: vm => vm.$store.__s('coinInfo'),
    c_chooseType: vm => vm.$store.__s('dialog.chooseType'),
    c_protocol() {
      if (Reflect.has(this.c_coinInfo.bip, '49')) {
        return 49
      } else {
        return 44
      }
    }
  },
  created() {
    this.getAddr()
  },
  watch: {
    c_chooseType(newV) {
      if (newV) {
        this._hideOverlay()
      }
    }
  },
  methods: {
    clickAddress(index, e) {
      if (this.d_overlay) {
      } else {
        this._showOverlay(index, e)
      }
    },
    async _showOverlay(index, e) {
      this.d_selectedId = index
      this._qrcode(this.d_addressList[this.d_selectedId].newAddress)
      const coordinate = getMousePos(e)
      this.d_overlay = true
      document.getElementsByClassName('qr')[0].style.top = coordinate.y - 60 + 'px'
      console.log(this.c_protocol)

      await this.$usb.cmd('EthereumGetAddress', {
        // coin_name: this.c_coinInfo.name,
        address_n: [(44 | 0x80000000) >>> 0, (60 | 0x80000000) >>> 0, (0 | 0x80000000) >>> 0, 0, 0],
        // script_type: this.c_protocol === 49 ? 'SPENDP2SHWITNESS' : 'SPENDADDRESS',
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
    copyAddress() {
      if (!this.d_overlay) {
        return
      }
      try {
        copyText(this.d_addressList[this.d_selectedId].newAddress)
        this.showAlert(this.$t('Address has been copied to clipboard'))
      } catch {
        this.showAlert(this.$t('Copy failed!'))
      }
    },
    async getAddr() {
      if (this.d_addressList.length > this.d_maxReceiveAddress) {
        this.showAlert(this.$t('Payment address cannot exceed 20 Each'))
        this.$store.__s('pageLoading', false)
        return
      }
      try {
        const result = await this.$usb.cmd('EthereumGetAddress', {
          // coin_name: this.c_coinInfo.name,
          address_n: [(44 | 0x80000000) >>> 0, (60 | 0x80000000) >>> 0, (0 | 0x80000000) >>> 0, 0, 0],
          // script_type: this.c_protocol === 49 ? 'SPENDP2SHWITNESS' : 'SPENDADDRESS',
          show_display: false
        })
        this.d_currentAddress = result.data.address
        // const r = await Axios.get(`https://api.abckey.com/${this.coinInfo.symbol}/address/${this.d_currentAddress}?page=1&pageSize=1000&details=tokenBalances`)
        // const r = await Axios.get(`https://api.abckey.com/${this.coinInfo.symbol}/address/${this.d_currentAddress}?page=1&pageSize=1000&details=basic`)
        // console.log('r', r)
        const len = this.d_currentAddress.length
        const hideAddress = this.d_currentAddress.slice(0, 4) + new Array(len - 8).fill('#').join('') + this.d_currentAddress.slice(len - 8 + 4)
        const newAddress = {
          index: this.d_currentInex++,
          newAddress: this.d_currentAddress,
          hideAddress
        }
        this.d_addressList.push(newAddress)
      } catch (e) {
        console.log(e)
        this.showAlert(this.$t('Get device address error'))
      }
    },
    showAlert(content) {
      this.d_alertShow = true
      this.d_errorText = content
      setTimeout(() => {
        this.d_alertShow = false
      }, 2000)
    }
  },
  i18n: {
    messages: {
      zhCN: {
        'PS: For the ETH currency, only fixed address collection is currently supported. In subsequent versions, we will support obtaining multiple address collections.': '备注：针对ETH币种，当前仅支持固定地址收款，后续版本我们将支持获取多个地址收款。',
        'Copy failed!': '复制失败',
        'Payment address cannot exceed 20 Each': '收款地址不能超过20个',
        'Address has been copied to clipboard': '地址已经复制到剪贴板',
        'New Address': '新地址',
        'Old Address': '旧地址',
        Index: '索引',
        Address: '地址',
        'More Address': '更多地址',
        'Total Receive': '累积接收',
        'No Record': '暂无记录',
        'Get device address error': '获取设备地址错误',
        'Please check the address in your device': '请在设备上核对地址'
      }
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
  width: 380px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  border: 1px dashed rgba(0, 0, 0, 0.2);
}
.old-address {
  color: rgba(0, 0, 0, 0.6);
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
  left: -250px;
  border-radius: 4px;
  top: -10px;
  width: 260px;
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
