// https://vuex.vuejs.org/en/state.html
export default {
  coinType: 'btc',
  coinProtocol: 0,
  coinInfo: null,
  cashUnitItems: ['CNY', 'USD'],
  cashUnit: 'CNY',
  pageLoading: false,
  coinTypeList: [
    {
      name: 'Bitcoin',
      briefName: 'BTC',
      iconIndex: '1'
    },
    {
      name: 'Bitcoin Cash',
      briefName: 'BCH',
      iconIndex: '1831'
    },
    {
      name: 'Bitcoin Gold',
      briefName: 'BTG',
      iconIndex: '2083'
    },
    {
      name: 'Dash',
      briefName: 'DASH',
      iconIndex: '131'
    },
    {
      name: 'Digibyte',
      briefName: 'DGB',
      iconIndex: '109'
    },
    {
      name: 'Dogecoin',
      briefName: 'DOGE',
      iconIndex: '74'
    },
    {
      name: 'Litecoin',
      briefName: 'LTC',
      iconIndex: '2'
    },
    {
      name: 'Namecoin',
      briefName: 'NMC',
      iconIndex: '3'
    },
    {
      name: 'Vertcoin',
      briefName: 'VTC',
      iconIndex: '99'
    },
    {
      name: 'Zcash',
      briefName: 'ZEC',
      iconIndex: '1437'
    },
    {
      name: 'Ethereum',
      briefName: 'ETH',
      iconIndex: '1027'
    },
    {
      name: 'Ethereum Classic',
      briefName: 'ETC',
      iconIndex: '1321'
    },
    {
      name: 'NEM',
      briefName: 'XEM',
      iconIndex: '873'
    },
    {
      name: 'Stellar',
      briefName: 'XLM',
      iconIndex: '512'
    },
    {
      name: 'Cardano',
      briefName: 'ADA',
      iconIndex: '2010'
    },
    {
      name: 'Tezos',
      briefName: 'XTZ',
      iconIndex: '2011'
    }
  ],
  navbarFold: true
}
