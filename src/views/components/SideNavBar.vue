<template>
  <div class="side-navbar">
    <div class="nav-area">
      <div v-for="(item, index) in d_routerList" :key="index" link class="pa-0">
        <div
          class="d-flex flex-row justify-start align-center pt-3 pb-3 pl-4"
          :class="item.id === d_selectedId ? 'blue lighten-4 blue--text lighten-3--text' : 'black--text'"
          @click="m_menuClick(item.id)"
        >
          <div class="dot mr-4" :class="item.id === d_selectedId ? 'blue' : 'white'"></div>
          <i class="icon pr-2" v-html="item.icon"></i>
          <div class="body-2">{{ $t(item.name) }}</div>
          <div class="icon text-right flex-grow-1 pr-4">
            <i
              class="icon text-right"
              style="font-size:26px;"
              :class="item.id === c_currentRootLevel ? '' : 'black--text'"
              v-if="item.children"
              v-html="item.id === c_currentRootLevel ? '&#xe625;' : '&#xe664;'"
            ></i>
          </div>
        </div>
        <transition-group name="fade">
          <template v-if="index == c_currentRootLevel">
            <div
              v-for="(child, childId) in d_routerList[index].children"
              :key="childId"
              @click="m_menuClick(child.id)"
              class="d-flex justify-start align-center pt-3 pb-3 pl-6"
              :class="child.id === d_selectedId ? 'blue lighten-4 blue--text lighten-3--text' : 'black--text'"
            >
              <div class="dot mr-4" :class="child.id === d_selectedId ? 'blue' : 'white'"></div>
              <i class="icon pr-3" v-html="child.icon"></i>
              <div class="body-2">{{ child.name }}</div>
            </div>
          </template>
        </transition-group>
      </div>
    </div>
    <div style="heigth:60px">
      <v-btn
        class="ml-5 change-language"
        color="primary"
        @click="$store.__s('dialog.language', true)"
      >{{ $t('Change Language') }}</v-btn>
      <v-divider class="mt-5 pb-3" style="width:100%;" />
      <div class="d-flex justify-center align-center pb-4">
        <img src="../../assets/logo.png" class="logo-picture" alt />
        <span class="product-name headline-1 pl-4">{{ this.d_brandName }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SideNavBar',
  props: {
    routerList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      d_brandName: 'ABCKEY',
      d_preSelectedIndex: 0,
      d_routerList: [],
      d_selectedId: []
    }
  },
  computed: {
    c_currentRootLevel () {
      return this.d_selectedId.split('-')[0]
    }
  },
  created () {
    this.m_handleProps()
  },
  methods: {
    m_handleProps () {
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
    m_menuClick (id) {
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
        this.$router.push(url)
      } else {
        const url = this.d_routerList[Number(id)].url
        this.$router.push(url)
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
        'Change Language': '修改语言'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.side-navbar {
  box-sizing: border-box;
  width: 100%;
  padding: 0;
  min-height: calc(100vh - 110px);
  display: flex;
  flex-flow: column nowrap;
}

.nav-area {
  flex: 1;
  cursor: pointer;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 100%;
}
.icon {
  font-size: 20px;
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
}
.logo-picture {
  height: 30px;
  width: auto;
}
</style>
