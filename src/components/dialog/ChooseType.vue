<template>
  <v-dialog justify="center" light overlay-opacity="0.1" v-model="d_dialog" width="800" persistent>
    <v-sheet color="white" class="pa-2">
      <v-card-title class="headline">
        <template v-if="!d_selectType">
          <span class="subtitle-2 blue-grey lighten-5 pl-2 pr-2">
            <i class="icon pr-3">&#xe666;</i>Choose A Coin Type
          </span>
        </template>
        <template v-else>
          <span class="subtitle-2 blue-grey lighten-5 pl-2 pr-2">
            <i class="icon pr-1">&#xe666;</i>Selected:
          </span>
          <span class="green white--text subtitle-2 pl-2 pr-2">{{ d_selectType }}</span>
        </template>
      </v-card-title>
      <v-divider></v-divider>
      <v-row>
        <v-col cols="4" class="offset-sm-4">
          <v-text-field
            placeholder="enter keywords to search"
            @input="m_filterTypeList"
            hide-details="auto"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-container id="scroll-target" style="height:400px;" class="overflow-y-auto">
        <v-row align="center" justify="center">
          <template v-for="(item, index) in d_filterTypeList">
            <v-col class="d-flex" justify="center" cols="12" :key="index">
              <v-sheet
                v-if="item.selected"
                width="100%"
                color="grey lighten-3"
                class="d-flex justify-center pa-2 justify-content-center align-items-sm-center"
              >
                <v-col cols="1">
                  <div class="d-flex justify-center">
                    <img src="../../assets/cointype/BTC.png" height="25" width="auto" />
                  </div>
                </v-col>
                <v-col cols="4" justify="left">
                  <div class="d-flex subtitle-2 pl-2 green--text text-left">
                    {{ `${item.name}(${item.briefName})` }}
                    <div class="pl-5">
                      <i class="icon" style="font-size:26px">&#xe75c;</i>
                    </div>
                  </div>
                </v-col>
              </v-sheet>
              <v-sheet
                v-else
                width="100%"
                class="d-flex flex-row pa-2 justify-center justify-content-center align-items-center"
                style="cursor:pointer"
                @click="m_displaySelect(item.id)"
              >
                <v-col cols="1">
                  <div class="d-flex justify-center">
                    <img src="../../assets/cointype/BTC.png" height="25" width="auto" />
                  </div>
                </v-col>
                <v-col cols="4" class="justify-start text-left">
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
          <span class="subtitle-2 blue-grey--text pl-2 pr-2">Cancel</span>
        </v-btn>
        <v-btn color="green darken-1" text @click="d_dialog = false">
          <span class="subtitle-2 success--text pl-2 pr-2">Confirm</span>
        </v-btn>
      </v-card-actions>
    </v-sheet>
  </v-dialog>
</template>

<script>
export default {
  name: 'chooseType',
  data () {
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
          name: 'Litecoin',
          briefName: 'LTC'
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
          name: 'Ethereum',
          briefName: 'ETH'
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
        }
      ]
    }
  },
  created () {
    this.d_coinTypeList.forEach((item, index) => {
      item.id = index
      item.seleted = false
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
    m_displaySelect (index) {
      const seletedType = this.d_filterTypeList[index]
      this.d_filterTypeList.splice(this.d_preSelectedIndex, 1, { ...this.d_filterTypeList[this.d_preSelectedIndex], selected: false })
      this.d_filterTypeList.splice(index, 1, { ...this.d_filterTypeList[index], selected: true })
      this.d_preSelectedIndex = index
      this.d_selectType = `${seletedType.name}(${seletedType.briefName})`
    },

    /**
     * @method filterTypeList - when you input a keywords of coin type,the coinTypeList will be filter
     * @param {string} keywords - the keywords by user input
     */
    m_filterTypeList (keywords) {
      const key = keywords.toLowerCase()
      this.d_filterTypeList = this.d_coinTypeList.filter(item => {
        const name = item.name.toLowerCase()
        const briefName = item.briefName.toLowerCase()
        return name.includes(key) || briefName.includes(key)
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
