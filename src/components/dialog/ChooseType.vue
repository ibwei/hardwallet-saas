<template>
  <v-dialog light overlay-opacity="0.1" v-model="c_show" width="500px" persistent>
    <v-sheet color="white" class="pa-2">
      <v-card-title class="headline">
        <template v-if="!d_selectType">
          <span class="subtitle-2 blue-grey lighten-5 pl-2 pr-2">
            <i class="icon pr-3">&#xe666;</i>
            {{ $t('Choose A Coin Type') }}
          </span>
        </template>
        <template v-else>
          <span class="subtitle-2 blue-grey lighten-5 pl-2 pr-2">
            <i class="icon pr-1">&#xe666;</i>
            {{ $t('Selected') }}:
          </span>
          <span class="green white--text subtitle-2 pl-2 pr-2">{{ d_selectType }}</span>
        </template>
      </v-card-title>
      <v-divider></v-divider>
      <v-row>
        <v-col cols="10" class="offset-1">
          <v-text-field :placeholder="$t('Enter Keywords to Search')" @input="m_filterTypeList" hide-details="auto"></v-text-field>
        </v-col>
      </v-row>
      <v-container id="scroll-target" style="height:400px;" class="overflow-y-auto">
        <v-row>
          <template v-for="(item, index) in d_filterTypeList">
            <v-col class="d-flex" justify="center" cols="12" :key="index">
              <v-sheet v-if="item.selected" width="100%" color="grey lighten-3" class="d-flex justify-center pa-2 justify-content-center align-items-sm-center">
                <v-col cols="1">
                  <div class="d-flex justify-center">
                    <img :src="require(`../../assets/cointype/${item.briefName}.png`)" height="25" width="auto" />
                  </div>
                </v-col>
                <v-col cols="5" justify="left">
                  <div class="d-flex subtitle-2 pl-2 green--text text-left">
                    {{ `${item.name}(${item.briefName})` }}
                    <div class="pl-5">
                      <i class="icon" style="font-size:26px">&#xe75c;</i>
                    </div>
                  </div>
                </v-col>
              </v-sheet>
              <v-sheet v-else width="100%" :color="item.briefName.toLowerCase() === c_coinType.toLowerCase() ? 'grey lighten-4' : ''" class="d-flex flex-row pa-2 justify-center justify-content-center align-items-center" style="cursor:pointer" @click="m_displaySelect(item.id)">
                <v-col cols="1">
                  <div class="d-flex justify-center">
                    <img :src="require(`../../assets/cointype/${item.briefName}.png`)" height="25" width="auto" />
                  </div>
                </v-col>
                <v-col cols="5" class="justify-start text-left">
                  <div class="subtitle-2 pl-2">{{ `${item.name}(${item.briefName})` }}</div>
                </v-col>
              </v-sheet>
            </v-col>
          </template>
          <template v-if="d_filterTypeList.length === 0">
            <span class="subtitle-2 darken-1--text">No match items</span>
          </template>
        </v-row>
      </v-container>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="default darken-1" text @click="d_dialog = false">
          <span class="subtitle-2 blue-grey--text pl-2 pr-2" @click="$store.__s('dialog.chooseType', false)">{{ $t('Cancel') }}</span>
        </v-btn>
        <v-btn color="green darken-1" text @click="d_dialog = false">
          <span class="subtitle-2 success--text pl-2 pr-2" @click="m_confirm">{{ $t('Confirm') }}</span>
        </v-btn>
      </v-card-actions>
    </v-sheet>
  </v-dialog>
</template>

<script>
import coinbook from '@/utils/coinbook'
export default {
  name: 'DialogChooseType',
  data() {
    return {
      d_preSelectedIndex: 0,
      d_selectType: '',
      d_dialog: false,
      d_filterTypeList: [],
      d_coinTypeList: [
        {
          name: 'Bitcoin',
          briefName: 'BTC'
        },
        {
          name: 'Ethereum',
          briefName: 'ETH'
        },
        {
          name: 'Litecoin',
          briefName: 'LTC'
        },
        {
          name: 'Tether USD',
          briefName: 'USDT'
        }
        /*  {
          name: 'Bitcoin Cash',
          briefName: 'BCH'
        },
        {
          name: 'Bitcoin Gold',
          briefName: 'BTG'
        },
        {
          name: 'Dash',
          briefName: 'DASH'
        },
        {
          name: 'Digibyte',
          briefName: 'DGB'
        },
        {
          name: 'Dogecoin',
          briefName: 'DOGE'
        },
        {
          name: 'Namecoin',
          briefName: 'NMC'
        },
        {
          name: 'Vertcoin',
          briefName: 'VTC'
        },
        {
          name: 'Zcash',
          briefName: 'ZEC'
        },
        {
          name: 'Ethereum Classic',
          briefName: 'ETC'
        },
        {
          name: 'NEM',
          briefName: 'XEM'
        },
        {
          name: 'Stellar',
          briefName: 'XLM'
        },
        {
          name: 'Cardano',
          briefName: 'ADA'
        },
        {
          name: 'Tezos',
          briefName: 'XTZ'
        } */
      ]
    }
  },
  computed: {
    c_show: vm => vm.$store.__s('dialog.chooseType'),
    c_coinType: vm => vm.$store.__s('coinType')
  },
  created() {
    this.d_coinTypeList.forEach((item, index) => {
      item.id = index
      item.selected = false
      return item
    })
    this.d_filterTypeList = this.d_coinTypeList
  },
  methods: {
    /**
     * @method displaySelect - when you select one of coin type,the target will be highligh
     * @param {number} index - this unique id of the selected type  when user choose
     * @return void
     */
    m_displaySelect(index) {
      if (this.c_coinType.toUpperCase() === this.d_filterTypeList[index].briefName) {
        return
      }
      const selectedType = this.d_filterTypeList[index]
      this.d_filterTypeList.splice(this.d_preSelectedIndex, 1, { ...this.d_filterTypeList[this.d_preSelectedIndex], selected: false })
      this.d_filterTypeList.splice(index, 1, { ...this.d_filterTypeList[index], selected: true })
      this.d_preSelectedIndex = index
      this.d_selectType = selectedType.briefName
    },

    /**
     * @method filterTypeList - when you input a keywords of coin type,the coinTypeList will be filter
     * @param {string} keywords - the keywords by user input
     */
    m_filterTypeList(keywords) {
      this.d_filterTypeList = []
      const key = keywords.toLowerCase()
      let i = 0
      this.d_coinTypeList.map(item => {
        const name = item.name.toLowerCase()
        const briefName = item.briefName.toLowerCase()
        if (name.includes(key) || briefName.includes(key)) {
          item.id = i++
          item.selected = false
          this.d_filterTypeList.push(item)
        }
      })
    },
    m_confirm() {
      const coinName = this.d_selectType.toLowerCase()
      if (!coinbook[coinName]?.bip) {
        this.$message.error('暂时不支持该币种!')
        return
      }
      this.$store.__s('coinType', this.d_selectType)
      this.$store.__s('coinInfo', coinbook[coinName])
      if (Reflect.has(coinbook[coinName].bip, '49')) {
        this.$store.__s('coinProtocol', 49)
      } else {
        this.$store.__s('coinProtocol', 44)
      }
      this.$store.__s('dialog.chooseType', false)
      this.$store.__s('usb.xpub', '')
    }
  },
  i18n: {
    messages: {
      zhCN: {
        Selected: '已选中',
        'Choose A Coin Type': '代币选择',
        'Enter Keywords to Search': '搜索关键词'
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
