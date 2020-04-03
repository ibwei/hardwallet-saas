<template>
  <transition name="slide">
    <div class="message-wrap" :class="type" v-if="show">
      <div class="content">
        <i class="icon m-icon" v-html="c_icon"></i>
        <span> {{ content }}</span>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  data() {
    return {
      show: true,
      type: 'init',
      content: ''
    }
  },
  mounted() {
    console.log(this.type)
    this.startTimer()
  },
  computed: {
    c_icon() {
      switch (this.type) {
        case 'info':
          return '&#xe89e;'
        case 'error':
          return '&#xe68c;;'
        case 'success':
          return '&#xe78d;'
        case 'warning':
          return '&#xe727;'
        default:
          return ''
      }
    }
  },
  methods: {
    startTimer() {
      window.setTimeout(() => {
        this.show = false
      }, 3000)
    }
  }
}
</script>

<style lang="scss" scoped>
.message-wrap {
  position: fixed;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  background-color: #fff;
  color: #ffffff;
  left: 50%;
  transform: translateX(-50%);
  min-width: 360px;
  width: auto;
  top: 25px;
  height: 40px;
  z-index: 9999999999;
  border-radius: 4px;
  text-align: left;
  .content {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    padding-left: 20px;
    font-size: 16px;
    font-weight: bold;
  }
}
.m-icon {
  font-size: 20px;
  margin-right: 10px;
}
.init {
  background-color: transparent;
  color: transparent;
}
.error {
  background-color: #f56c6c;
  color: #ffffff;
}
.success {
  background-color: #4caf50;
  color: #fff;
}
.warning {
  background-color: #fb8c00;
  color: #fff;
}
.info {
  background-color: #1976d2;
  color: #ffffff;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
  transition: all 0.2s ease;
}
.slide-enter,
.slide-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
