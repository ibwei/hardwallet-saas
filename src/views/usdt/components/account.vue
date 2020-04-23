<template>
  <v-container class="pa-0 text-left" fluid>
    <v-card class="px-3 mb-3">
      <v-row justify="center" align="center">
        <v-col cols="2">
          <span class="subtitle-2">{{ $t('Current Account') }}</span>
        </v-col>
        <v-col cols="1">
          <v-divider vertical style="height:30px;" />
        </v-col>
        <v-col cols="6">
          <span class="subtitle-2">{{ c_address }}</span>
        </v-col>
        <v-col cols="1">
          <v-divider vertical style="height:30px;" />
        </v-col>
        <v-col cols="2" class="">
          <v-btn class="subtitle-2" color="primary" text @click="changeAccount">{{ $t('Change') }}</v-btn>
        </v-col>
      </v-row>
    </v-card>
    <v-card class="px-3">
      <v-row>
        <v-col class="text-center">
          <v-btn @click="upBalance()" text>
            <span>{{ $t('Balance') }}</span>
            <v-icon :class="['ml-1', d_loading.upBalance && 'rotate']" size="16" color="primary">mdi-cached</v-icon>
          </v-btn>
          <div :class="['mt-1', d_loading.upBalance && 'blur']">
            <span class="title font-weight-bold">{{
              UnitHelper(this.$store.__s('eth.balance'))
                .div(1000000)
                .toString(10)
            }}</span>
            <span class="text-uppercase caption">&nbsp;{{ coin }}</span>
          </div>
        </v-col>
        <v-col class="text-center">
          <v-btn @click="upAll()" text>
            <span>{{ $t('Convert') }}</span>
            <v-icon :class="['ml-1', (d_loading.upBalance || d_loading.upRate) && 'rotate']" size="16" color="primary">mdi-cached</v-icon>
          </v-btn>
          <div :class="['mt-1', (d_loading.upBalance || d_loading.upRate) && 'blur']">
            <span class="title font-weight-bold">{{
              UnitHelper(this.$store.__s('eth.balance'))
                .div(1000000)
                .times(this.d_rate)
                .toString(10)
            }}</span>
            <span class="text-uppercase caption">&nbsp;{{ cash }}</span>
          </div>
        </v-col>
        <v-col class="text-center">
          <v-btn @click="upRate()" text>
            <span>{{ $t('Rate') }}</span>
            <v-icon :class="['ml-1', d_loading.upRate && 'rotate']" size="16" color="primary">mdi-cached</v-icon>
          </v-btn>
          <div :class="['mt-1', d_loading.upRate && 'blur']">
            <span class="title font-weight-bold">{{ cash2str(d_rate) }}</span>
            <span class="text-uppercase caption">&nbsp;{{ cash }}/{{ coin }}</span>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <v-card class="px-3 mt-3">
      <v-row>
        <v-col cols="6">
          <v-simple-table dense>
            <template v-slot:default>
              <tbody>
                <tr>
                  <td class="caption">{{ $t('Total Received') }}</td>
                  <td class="text-right">
                    <span :class="[d_loading.upBalance && 'blur']">
                      <b
                        >{{
                          summary.received
                            ? UnitHelper(summary.received)
                                .div(1000000)
                                .toString(10)
                            : 0
                        }}
                      </b>
                      <span class="text-uppercase caption grey--text">&nbsp;{{ coin }}</span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="caption">{{ $t('Total Spent') }}</td>
                  <td class="text-right">
                    <v-tooltip :disabled="!d_unconfirmedBalance" top>
                      <template v-slot:activator="{ on }">
                        <span v-on="on" :class="[d_loading.upBalance && 'blur']">
                          <b
                            >{{
                              summary.spent
                                ? UnitHelper(summary.spent)
                                    .div(1000000)
                                    .toString(10)
                                : 0
                            }}
                          </b>
                          <span class="text-uppercase caption grey--text">&nbsp;{{ coin }}</span>
                        </span>
                      </template>
                      <span>
                        <b>{{
                          summary.spent
                            ? UnitHelper(summary.spent)
                                .div(1000000)
                                .times(d_rate)
                                .toString(10)
                            : 0
                        }}</b>
                        <span class="text-uppercase caption">&nbsp;{{ cash }}</span>
                      </span>
                    </v-tooltip>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
        <v-col cols="6">
          <v-simple-table dense>
            <template v-slot:default>
              <tbody>
                <tr>
                  <td class="caption">{{ $t('Last Seen Receiving') }}</td>
                  <td class="text-right caption font-weight-light">
                    <span :class="[d_loading.upBalance && 'blur']">
                      <b>{{ summary.last_seen_receiving ? summary.last_seen_receiving : '0000-00-00 00:00:00' }}</b>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="caption">{{ $t('Last Seen Spending') }}</td>
                  <td class="text-right  caption font-weight-light">
                    <span :class="[d_loading.upBalance && 'blur']">
                      <b>{{ summary.last_seen_spending ? summary.last_seen_spending : '0000-00-00 00:00:00' }}</b>
                    </span>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-card>

    <v-expansion-panels :value="0" class="mt-3">
      <v-expansion-panel v-if="d_txs.length === 0" readonly>
        <v-expansion-panel-header expand-icon="">
          <span>
            <v-btn @click="upBalance()" text>
              <b>{{ $t('Transaction details need to be refreshed.') }}</b>
              <v-icon right :class="['ml-1', d_loading.upBalance && 'rotate']" size="16" color="primary">mdi-cached</v-icon>
            </v-btn>
          </span>
        </v-expansion-panel-header>
      </v-expansion-panel>
      <v-expansion-panel v-for="(item, i) in d_txs" :key="i">
        <v-expansion-panel-header>
          <v-row align="center" no-gutters>
            <v-col cols="4">
              <span class="caption grey--text">{{ utc2Beijing(item.time) }}</span>
            </v-col>
            <v-col cols="4">
              <v-tooltip :disabled="!item.value" top>
                <template v-slot:activator="{ on }">
                  <v-chip v-on="on" :color="item.sender === c_address.toLowerCase() ? 'red' : 'green'" small label outlined>
                    <v-icon left size="18">{{ item.sender !== c_address.toLowerCase() ? 'mdi-plus' : 'mdi-minus' }}</v-icon>
                    <span>{{ item.value }}</span>
                    <span class="text-uppercase caption ml-1">{{ coin }}</span>
                  </v-chip>
                </template>
                <span>
                  <span>{{ item.sender !== c_address.toLowerCase() ? $t('Received') : $t('Spent') }}</span>
                  <b
                    >&nbsp;{{
                      UnitHelper(item.value)
                        .times(d_rate)
                        .toString(10)
                    }}</b
                  >
                  <span class="text-uppercase caption">&nbsp;{{ cash }}</span>
                </span>
              </v-tooltip>
            </v-col>
            <v-col cols="4">
              <v-tooltip :disabled="!item.value" top>
                <template v-slot:activator="{ on }">
                  <v-chip v-on="on" small label outlined>
                    <v-icon left color="grey" size="22">mdi-wallet-outline</v-icon>
                    <span>{{
                      UnitHelper($store.__s('eth.balance'))
                        .div(1000000)
                        .toString(10)
                    }}</span>
                    <span class="text-uppercase caption ml-1">{{ coin }}</span>
                  </v-chip>
                </template>
                <span>
                  <span>{{ $t('Balance') }}</span>
                  <b
                    >&nbsp;{{
                      UnitHelper($store.__s('eth.balance'))
                        .times(d_rate)
                        .div(1000000)
                        .toString(10)
                    }}</b
                  >
                  <span class="text-uppercase caption">&nbsp;{{ cash }}</span>
                </span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-simple-table dense>
            <template v-slot:default>
              <tbody>
                <tr>
                  <td class="caption">{{ $t('Hash') }}</td>
                  <td>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <span class="number caption" v-on="on">
                          <!--  {{ item.txid.replace(/^(.......).+(.......)$/g, '$1 ######### $2') }} -->
                          {{ item.transaction_hash }}
                        </span>
                      </template>
                      <span>
                        <span class="caption">{{ item.transaction_hash }}</span>
                      </span>
                    </v-tooltip>
                  </td>
                </tr>
                <tr>
                  <td class="caption">{{ $t('Block') }}</td>
                  <td class="caption">{{ item.block_id }}</td>
                </tr>
                <tr>
                  <td class="caption">{{ $t('Time') }}</td>
                  <td class="caption">{{ item.time }}</td>
                </tr>
                <tr>
                  <td class="caption">{{ $t('Token Address') }}</td>
                  <td class="caption">{{ item.token_address }}</td>
                </tr>
                <tr>
                  <td class="caption">{{ $t('Token Name') }}</td>
                  <td class="caption">{{ item.token_name }}</td>
                </tr>
                <tr>
                  <td class="caption">{{ $t('Value') }}</td>
                  <td class="caption">{{ item.value }} USDT</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-row>
            <v-col cols="6">
              <v-simple-table dense>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">{{ $t('Input') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="caption number">
                        <span v-if="item.value">
                          <v-icon size="16" color="blue">mdi-key</v-icon>
                          <span>&nbsp;{{ item.sender }}</span>
                        </span>
                        <v-tooltip top v-else>
                          <template v-slot:activator="{ on }">
                            <span v-on="on">
                              <v-icon size="16" color="blue">mdi-key</v-icon>
                              <span>&nbsp;{{ item.sender }}</span>
                            </span>
                          </template>
                          <span>
                            <b>{{ item.value }}</b>
                            <span class="text-uppercase caption">&nbsp;{{ coin }}</span>
                            <span>&nbsp;≈&nbsp;</span>
                            <b>{{
                              UnitHelper(item.value)
                                .times(this.d_rate)
                                .toString(10)
                            }}</b>
                            <span class="text-uppercase caption">&nbsp;{{ cash }}</span>
                          </span>
                        </v-tooltip>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
            <v-col cols="6">
              <v-simple-table dense>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">{{ $t('Output') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="caption number">
                        <v-icon size="16" color="blue">mdi-key</v-icon>
                        <span>&nbsp;{{ item.recipient }}</span>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <p class="mt-3 mb-7 grey--text text-center">
      <span class="caption">
        {{ $t('Only the latest 1000 data is displayed.') }}
        <a :href="`https://blockchair.com/${c_coinInfo.name.toLowerCase()}/address/${c_address}`" target="_blank">{{ $t('See more') }}</a>
      </span>
    </p>
  </v-container>
</template>

<script>
import Axios from 'axios'
import BN from 'bignumber.js'
import ETH from '@/mixins/eth'
import UnitHelper from '@abckey/unit-helper'
import { utc2Beijing } from '../../../utils/common'

export default {
  props: {
    coin: {
      default: 'btc',
      type: String
    },
    cash: {
      default: 'usd',
      type: String
    },
    xpub: {
      default: '',
      type: String
    }
  },
  data: () => ({
    utc2Beijing,
    UnitHelper,
    d_balance: 0,
    d_rate: 0,
    summary: {
      spent: 0,
      received: 0,
      last_seen_spending: '',
      last_seen_receive: ''
    },
    transactions: [],
    d_totalReceived: 0,
    d_totalSent: 0,
    d_unconfirmedBalance: 0,
    d_unconfirmedTxs: 0,
    d_transactionCount: 0,
    d_addressCount: 0,
    d_address: '',
    d_txs: [],
    d_loading: {
      upBalance: false,
      upRate: false
    }
  }),
  watch: {
    coin() {
      this.upAll()
    },
    cash() {
      this.upAll()
    },
    xpub(val) {
      if (!val) return
      this.upAll()
    }
  },
  mixins: [ETH],
  computed: {
    c_coinInfo: vm => vm.$store.__s('coinInfo'),
    c_protocol: vm => vm.$store.__s('coinProtocol'),
    c_address: vm => vm.$store.__s('eth.address')
  },
  async created() {
    const path = this.$route.path
    for (;;) {
      if (this.$route.path !== path) break
      this.upAll()
      await new Promise(resolve => setTimeout(resolve, 7700 * 1000))
    }
  },
  methods: {
    changeAccount() {
      this.$message.info(this.$t('Tips:Currently only supports a single account'))
    },
    async getEthResult() {
      this.d_address = await this.ethGetAddress()
      this.$store.__s('eth.address', this.d_address)
      const { data } = await Axios.get(`https://api.blockchair.com/ethereum/erc-20/${this.c_coinInfo.contract}/dashboards/address/${this.c_address}`)
      this.summary = data.data[this.c_address.toLowerCase()].address
      this.transactions = data.data[this.c_address.toLowerCase()].transactions
      this.$store.__s('eth.balance', this.summary.balance ? this.summary.balance : 0)
      return data.context
    },

    upAll() {
      this.upBalance()
      this.upRate()
    },
    async upBalance() {
      this.d_loading.upBalance = true
      const result = await this.getEthResult()
      if (result.code !== 200) return
      this.d_balance = this.balance
      this.d_loading.upBalance = false
      this._fixTxs(this.transactions)
    },
    async upRate() {
      this.d_loading.upRate = true
      const { data } = await Axios.get(`https://api.abckey.com/market/usdt/${this.cash.toLowerCase()}&t=${new Date().getTime()}`)
      if (data.error) return
      this.d_rate = data
      this.d_loading.upRate = false
    },
    sat2btc: sat =>
      BN(sat)
        .div(1000000000000000000)
        .toNumber(),
    btc2str: btc =>
      BN(btc)
        .dp(8, 1)
        .toFormat(),
    cash2str: num =>
      BN(num)
        .dp(8, 1)
        .toFormat(),
    btc2cash: (sat, rate) =>
      BN(sat)
        .times(rate)
        .dp(2, 1)
        .toFormat(),
    unix2utc: time => new Date(time * 1000).toLocaleString(),
    _fixTxs(txs) {
      if (!txs.length) return
      for (let i = 0; i < txs?.length; i++) {
        txs[i].value = UnitHelper(txs[i].value)
          .div(1000000)
          .toString(10)
      }
      this.d_txs = txs
    },
    _isOwnAddr() {
      return true
    }
  },
  i18n: {
    messages: {
      zhCN: {
        'Last Seen Receiving': '最近接收',
        'Last Seen Spending': '最近发送',
        'Tips:Currently only supports a single account': '目前仅支持单一账户,多用户尚未开放',
        Change: '切换账号',
        'Current Account': '当前账号',
        Balance: '余额',
        Convert: '折合',
        Hash: '交易哈希',
        Block: '区块ID',
        Time: '时间',
        Rate: '汇率',
        'Token Address': '合约地址',
        'Token Name': '代币名',
        Value: '数量',
        Received: '收入',
        Spent: '花费',
        Confirmations: '确认',
        Fees: '费用',
        Input: '输入',
        Output: '输出',
        Refresh: '刷新',
        'See more': '查看更多',
        'Transaction details need to be refreshed.': '交易明细有待刷新。',
        'Only the latest 1000 data is displayed.': '仅显示最新 1000 条数据。',
        'Click to copy': '点击复制',
        'Total Received': '累计收入',
        'Total Spent': '累计转出',
        'Address Count': '地址计数',
        'Transaction Count': '交易计数',
        'Unconfirmed Balance': '未确认余额',
        'Unconfirmed Txs': '未确认交易计数'
      }
    }
  }
}
</script>

<style lang="scss">
.account {
  width: inherit;
}

.blur {
  filter: blur(2px);
}
</style>
