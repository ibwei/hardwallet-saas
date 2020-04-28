<template>
  <v-container class="pa-0 send-wrap" fluid>
    <broadcast-dialog :show="d_bordercastShow" @close-dialog="closeBordercast" @error-broadcast="errorBroadcast" :signHash="d_signHash" />
    <broadcast-success :show="d_snackbar" :transactionHash="d_transactionHash" :coinType="c_coinInfo.symbol" @close="d_snackbar = false" />
    <broadcast-error :show="d_error" :reason="this.d_errorReason" @update-nonce="updateNonce" @close="d_error = false" />
    <v-card class="pa-3">
      <div class="table">
        <div class="table-header px-3 app-secondary-bg">
          <div class="table-c address-c subtitle-2">{{ $t('Address') }}</div>
          <div class="table-c amount-c subtitle-2">{{ $t('Amount') }}</div>
          <div class="table-c action-c subtitle-2">{{ $t('Delete') }}</div>
        </div>
        <div class="table-body">
          <div class="table-r px-3" v-for="(item, index) in d_txOut" :key="index">
            <div class="table-c address-c subtitle-2">
              <v-text-field v-model="item.address" :rules="d_addressRules" :label="$t('Address')" :hint="$t('Please input address')">
                <v-tooltip top slot="append">
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on" color="primary" size="16" @click="paste(item)">mdi-content-paste</v-icon>
                  </template>
                  <span class="subtitle-2">{{ $t('Paste') }}</span>
                </v-tooltip>
              </v-text-field>
            </div>
            <div class="table-c amount-c">
              <v-text-field v-model="item.amount" :rules="d_amountRules" :label="$t('Amount')" :hint="$t('Please input amount')" @input="showAllIcon">
                <div slot="append" class="primary--text">{{ c_coinInfo.symbol.toUpperCase() }}</div>
              </v-text-field>
              <v-tooltip top v-if="!d_clickAll">
                <template v-slot:activator="{ on }">
                  <v-icon class="ml-4" @click="sendAllBalance(index)" v-on="on">mdi-publish</v-icon>
                </template>
                <span>{{ $t('All Balances') }}</span>
              </v-tooltip>
            </div>
            <div class="table-c action-c">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-icon class="close-icon" v-on="on" :disabled="d_txOut.length <= 1" @click="delTxOut(index)">mdi-close</v-icon>
                </template>
                <span>{{ $t('Delete') }}</span>
              </v-tooltip>
            </div>
          </div>
        </div>
      </div>
      <div class="form">
        <div class="d-flex flex-column justify-start align-start pl-2">
          <div class="subtitle-2" :class="c_utxoTotal.toString(10) !== '0' ? 'primary--text' : 'red--text'">Ethereum {{ $t('Available Balance') }}：{{ UnitHelper(c_utxoTotal, 'wei_eth').toString(10) }} ETH</div>
          <div class="subtitle-2" :class="eth.balance.toString(10) !== '0' ? 'primary--text' : 'red--text'">
            USDT {{ $t('Available Balance') }}：{{
              UnitHelper(eth.balance)
                .div(1000000)
                .toString(10)
            }}
            USDT
          </div>
        </div>

        <div class="right body-2">
          <v-chip outlined class="chip body-2"
            >{{ $t('Amounts') }}
            {{ UnitHelper(c_totalAmounts, 'wei_eth').toString(10) }}
            {{ c_coinInfo.symbol.toUpperCase() }}</v-chip
          >
          <v-chip outlined class="chip body-2"
            >{{ $t('Fees') }}
            {{ UnitHelper(c_totalFees, 'wei_eth').toString(10) }}
            ETH
          </v-chip>
          <v-chip outlined color="primary" class="chip">{{ $t('Total') }} {{ d_txOut[0].amount }} USDT + {{ UnitHelper(c_totalFees, 'wei_eth').toString(10) }} ETH</v-chip>
        </div>
      </div>
      <div class="d-flex flex-row justify-end align-center">
        <v-row>
          <v-col cols="9">
            <div class="subtitle-2 text-left mb-4">{{ $t('Transaction Fee') }}</div>
            <v-slider thumb-label v-model="d_zoom" ticks="always" persistent-hint :max="d_fastest" :min="d_safeLow">
              <template v-slot:prepend>
                <span class="subtitle-2" @click="zoomOut">{{ $t('Low') }}</span>
              </template>
              <template v-slot:append>
                <span @click="zoomIn" class="subtitle-2">{{ $t('High') }}</span>
              </template>
            </v-slider>
          </v-col>
          <v-col cols="3" class="text-sm-right pa-0 mt-3">
            <v-btn color="success" rounded @click="checkAndSend()">{{ $t('Check and send') }}</v-btn>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import Axios from 'axios'
import clipboard from 'clipboard-polyfill'
import UnitHelper from '@abckey/unit-helper'
import AddressHelper from '@abckey/address-helper'
import ETH from '@/mixins/eth'
export default {
  name: 'Send',
  mixins: [ETH],
  data() {
    return {
      d_error: false,
      d_errorReason: '',
      d_media: 0,
      d_alarm: 0,
      d_zoom: 5,
      d_safeLow: '5',
      d_average: '8',
      d_fast: '13',
      d_fastest: '20',
      d_transactionHash: '0x21e40e3aa5727f918159018b329f141b75100719079cfaf2e8a095f9a112a8c0',
      d_snackbar: false,
      // d_gasUrl: 'https://ethgasstation.info/api/ethgasAPI.json?api-key=1f1087b62ec4dc2e2f80a991426c26f9380b2a8d25821836da5bb65ed8ce',
      d_gasUrl: 'https://api.abckey.com/fees/eth',
      d_gasLimit: '88888',
      d_utxoList: [],
      d_maxPaidIndex: 0,
      UnitHelper,
      d_clickAll: false,
      d_extraFee: 0,
      d_signHash: '',
      d_bordercastShow: false,
      d_txOut: [
        {
          address: '',
          amount: 0
        }
      ],
      d_addressRules: [value => AddressHelper.test(value, 'eth') || this.$t('Invalid address')],
      d_amountRules: [
        value => {
          const pattern = /^[+]{0,1}[1-9]\d*$|^[+]{0,1}(0\.\d*[1-9])$|^[+]{0,1}([1-9]\d*\.\d*[0-9])$/
          return pattern.test(value) || this.$t('Invalid amount')
        }
      ],
      d_feeHelpList: {}
    }
  },
  computed: {
    c_totalAmounts() {
      if (this.d_txOut.length > 0) {
        return UnitHelper(this.d_txOut[0].amount, 'eth_wei')
      }
      return UnitHelper(0)
    },
    c_utxoTotal() {
      if (this.d_utxoList.length > 0) {
        return UnitHelper(this.d_utxoList[0].amount)
      }
      return UnitHelper(0)
    },
    c_totalFees() {
      const fee = UnitHelper(this.d_zoom).times(this.d_gasLimit)
      return UnitHelper(fee, 'gwei_wei')
    },
    c_xpub: vm => vm.$store.__s('usb.xpub'),
    c_coinInfo: vm => vm.$store.__s('coinInfo'),
    c_coinProtocol: vm => vm.$store.__s('coinProtocol'),
    c_pageLoading: vm => vm.$store.__s('pageLoading'),
    c_usb: vm => vm.$store.__s('usb'),
    eth: vm => vm.$store.__s('eth')
  },
  created() {
    this.$nextTick(() => {
      this.setDefaultGasLimit()
      this.getUtxoList()
      this.getFeeRate()
    })
  },
  methods: {
    setDefaultGasLimit() {
      const len = this.d_txOut.length
      if (len > 3) {
        this.d_gasLimit = UnitHelper(len)
          .minus(3)
          .times(60000)
          .plus(88888)
          .toString(10)
      } else {
        this.d_gasLimit = '88888'
      }
    },
    zoomOut() {
      this.d_zoom = this.d_safeLow
    },
    zoomIn() {
      this.d_zoom = this.d_fastest
    },
    showAllIcon() {
      this.d_clickAll = false
    },
    sendAllBalance() {
      this.d_txOut[0].amount = UnitHelper(this.eth.balance)
        .div(1000000)
        .toString(10)
      if (this.c_utxoTotal.toNumber() === 0) {
        this.$message.error(this.$t('Balance is empty!'))
        return
      }
      this.d_clickAll = true
    },
    /**
     *  @method - get fee satoshi/byte from internet
     */
    async getFeeRate() {
      const result = await Axios.get(this.d_gasUrl)
      if (result.status !== 200) {
        return
      }
      this.d_safeLow = Math.floor(result.data.safeLow / 10)
      this.d_average = Math.floor(result.data.average / 10)
      this.d_fast = Math.floor(result.data.fast / 10)
      this.d_fastest = Math.floor(result.data.fastest / 10)
      this.d_zoom = parseInt(this.d_average)
    },
    async getUtxoList() {
      const address = await this.ethGetAddress()
      const result = await Axios.get(`https://api.abckey.com/eth/address/${address}?details=basic`)
      if (result.status === 200 && !result.error) {
        this.d_utxoList.push({ amount: result?.data?.balance ? result?.data?.balance : 0, address: result?.data?.address, nonce: result.data.nonce })
      } else {
        this.$message.error(this.$t('The network breakdown!'))
      }
    },
    async updateNonce() {
      this.d_utxoList = []
      this.$store.__s('pageLoading', true)
      this.d_error = false
      this.d_bordercastShow = false
      await this.getUtxoList()
      this.$store.__s('pageLoading', false)
      this.$message.success(this.$t('Update nonce successfully!'))
    },
    /**
     *  @method - get fee satoshi/byte from internet
     */
    checkTxOutRules() {
      // start check the the output list
      const pattern = /^[+]{0,1}[1-9]\d*$|^[+]{0,1}(0\.\d*[1-9])$|^[+]{0,1}([1-9]\d*\.\d*[0-9])$/
      const len = this.d_txOut.length
      for (let i = 0; i < len; i++) {
        const output = this.d_txOut[i]
        if (!pattern.test(output.amount) || !output.amount) {
          this.$message.error(this.$t('Please enter a valid quantity'))
          return false
        }
        if (!AddressHelper.test(output.address, 'eth')) {
          this.$message.error(this.$t('Please enter a valid Address'))
          return false
        }
      }
      return true
    },
    // check the eth and usdt balance
    checkBalance() {
      // usdt
      if (
        UnitHelper(this.d_txOut[0].amount)
          .times(1000000)
          .gt(this.eth.balance)
      ) {
        this.$message.error(this.$t('Your USDT account balance is insufficient!'))
        return false
      }
      // eth
      if (UnitHelper(this.c_utxoTotal).lt(this.c_totalFees)) {
        this.$message.error(this.$t('Ethereum address does not have sufficient balance!'))
        return false
      }
      return true
    },
    errorBroadcast(error) {
      this.d_error = true
      this.d_errorReason = error
    },
    closeBordercast(type, transactionHash) {
      if (type === 'auto') {
        this.d_snackbar = true
        this.d_transactionHash = transactionHash
      }
      this.d_bordercastShow = false
      this.d_txOut[0].amount = 0
    },
    /**
     * @method - get the input index of utxoList
     */
    getMaxPaidIndex() {
      this.d_maxPaidIndex = 0
    },
    delTxOut(index) {
      if (this.d_txOut.length === 1) {
        this.$message.warning(this.$t("The last one can't be delete!"))
        return
      }
      this.d_txOut.splice(index, 1)
    },
    async paste(item) {
      item.address = await clipboard.readText()
    },
    getAddressN(pathString) {
      const address_n = []
      const path = pathString.match(/\/[0-9]+('|H)?/g)
      for (const item of path) {
        let id = parseInt(item.match(/[0-9]+/g)[0])
        if (item.match(/('|H)/g)) id = (id | 0x80000000) >>> 0
        address_n.push(id)
      }
      return address_n
    },
    /**
     * @method - checkRules and banlance ,then send
     */
    async checkAndSend() {
      this.$store.__s('pageLoading', true)
      if (!this.checkTxOutRules()) {
        this.$store.__s('pageLoading', false)
        return
      }
      if (!this.checkBalance()) {
        this.$store.__s('pageLoading', false)
        return
      }
      try {
        this.getUtxoList()
        await this.signTx()
      } catch (e) {
        this.$message.error(this.$t('Unknown Error!'))
      }
      this.$store.__s('pageLoading', false)
    },

    async signTx() {
      // Organize output data
      const txParams = {
        bip32_path: "m/44'/60'/0'/0/0",
        erc20: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        nonce: this.d_utxoList[0].nonce,
        gas_price: UnitHelper(1, 'gwei_wei')
          .times(this.d_zoom)
          .toString(10),
        gas_limit: this.d_gasLimit,
        to: this.d_txOut[0].address,
        chain_id: 1,
        value: UnitHelper(this.d_txOut[0].amount)
          .times(1000000)
          .toString(10)
      }

      const result = await this.$usb.signETH(txParams)
      if (result?.data?.raw) {
        const serializedTx = result.data.raw
        this.d_signHash = serializedTx
        this.d_bordercastShow = true
      } else {
        this.$message.error(this.$t('Transaction signature failed!'))
      }
    }
  },
  watch: {
    d_txOut: {
      handler() {
        this.getMaxPaidIndex()
      },
      deep: true
    }
  },
  i18n: {
    messages: {
      zhCN: {
        'Ethereum address does not have sufficient balance!': '以太坊地址没有足够的余额',
        'Your USDT account balance is insufficient!': '你的USDT账户余额不足',
        'Balance is empty!': '账户余额为空',
        'Transaction Fee': '交易手续费',
        'All Balances': '发送所有余额',
        'Transaction signature failed': '签名交易失败',
        'Transaction signature success': '签名交易成功',
        'Please enter a valid Address': '请输入有效的地址',
        'The network breakdown!': '网络异常',
        'Please enter a valid quantity': '请输入有效的金额',
        'The available balance is insufficient for payment!': '可用余额不够支付,可能导致签名失败',
        'The amount or address you entered is invalid!': '你输入的金额或者地址无效',
        'If the payment is too fragmentary, additional 0.0001 currency handling fee will be paid': '过于零碎的支付，额外支付0.0001币种手续费',
        Address: '接收地址',
        Amount: '发送金额',
        Delete: '删除',
        Paste: '粘贴',
        Most: '最多',
        'Add recipient': '添加接收者',
        'Check and send': '检查并发送',
        'Are you sure to delete?': '你确定要删除吗?',
        Yes: '是',
        No: '否',
        'Invalid address': '地址无效',
        'Invalid amount': '金额无效',
        'Invalid fee': '费率无效',
        'Please input address': '请输入地址',
        'Please input amount': '请输入金额',
        high: '高',
        middle: '中',
        low: '低',
        Amounts: '发送总额',
        Fees: '手续费',
        Total: '合计',
        Fee: '费率',
        Review: '核对',
        'Unknown Error!': '未知错误',
        'TX Hash': '交易哈希'
      }
    }
  }
}
</script>

<style scoped lang="scss">
.send-wrap {
  max-width: 960px;
  margin: 20px auto;
}
.table {
  margin-bottom: 12px;
  border: 1px solid rgba(44, 115, 210, 0.6);
  .table-header {
    text-transform: capitalize;
  }
  .table-r {
    font-size: 14px;
  }
  .table-header,
  .table-r {
    display: flex;
    min-height: 80px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    .table-c {
      display: flex;
      align-items: center;
      position: relative;
      padding: 0 10px;
      color: #fff;
      &.action-c {
        width: 120px;
        cursor: pointer;
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
      }
      &.address-c {
        flex: 3;
      }
      &.amount-c {
        flex: 1;
        justify-content: flex-start;
        cursor: pointer;
      }
    }
  }
  .close-icon {
    cursor: pointer;
    &:hover {
      color: #ef5350;
    }
  }
  .table-r:hover {
    background-color: #e3f2fd;
  }
}
.form {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  .right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    flex: 1;
    .chip {
      margin-bottom: 5px;
      justify-content: flex-end;
      max-width: fit-content;
    }
  }
}
</style>
