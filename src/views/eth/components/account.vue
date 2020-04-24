<template>
  <v-container class="pa-0 text-left" fluid>
    <v-card class="px-3 mb-3">
      <v-row justify="center" align="center">
        <v-col cols="2" class="text-center">
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
            <span class="title font-weight-bold">{{ UnitHelper(d_balance, 'wei_eth').toString(10) }}</span>
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
              UnitHelper(d_balance, 'wei_eth')
                .times(d_rate)
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
                  <td class="caption">{{ $t('Address Count') }}</td>
                  <td class="text-right">
                    <span :class="[d_loading.upBalance && 'blur']">
                      <b>{{ d_addressCount ? d_addressCount : 0 }}</b>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="caption">{{ $t('Unconfirmed Balance') }}</td>
                  <td class="text-right">
                    <v-tooltip :disabled="!d_unconfirmedBalance" top>
                      <template v-slot:activator="{ on }">
                        <span v-on="on" :class="[d_loading.upBalance && 'blur']">
                          <b>{{ btc2str(d_unconfirmedBalance) }}</b>
                          <span class="text-uppercase caption grey--text">&nbsp;{{ coin }}</span>
                        </span>
                      </template>
                      <span>
                        <b>{{ btc2cash(d_unconfirmedBalance, d_rate) }}</b>
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
                  <td class="caption">{{ $t('Transaction Count') }}</td>
                  <td class="text-right">
                    <span :class="[d_loading.upBalance && 'blur']">
                      <b>{{ d_transactionCount }}</b>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="caption">{{ $t('Unconfirmed Txs') }}</td>
                  <td class="text-right">
                    <span :class="[d_loading.upBalance && 'blur']">
                      <b>{{ d_unconfirmedTxs }}</b>
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
              <span class="caption grey--text">{{ unix2utc(item.blockTime) }}</span>
            </v-col>
            <v-col cols="4">
              <v-tooltip :disabled="!item.valueChanged" top>
                <template v-slot:activator="{ on }">
                  <v-chip v-on="on" :color="item.vin[0].addresses.includes(c_address) ? 'red' : 'green'" small label outlined>
                    <v-icon left size="18">{{ !item.vin[0].addresses.includes(c_address) ? 'mdi-plus' : 'mdi-minus' }}</v-icon>
                    <span>{{ btc2str(Math.abs(item.valueChanged)) }}</span>
                    <span class="text-uppercase caption ml-1">{{ coin }}</span>
                  </v-chip>
                </template>
                <span>
                  <span>{{ item.valueChanged > 0 ? $t('Received') : $t('Spent') }}</span>
                  <b>&nbsp;{{ btc2cash(Math.abs(item.valueChanged), d_rate) }}</b>
                  <span class="text-uppercase caption">&nbsp;{{ cash }}</span>
                </span>
              </v-tooltip>
            </v-col>
            <v-col cols="4">
              <v-tooltip :disabled="!item.value" top>
                <template v-slot:activator="{ on }">
                  <v-chip v-on="on" small label outlined>
                    <v-icon left color="grey" size="22">mdi-wallet-outline</v-icon>
                    <span>{{ btc2str(item.value) }}</span>
                    <span class="text-uppercase caption ml-1">{{ coin }}</span>
                  </v-chip>
                </template>
                <span>
                  <span>{{ $t('Balance') }}</span>
                  <b>&nbsp;{{ btc2cash(item.value, d_rate) }}</b>
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
                        <span class="number" v-on="on">
                          <!--  {{ item.txid.replace(/^(.......).+(.......)$/g, '$1 ######### $2') }} -->
                          {{ item.txid }}
                        </span>
                      </template>
                      <span>
                        <span>{{ item.txid }}</span>
                      </span>
                    </v-tooltip>
                  </td>
                </tr>
                <tr>
                  <td class="caption">{{ $t('Block') }}</td>
                  <td>{{ item.blockHeight }}</td>
                </tr>
                <tr>
                  <td class="caption">{{ $t('Confirmations') }}</td>
                  <td>{{ item.confirmations }}</td>
                </tr>
                <tr>
                  <td class="caption">{{ $t('Fees') }}</td>
                  <td>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <span v-on="on">
                          <span>{{ btc2str(item.fees) }}</span>
                          <span class="text-uppercase caption">&nbsp;{{ coin }}</span>
                        </span>
                      </template>
                      <span>
                        <b>{{ btc2cash(item.fees, d_rate) }}</b>
                        <span class="text-uppercase caption">&nbsp;{{ cash }}</span>
                      </span>
                    </v-tooltip>
                  </td>
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
                      <th class="text-left">{{ $t('Input') }}({{ item.vin.length }})</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in item.vin" :key="i">
                      <td class="caption number">
                        <span v-if="item.value">
                          <v-icon size="16" color="blue">mdi-key</v-icon>
                          <span>&nbsp;{{ item.addresses[0] }}</span>
                        </span>
                        <v-tooltip top v-else>
                          <template v-slot:activator="{ on }">
                            <span :class="[item.own && 'blue--text']" v-on="on">
                              <v-icon size="16" color="blue">mdi-key</v-icon>
                              <span>&nbsp;{{ item.addresses[0] }}</span>
                            </span>
                          </template>
                          <span>
                            <b>{{ item.value }}</b>
                            <span class="text-uppercase caption">&nbsp;{{ coin }}</span>
                            <span>&nbsp;≈&nbsp;</span>
                            <b>{{ btc2cash(item.value, d_rate) }}</b>
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
                      <th class="text-left">{{ $t('Output') }}({{ item.vout.length }})</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in item.vout" :key="i">
                      <td class="caption number">
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <span :class="[item.own && 'blue--text']" v-on="on">
                              <v-icon size="16" color="blue">mdi-key</v-icon>
                              <span>&nbsp;{{ item.addresses[0] }}</span>
                            </span>
                          </template>
                          <span v-if="item.own">
                            <b>{{ item.value }}</b>
                            <span class="text-uppercase caption">&nbsp;{{ coin }}</span>
                            <span>&nbsp;≈&nbsp;</span>
                            <b>{{ btc2cash(item.value, d_rate) }}</b>
                            <span class="text-uppercase caption">&nbsp;{{ cash }}</span>
                          </span>
                        </v-tooltip>
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
    UnitHelper,
    d_balance: 0,
    d_rate: 0,
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
      await new Promise(resolve => setTimeout(resolve, 77 * 1000))
    }
  },
  methods: {
    changeAccount() {
      this.$message.info(this.$t('Tips:Currently only supports a single account'))
    },
    async getEthResult() {
      this.d_address = await this.ethGetAddress()
      this.$store.__s('eth.address', this.d_address)
      const r = await Axios.get(`https://api.abckey.com/${this.c_coinInfo.symbol}/address/${this.d_address}?page=1&pageSize=1000&details=txs`)
      return r
    },
    upAll() {
      this.upBalance()
      this.upRate()
    },
    async upBalance() {
      this.d_loading.upBalance = true
      const result = await this.getEthResult()
      if (result.error) return
      const data = result.data
      this.d_balance = data.balance
      this.$store.__s('eth.balance', data.balance)
      this.d_unconfirmedBalance = data.unconfirmedBalance
      this.d_unconfirmedTxs = data.unconfirmedTxs
      this.d_transactionCount = data.txs
      this.d_loading.upBalance = false
      this._fixTxs(data.transactions)
    },
    async upRate() {
      this.d_loading.upRate = true
      const { data } = await Axios.get(`https://api.abckey.com/market/${this.coin.toLowerCase()}/${this.cash.toLowerCase()}&t=${new Date().getTime()}`)
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
      if (!txs) return
      for (let i = 0; i < txs?.length; i++) {
        const oldValue = i + 1 === txs.length ? 0 : txs[i + 1].value
        txs[i].valueChanged = UnitHelper(txs[i].value - oldValue, 'wei_eth').toString(10)
        txs[i].value = UnitHelper(txs[i].value, 'wei_eth').toString(10)
        txs[i].fees = UnitHelper(txs[i].fees, 'wei_eth').toString(10)
        for (let x = 0; x < txs[i]?.vin?.length; x++) {
          txs[i].vin[x].value = UnitHelper(txs[i].vin[x].value, 'wei_eth').toString(10)
          txs[i].vin[x].own = this._isOwnAddr(txs[i].vin[x].addresses[0])
        }
        for (let y = 0; y < txs[i]?.vout?.length; y++) {
          txs[i].vout[y].value = UnitHelper(txs[i].vout[y].value, 'wei_eth').toString(10)
          txs[i].vout[y].own = this._isOwnAddr(txs[i].vout[y].addresses[0])
        }
      }
      this.d_txs = txs
    },
    _isOwnAddr(address) {
      return address.toLowerCase() === this.c_address.toLowerCase()
    }
  },
  i18n: {
    messages: {
      zhCN: {
        'Tips:Currently only supports a single account': '目前仅支持单一账户,多用户尚未开放',
        Change: '切换账号',
        'Current Account': '当前账号',
        Balance: '余额',
        Convert: '折合',
        Rate: '汇率',
        Received: '收入',
        Spent: '花费',
        Hash: '哈希',
        Block: '区块',
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
