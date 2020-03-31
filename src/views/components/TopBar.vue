<template>
  <div class="top-bar">
    <div
      class="d-flex flex-row justify-space align-center blue lighten-3 shadow pt-1 pb-1"
      style="width:100%;"
    >
      <div class="icon-area white--text" @click="changeNavFold">
        <i class="icon menu-icon">&#xe647;</i>
      </div>
      <div
        class="brand-button pa-1 pl-4 pr-4 mt-3 mr-2 blue lighten-5 d-flex flex-row justify-between align-center"
      >
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <div class="body-2" v-on="on">{{ c_deviceName }}</div>
            <i class="icon pl-2">&#xe606;</i>
          </template>
          <v-list class="mt-4">
            <v-list-item
              v-for="(item, index) in d_menuItems"
              :key="index"
              @click.native="menuClick(index)"
              style="cursor:pointer"
            >
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      d_menuItems: [{
        name: 'Settings',
        icon: '',
        url: ''
      }, {
        name: 'Refresh',
        icon: '',
        url: '/'
      }]
    }
  },
  computed: {
    c_deviceName () {
      if (this.$store.__s('usb.connect')) return this.$store.__s('usb.label') ? this.$store.__s('usb.label') : this.$store.__s('usb.product')
      else return 'Waiting for connect'
    }
  },
  methods: {
    changeNavFold () {
      const fold = this.$store.__s('navbarFold')
      this.$store.__s('navbarFold', !fold)
    },
    menuClick (index) {
      if (this.d_menuItems[index].name === 'Refresh') {
        window.location.reload()
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
}
.icon-area {
  cursor: pointer;
  padding-left: 10px;
}
.menu-icon {
  font-size: 30px;
  font-weight: 300;
}
.brand-button {
  border-radius: 20px;
  position: absolute;
  top: -1px;
  right: 0;
  cursor: pointer;
}
</style>
