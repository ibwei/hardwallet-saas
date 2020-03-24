<template>
  <v-container class="pa-0 send-wrap" fluid>
    <v-card class="pa-3">
      <div class="table">
        <div class="table-header px-3">
          <div class="table-c action-c"></div>
          <div class="table-c address-c subtitle-2">{{ $t('Address') }}</div>
          <div class="table-c amount-c subtitle-2">{{ $t('Amount') }}</div>
        </div>
        <div class="table-body">
          <div class="table-r px-3" v-for="(item, index) in d_txOut" :key="index">
            <div class="table-c action-c">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-icon
                    class="close-icon"
                    v-on="on"
                    :disabled="d_txOut.length <= 1"
                    @click="delTxOut(index)"
                  >mdi-close</v-icon>
                </template>
                <span>{{ $t('Delete') }}</span>
              </v-tooltip>
            </div>
            <div class="table-c address-c subtitle-2">
              <v-text-field
                v-model="item.address"
                :rules="d_addressRules"
                :label="$t('Address')"
                :hint="$t('Please input address')"
              >
                <v-tooltip top slot="append">
                  <template v-slot:activator="{ on }">
                    <v-icon
                      v-on="on"
                      color="primary"
                      size="16"
                      @click="paste(item)"
                    >mdi-content-paste</v-icon>
                  </template>
                  <span class="subtitle-2">{{ $t('Paste') }}</span>
                </v-tooltip>
              </v-text-field>
            </div>
            <div class="table-c amount-c">
              <v-text-field
                v-model="item.amount"
                :rules="d_amountRules"
                :label="$t('Amount')"
                :hint="$t('Please input amount')"
              >
                <div slot="append" class="primary--text">BTC</div>
              </v-text-field>
            </div>
          </div>
        </div>
      </div>
      <div class="form">
        <div class="left">
          <v-btn class="plus-btn" color="primary" @click="addRecipient()">
            <v-icon size="16">mdi-plus</v-icon>
            {{ $t('Add recipient') }}
          </v-btn>
        </div>
        <div class="right body-2">
          <v-chip label class="chip">{{ $t('Amounts') }} {{ c_totalAmounts }} BTC</v-chip>
          <v-chip label class="chip">{{ $t('Fees') }} {{ c_totalFees }} BTC</v-chip>
          <v-chip label color="success" class="chip">{{ $t('Total') }} {{ c_total }} BTC</v-chip>
        </div>
      </div>
      <div class="d-flex flex-row justify-end align-center">
        <v-row>
          <v-col cols="4">
            <v-combobox
              v-model="d_fee"
              :items="d_fees"
              :label="$t('Fee')"
              @input="handleFeeInput"
              :rules="d_feeRule"
              outlined
            >
              <div slot="append" class="primary--text">Sat/b</div>
              <template v-slot:item="{ index, item }">
                <div class="d-flex justify-space-between" style="width: 100%">
                  <span>{{ item.label }}:</span>
                  <span>{{ item.value }} Sat/b</span>
                </div>
              </template>
            </v-combobox>
          </v-col>
          <v-col cols="4" class="offset-4 text-sm-right pa-0">
            <v-btn color="primary" large @click="checkAndSend()">{{ $t('Check and send') }}</v-btn>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import clipboard from 'clipboard-polyfill'
import { getFullNum } from '@/utils/common'
export default {
  name: 'Send',
  data() {
    return {
      d_txOut: [
        {
          address: '',
          amount: ''
        }
      ],
      d_addressRules: [value => !!value || this.$t('Invalid address')],
      d_amountRules: [
        value => {
          const pattern = /^[+]{0,1}[1-9]\d*$|^[+]{0,1}(0\.\d*[1-9])$|^[+]{0,1}([1-9]\d*\.\d*[0-9])$/
          return pattern.test(value) || this.$t('Invalid amount')
        }
      ],
      d_feeRule: [
        value => {
          const pattern = /^[1-9]\d*$/
          return pattern.test(value) || this.$t('Invalid fee')
        }
      ],
      d_fee: '15',
      d_fees: [
        {
          label: this.$t('high'),
          value: '19'
        },
        {
          label: this.$t('middle'),
          value: '15'
        },
        {
          label: this.$t('low'),
          value: '1'
        }
      ]
    }
  },
  computed: {
    c_totalAmounts() {
      let sum = 0
      for (const key in this.d_txOut) {
        sum += Number(this.d_txOut[key].amount)
      }
      return sum
    },
    c_totalFees() {
      const _inNum = 0
      const _outNum = this.d_txOut.length
      const _result = (_inNum * 148 + _outNum * 34 + 10) * this.d_fee * 0.00000001
      return getFullNum(_result)
    },
    c_total: vm => vm.c_totalAmounts + vm.c_totalFees
  },
  methods: {
    delTxOut(index) {
      this.d_txOut.splice(index, 1)
    },
    async paste(item) {
      item.address = await clipboard.readText()
    },
    addRecipient() {
      this.d_txOut.push({
        address: '',
        amount: ''
      })
    },
    handleFeeInput(fee) {
      this.d_fee = fee.value ? fee.value : fee
    },
    async checkAndSend() {
      const proto = {
        coin_name: 'Bitcoin',
        inputs: [
          {
            address_n: [2147483697, 2147483650, 2147483648, 0, 0],
            amount: '1251912615515151598',
            prev_hash: 'f6ceb5e14b4cb7bd8a2b1922bd2d91596de3be447c806141f225c3d77a0e99eb',
            prev_index: 0,
            script_type: 'SPENDP2SHWITNESS',
            sequence: 4294967295
          }
        ],
        outputs: [
          {
            address: '1CXAKbLJW5PZiFRH5nANuDKhaPJ5TKepXD',
            amount: '12519063',
            script_type: 'PAYTOADDRESS'
          },
          {
            address_n: [2147483697, 2147483650, 2147483648, 0, 0],
            amount: '1251',
            script_type: 'PAYTOADDRESS'
          }
        ],
        version: 1,
        lock_time: 0
      }
      const result = await this.$usb.signTx(proto)
      console.log(`checkAndSend`, result)
    }
  },
  i18n: {
    messages: {
      zhHans: {
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
        Amounts: '总额',
        Fees: '手续费',
        Total: '合计',
        Fee: '费率',
        Review: '核对'
      },
      en: {
        Address: 'Address',
        Amount: 'Amount',
        Delete: 'Delete',
        Paste: 'Paste',
        Most: 'Most',
        'Add recipient': 'Add recipient',
        'Check and send': 'Check and send',
        'Are you sure to delete?': 'Are you sure to delete?',
        Yes: 'Yes',
        No: 'No',
        'Invalid address': 'Invalid address',
        'Invalid amount': 'Invalid amount',
        'Invalid fee': 'Invalid fee',
        'Please input address': 'Please input address',
        'Please input amount': 'Please input amount',
        high: 'high',
        middle: 'middle',
        low: 'low',
        Amounts: 'Amounts',
        Fees: 'Fees',
        Total: 'Total',
        Fee: 'Fee',
        Review: 'Review'
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
  .table-header {
    text-transform: capitalize;
    background-color: rgba(0, 0, 0, 0.02);
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
      &.action-c {
        width: 80px;
      }
      &.address-c {
        flex: 3;
      }
      &.amount-c {
        flex: 1;
        justify-content: flex-end;
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
