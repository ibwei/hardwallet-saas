<template>
  <v-container class="pa-0 send-wrap" fluid>
    <bordercast :show="d_bordercastShow" v-if="d_bordercastShow" @close-dialog="closeBordercast" :signHash="d_signHash" />
    <v-snackbar v-model="d_snackbar" top color="success" :timeout="0">
      {{ $t('Transaction Hash') }}{{ d_transactionHash }}
      <v-btn color="#fff" text @click="d_snackbar = false">
        {{ $t('Close') }}
      </v-btn>
    </v-snackbar>
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
        <div class="left">
          <v-btn rounded class="plus-btn" color="primary" @click="addRecipient()">
            <v-icon size="16">mdi-plus</v-icon>
            {{ $t('Add recipient') }}
          </v-btn>
        </div>
        <div class="right body-2">
          <v-chip outlined class="chip body-2"
            >{{ $t('Amounts') }}
            {{
              UnitHelper(c_totalAmounts, 'sat_btc')
                .decimalPlaces(8)
                .toString(10)
            }}
            {{ c_coinInfo.symbol.toUpperCase() }}</v-chip
          >
          <v-chip outlined class="chip body-2"
            >{{ $t('Fees') }}
            {{
              UnitHelper(c_totalFees, 'sat_btc')
                .format(8)
                .toString(10)
            }}
            {{ c_coinInfo.symbol.toUpperCase() }}</v-chip
          >
          <v-chip outlined color="primary" class="chip"
            >{{ $t('Total') }}
            {{
              UnitHelper(c_total, 'sat_btc')
                .format(8)
                .toString(10)
            }}
            {{ c_coinInfo.symbol.toUpperCase() }}</v-chip
          >
        </div>
      </div>
      <div class="d-flex flex-row justify-end align-center">
        <v-row justify="center">
          <v-col cols="4" class="offset-5">
            <v-combobox :value="d_fee" :items="d_feeList" :label="$t('Fee')" dense @input="handleFeeInput($event)" :rules="d_feeRule" outlined>
              <div slot="append" class="primary--text">Sat/b</div>
              <template v-slot:item="{ item }">
                <div class="d-flex justify-space-between" style="width: 100%">
                  <span>{{ d_feeHelpList[item].text }}:</span>
                  <span>{{ item }} Sat/b</span>
                </div>
              </template>
            </v-combobox>
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
import BN from 'bignumber.js'
import UnitHelper from '@abckey/unit-helper'
import AddressHelper from '@abckey/address-helper'
import Bordercast from './components/Bordercast'
export default {
  name: 'Send',
  components: {
    Bordercast
  },
  data() {
    return {
      d_transactionHash: '',
      d_snackbar: false,
      d_feeUrl: 'https://bitcoinfees.earn.com/api/v1/fees/recommended',
      d_utxoList: [],
      d_maxPaidIndex: 0,
      d_needFee: false,
      d_endUtxo: false,
      UnitHelper,
      d_clickAll: false,
      d_extraFee: 0,
      d_signHash: '',
      d_bordercastShow: false,
      d_txOut: [
        {
          address: '',
          amount: '0'
        }
      ],
      d_addressRules: [value => AddressHelper.test(value, this.c_coinInfo.symbol) || this.$t('Invalid address')],
      d_amountRules: [
        value => {
          const pattern = /^[+]{0,1}[1-9]\d*$|^[+]{0,1}(0\.\d*[1-9])$|^[+]{0,1}([1-9]\d*\.\d*[0-9])$/
          return pattern.test(value) || this.$t('Invalid amount')
        }
      ],
      d_fee: '4',
      d_feeRule: [
        fee => {
          const pattern = /^[1-9][0-9]?/
          return pattern.test(fee) ? true : this.$t('Invalid fee')
        }
      ],
      d_feeList: [19, 15, 1],
      d_feeHelpList: {}
    }
  },
  computed: {
    c_totalAmounts() {
      let sum = BN('0')
      for (const key in this.d_txOut) {
        sum = sum.plus(this.d_txOut[key].amount)
      }
      return sum.times(100000000)
    },
    c_utxoTotal() {
      let sum = BN('0')
      const len = this.d_utxoList.length
      for (let i = 0; i < len; i++) {
        sum = sum.plus(this.d_utxoList[i].value)
      }
      return sum
    },
    c_totalFees() {
      const sizeIn = BN(this.d_maxPaidIndex + 1).times(148)
      const sizeOut = BN(this.d_txOut.length).times(34)
      const sat = BN(sizeIn)
        .plus(sizeOut)
        .plus(10)
        .times(this.d_fee)
      return sat.plus(this.d_extraFee)
    },
    c_total: vm => vm.c_totalAmounts.plus(vm.c_totalFees),
    c_xpub: vm => vm.$store.__s('usb.xpub'),
    c_coinInfo: vm => vm.$store.__s('coinInfo'),
    c_coinProtocol: vm => vm.$store.__s('coinProtocol'),
    c_pageLoading: vm => vm.$store.__s('pageLoading'),
    c_usb: vm => vm.$store.__s('usb')
  },
  created() {
    this.$nextTick(() => {
      this.getUtxoList()
      this.getFeePerSatoshis()
    })
  },
  methods: {
    showAllIcon() {
      this.d_clickAll = false
    },
    sendAllBalance(index) {
      let preListCount = BN('0')
      for (let i = 0; i < this.d_txOut.length; i++) {
        if (index !== i) {
          preListCount = preListCount.plus(this.d_txOut[i].amount)
        }
      }
      preListCount = preListCount.times(100000000)
      console.log('prelistcount', preListCount)
      this.d_maxPaidIndex = this.d_utxoList.length - 1
      this.d_txOut.splice(index, 1, { ...this.d_txOut[index], amount: UnitHelper(this.c_utxoTotal.minus(this.c_totalFees.plus(preListCount)).toNumber(), 'sat_btc') })
      this.d_clickAll = true
    },
    /**
     *  @method - get fee satoshi/byte from internet
     */
    async getFeePerSatoshis() {
      const result = await Axios.get(this.d_feeUrl)
      if (result.status !== 200) {
        return
      }
      if (!result?.data?.fastestFee) {
        return
      }
      if (result.data.fastestFee === result.data.halfHourFee) {
        result.data.halfHourFee--
      }
      this.d_feeList = [result.data.fastestFee, result.data.halfHourFee, result.data.hourFee]
      this.d_fee = this.d_feeList[0]
      for (let i = 0; i < 3; i++) {
        if (i === 0) {
          this.d_feeHelpList[this.d_feeList[i]] = {
            text: this.$t('high')
          }
        } else if (i === 1) {
          this.d_feeHelpList[this.d_feeList[i]] = {
            text: this.$t('middle')
          }
        } else {
          this.d_feeHelpList[this.d_feeList[i]] = {
            text: this.$t('low')
          }
        }
      }
    },
    async getUtxoList() {
      const result = await Axios.get(`https://api.abckey.com/${this.c_coinInfo.symbol}/utxo/${this.c_xpub}?confirme=true`)
      if (result.status === 200) {
        this.d_utxoList = result.data
      } else {
        this.$message.error(this.$t('The network breakdown!'))
      }
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
        if (!AddressHelper.test(output.address, this.c_coinInfo.symbol)) {
          this.$message.error(this.$t('Please enter a valid Address'))
          return false
        }
      }
      return true
    },
    closeBordercast(type, transactionHash) {
      if (type === 'auto') {
        this.d_snackbar = true
        this.d_transactionHash = transactionHash
      }
      this.d_bordercastShow = false
      this.d_txOut = [
        {
          amount: '',
          address: ''
        }
      ]
    },
    /**
     * @method - get the input index of utxoList
     */

    getMaxPaidIndex() {
      let sum = BN('0')
      const len = this.d_utxoList.length
      let i = 0
      for (; i < len; i++) {
        sum = sum.plus(this.d_utxoList[i].value)
        if (sum.gte(this.c_totalAmounts.plus(this.c_totalFees))) {
          this.d_maxPaidIndex = i
          break
        }
      }
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
    addRecipient() {
      this.d_txOut.push({
        address: '',
        amount: 0
      })
    },
    handleFeeInput(fee) {
      this.d_fee = fee
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
      try {
        await this.signTx()
      } catch (e) {
        console.log('错误原因：', e)
        this.$message.error(this.$t('Unknown Error!'))
      }
      this.$store.__s('pageLoading', false)
    },
    /**
     * 签名交易
     */
    async signTx() {
      // Organize output data
      const outputs = []
      const outLength = this.d_txOut.length
      for (let i = 0; i < outLength; i++) {
        const outItem = {}
        const item = this.d_txOut[i]
        outItem.amount = BN(item.amount)
          .times(100000000)
          .toNumber()
        outItem.script_type = 'PAYTOADDRESS'
        outItem.address = item.address
        outputs.push(outItem)
      }
      console.log('输出地址', outputs)
      // Organize input data and calculate change
      const inputs = []
      let prePaidCount = BN(0)
      let change = BN(0)
      for (let i = 0; i <= this.d_maxPaidIndex; i++) {
        const item = {}
        item.address_n = this.getAddressN(this.d_utxoList[i].path)
        item.amount = this.d_utxoList[i].value
        item.prev_hash = this.d_utxoList[i].txid
        item.prev_index = this.d_utxoList[i].vout
        item.script_type = this.d_utxoList[i].path.includes('49') ? 'SPENDP2SHWITNESS' : 'SPENDADDRESS'
        const result = await Axios.get(`https://api.abckey.com/${this.c_coinInfo.symbol}/tx/${this.d_utxoList[i].txid}`)
        item.sequence = result.data.vin[0].sequence
        prePaidCount = prePaidCount.plus(this.d_utxoList[i].value)
        inputs.push(item)
      }
      console.log('输入地址', inputs)
      change = prePaidCount.minus(this.c_totalAmounts.plus(this.c_totalFees))
      /*   if (prePaidCount.eq(this.c_totalAmounts.plus(this.c_totalFees))) {
        this.d_extraFee = 0
      } else if (
        BN('0.0001')
          .times('100000000')
          .gt(change)
      ) {
        // need extra fees
        this.$message.info(this.$t('If the payment is too fragmentary, additional 0.0001 currency handling fee will be paid'))
        this.d_extraFee = BN('0.0001').times('100000000')
        change = prePaidCount.minus(this.c_totalAmounts.plus(this.c_totalFees))
      } */

      // get change address
      const res = await Axios.get(`https://api.abckey.com/${this.c_coinInfo.symbol}/xpub/${this.c_usb.xpub}?details=txs&tokens=used&t=${new Date().getTime()}`)
      const usedTokens = res.data.usedTokens ? res.data.usedTokens : '0'
      const changeObject = {
        address_n: this.getAddressN(`m/${this.c_coinProtocol}'/${this.c_coinInfo.slip44}'/0'/1/${usedTokens}`),
        amount: change.toNumber(),
        script_type: this.c_coinProtocol === 49 ? 'PAYTOP2SHWITNESS' : 'PAYTOADDRESS'
      }
      // 零钱地址
      if (changeObject.amount) {
        outputs.push(changeObject)
      }
      const result = await this.$usb.signTx({
        coin_name: this.c_coinInfo.name,
        inputs,
        outputs
      })
      console.log('signTx', result)
      const signText = result?.data?.serialized_tx
      if (signText) {
        this.d_signHash = signText
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
        'Transaction Hash': '交易哈希'
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
