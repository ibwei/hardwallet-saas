<template>
  <v-dialog light overlay-opacity="0" v-model="d_dialog" width="800">
    <template v-slot:activator="{ on }">
      <v-btn color="" v-on="on">
        选择币种
      </v-btn>
    </template>
    <v-row> </v-row>
    <v-row>
      <v-col cols="6">
        <v-text-field placeholder="请输入要查找的币种" hide-details="auto"></v-text-field>
      </v-col>
    </v-row>
  </v-dialog>
</template>

<script>
export default {
  name: 'device',
  data() {
    return {
      d_dialog: false,
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
  }
}
</script>
