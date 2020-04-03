import Vue from 'vue'
import MessageLayout from './Message.vue'
const MessageBox = Vue.extend(MessageLayout)
const Message = {
  install: (options, type) => {
    if (options === undefined || options === null) {
      options = {
        content: ''
      }
    } else if (typeof options === 'string' || typeof options === 'number') {
      options = {
        content: options
      }
      if (type !== undefined) {
        options.type = type
      }
    }
    const instance = new MessageBox({
      data: options
    }).$mount()
    document.body.appendChild(instance.$el)
    Vue.nextTick(() => {
      instance.visible = true
    })
  }
}
Vue.prototype.$message = Message.install;
['success', 'error', 'info', 'warning'].forEach(type => {
  Vue.prototype.$message[type] = (content) => {
    return Vue.prototype.$message(content, type)
  }
})
export default Message
