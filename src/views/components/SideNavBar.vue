<template>
  <v-navigation-drawer :value="true" class="elevation-4" app permanent :width="c_fold ? 90 : 250" @mouseenter.native="changeFold(false)">
    <v-row class="d-flex align-center text-left ma-0" :class="c_fold ? 'justify-center' : 'justify-start'">
      <v-col :cols="c_fold ? '12' : '4'">
        <img @click="openTypeDialog" :src="c_coinPicture" class="ma-2 mt-4 coin-type" height="40" width="auto" />
      </v-col>
      <v-col cols="8" class="pa-0" v-if="!c_fold">
        <div class="d-flex flex-column justify-start align-start text-left">
          <div class="d-flex justify-start align-center">
            <span class="subtitle-1">{{ coinInfo.symbol.toUpperCase() }}</span>
            <v-btn small rounded color="primary" class="ml-4 caption" @click="$store.__s('dialog.chooseType', true)">{{ $t('Change') }}</v-btn>
          </div>
          <div class="caption font-weight-medium pt-1 d-flex align-center">
            <v-icon small left>mdi-wallet-outline</v-icon>
            <span class="caption">{{ c_balance }}{{ coinInfo.symbol.toUpperCase() }} </span>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row class="ma-0">
      <div class="side-navbar">
        <v-list dense class="nav-area">
          <v-list-item-group class="pa-0 ma-0" style="border-top:1px solid  rgba(44, 115, 210, 0.2)">
            <v-list-item v-for="(item, index) in d_routerList" :key="index" link class="pa-0" :class="[item.id === d_selectedId ? 'active-menu' : 'text--white']">
              <v-list-item-content @click="menuClick(item.id)">
                <div class="pt-1 pb-1" :class="[item.id === d_selectedId ? 'active-menu' : 'inactive-menu text--black', c_fold ? 'flex-colomn' : 'flexrow  pl-4']">
                  <div class="dot mr-4" :class="item.id === d_selectedId ? 'inactive-menu' : 'white'" v-if="!c_fold"></div>
                  <i class="icon pr-2" v-html="item.icon"></i>
                  <div class="body-2 text--white" v-if="!c_fold">{{ $t(item.name) }}</div>
                  <div class="icon text-right flex-grow-1 pr-4">
                    <i class="icon text-right" style="font-size:26px;" :class="item.id == c_currentRootLevel ? '' : 'white--text'" v-if="item.children" v-html="item.id === c_currentRootLevel ? '&#xe625;' : '&#xe664;'"></i>
                  </div>
                </div>
                <transition-group name="fade">
                  <template v-if="index == c_currentRootLevel">
                    <div v-for="(child, childId) in d_routerList[index].children" :key="childId" @click="menuClick(child.id)" class="d-flex justify-start align-center pt-3 pb-3 pl-6" :class="child.id === d_selectedId ? 'active-menu text---primary ' : 'white'">
                      <div class="dot mr-4" :class="child.id === d_selectedId ? 'text-primary' : 'white'"></div>
                      <i class="icon pr-3" v-html="child.icon"></i>
                      <div class="body-2">{{ child.name }}</div>
                    </div>
                  </template>
                </transition-group>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
      <v-col cols="12" class="pa-0" style="heigth:60px;width:100%;">
        <div class="pa-0 ma-0">
          <v-btn v-show="c_fold" tile color="primary" rounded icon>
            <v-icon>mdi-translate</v-icon>
          </v-btn>
          <v-btn v-show="!c_fold" class="change-language pl-6 pr-6" rounded color="primary" @click="$store.__s('dialog.language', true)"><v-icon size="medium" class="pr-4">mdi-translate</v-icon>{{ $t('name') }}</v-btn>
          <v-divider class="mt-5 pb-3" />
          <div class="d-flex justify-center align-center pt-2 pb-2">
            <img :src="c_logo" class="logo-picture" alt />
            <span v-if="!c_fold" class="product-name subtitle-2 pl-4">&copy;&nbsp;{{ brand.name }}&nbsp;{{ new Date().getFullYear() }}</span>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-navigation-drawer>
</template>
<script>
import CoinBook from '@/utils/coinbook'
import { mapState } from 'vuex'
export default {
  name: 'SideNavBar',
  props: {
    routerList: {
      type: Array,
      default: () => [
        {
          name: 'Account',
          icon: '&#xea03;',
          url: '/wallet/account'
        },
        {
          name: 'Receive',
          icon: '&#xe9fd;',
          url: '/receive'
        },
        {
          name: 'Send',
          icon: '&#xea06;',
          url: '/send'
        },
        {
          name: 'Setting',
          icon: '&#xe9f2;',
          url: '/setting'
        }
      ]
    }
  },
  data() {
    return {
      d_brandName: 'ABCKEY',
      d_preSelectedIndex: 0,
      d_routerList: [],
      d_selectedId: []
    }
  },
  computed: {
    ...mapState(['version', 'usb', 'app', 'cashUnitItems', 'cashUnitIndex', 'coinInfo', 'brand']),
    c_currentRootLevel() {
      return this.d_selectedId.split('-')[0]
    },
    c_balance: vm => vm.$store.__s('balance'),
    c_coinPicture() {
      const pictureName = this.c_coinType.toUpperCase()
      return require(`../../assets/cointype/${pictureName}.png`)
    },
    isDeviceConnect: vm => vm.usb.connect,
    c_coinType: vm => vm.$store.__s('coinType'),
    c_fold: vm => vm.$store.__s('navbarFold'),
    c_logo() {
      return require(`@/assets/${this.brand.logo}`)
    }
  },
  watch: {
    $route() {
      window.document.title = this.$route.meta.title ? this.$route.meta.title : 'dfukey.com'
    },
    /**
     * @method - Hook function - Execute after the device is connected
     * @return {void}
     */
    isDeviceConnect(e) {
      if (e === true) {
        this.$router.push(`${this.coinInfo.symbol}/wallet/account`)
      } else {
        this.$router.push({ path: this.brand.buildPaht })
      }
    },
    c_coinType() {
      this.initCoinInfo()
    }
  },
  created() {
    this.handleProps()
    this.initCoinInfo()
  },
  methods: {
    openTypeDialog() {
      this.$store.__s('dialog.chooseType', true)
      this.$store.__s('pageLoading', false)
    },
    changeFold(status) {
      this.$store.__s('navbarFold', status)
    },
    onClickCash(index) {
      this.$store.__s('cashUnitIndex', index)
    },
    initCoinInfo() {
      this.$store.__s('coinInfo', CoinBook[this.c_coinType])
    },
    handleProps() {
      this.d_routerList = this.$props.routerList
      this.d_routerList.forEach((parent, parentId) => {
        parent.id = String(parentId)
        if (parent?.children) {
          this.d_routerList[parentId].children.forEach((child, childId) => {
            child.id = `${parentId}-${childId}`
          })
        }
      })
      this.d_selectedId = '0'
    },
    menuClick(id) {
      const isRootLevel = !id.includes('-')
      const [parentId, childId] = id.split('-')
      if (id === this.d_selectedId) {
        return false
      }
      this.d_selectedId = id
      if (!isRootLevel) {
        const url = this.d_routerList[Number(parentId)]?.children[Number(childId)].url
        if (url === this.$route.path) {
          return
        }
        if (id === '3') {
          this.$router.push({ path: url })
        } else {
          this.$router.push({ path: `/${this.coinInfo.symbol}${url}` })
        }
        return
      }
      const url = this.d_routerList[Number(id)].url
      if (id === '3') {
        this.$router.push({ path: url })
      } else {
        this.$router.push({ path: `/${this.coinInfo.symbol}${url}` })
      }
    }
  },
  i18n: {
    messages: {
      zhCN: {
        Account: '账户',
        Receive: '收款',
        Send: '转账',
        Setting: '设置',
        'Change Language': '修改语言',
        'Switch Currencies': '切换货币',
        Safe: '安全',
        Change: '切换'
      },
      enUs: {
        Account: 'Account',
        Receive: 'Receive',
        Send: 'Send',
        Setting: 'Setting',
        'Change Language': 'Change Language',
        'Switch Currencies': 'Switch Currencies',
        Safe: 'Safe',
        Change: 'Change'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.flexrow {
  display: flex;
  flex-flow: row nowrap;
  justify-self: center;
  align-items: center;
}
.flexcolumn {
  display: row;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}
.shadow {
  box-shadow: -1px 1px 5px rgba(22, 22, 22, 0.2);
}

.switch-button {
  position: fixed;
  bottom: 30px;
}
.coin-type {
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.4);
  box-shadow: 1px 1px 20px rgba(0, 0, 0, 0.4);
  cursor: pointer;
}
.coin-type:hover {
  box-shadow: 1px 1px 40px rgba(0, 0, 0, 0.4);
}
.side-navbar {
  box-sizing: border-box;
  width: 100%;
  padding: 0;
  margin: 0;
  min-height: calc(100vh - 220px);
  display: flex;
  flex-flow: column nowrap;
}

.nav-area {
  flex: 1;
  width: 100%;
  cursor: pointer;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 100%;
}
.icon {
  font-size: 20px;
  font-weight: 300;
}
.reverse {
  transform: rotate(180deg);
  transition: all 0.5s ease-in-out;
}
.fade-enter-active,
.fade-leave-active {
  opacity: 1;
  transform: translateY(0px);
  transition: all 0.3s;
}
.fade-enter,
.fade-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}
.change-language {
  height: 60px;
  bottom: 0;
  min-width: 300px;
}
.logo-picture {
  height: 30px;
  width: auto;
}
.active-menu {
  background-color: rgba(44, 115, 210, 1);
  color: #fff;
}
.inactive-menu {
  background-color: #fff;
  color: #000;
}
</style>
