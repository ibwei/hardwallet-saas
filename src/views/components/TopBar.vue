<template>
  <div class="top-bar app-primary-bg">
    <div class="d-flex flex-row justify-space align-center pt-1 pb-1" style="width:100%;">
      <v-btn class="icon-area ml-4" icon @click="changeNavFold">
        <i class="icon menu-icon">&#xe647;</i>
      </v-btn>
      <div class="brand-button pa-1 pl-4 pr-4 mt-2   d-flex flex-row justify-between align-center">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn rounded color="#E4F2FD" v-on="on">
              <div class="body-2 text--secondary">{{ c_deviceName }}</div>
              <i class="icon pl-2">&#xe606;</i>
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(item, index) in d_menuItems" :key="index" @click.native="menuClick(index)" style="cursor:pointer">
              <v-list-item-title>{{ $t(item.name) }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      d_menuItems: [
        {
          name: 'Settings',
          icon: '',
          url: ''
        },
        {
          name: 'Refresh',
          icon: '',
          url: '/'
        }
      ]
    }
  },
  computed: {
    c_deviceName() {
      if (this.$store.__s('usb.connect')) return this.$store.__s('usb.label') ? this.$store.__s('usb.label') : this.$store.__s('usb.product')
      else return 'Waiting for connect'
    }
  },
  methods: {
    changeNavFold() {
      const fold = this.$store.__s('navbarFold')
      this.$store.__s('navbarFold', !fold)
    },
    menuClick(index) {
      if (this.d_menuItems[index].name === 'Refresh') {
        window.location.reload()
      }
      if (this.d_menuItems[index].name === 'Settings') {
        this.$router.push({ path: '/setting' })
      }
    }
  },
  i18n: {
    messages: {
      zhCN: {
        Refresh: '退出',
        Settings: '设置'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.shadow {
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
}
.top-bar {
  width: 100%;
  position: relative;
  height: 60px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
}
.icon-area {
  cursor: pointer;
}
.menu-icon {
  font-size: 30px;
  font-weight: 300;
  color: #fff;
}
.brand-button {
  border-radius: 20px;
  position: absolute;
  top: -1px;
  right: 0;
  cursor: pointer;
}
</style>
