import Vue from 'vue'
import Store from '@/store'
import Usb from '@abckey/webusb'

class UsbDevice extends Usb {
  syncVuex(e?: any): void {
    Store.__s('usb.connect', Boolean(e))
    Store.__s('usb.vendorId', e ? e.vendorId : 0)
    Store.__s('usb.productId', e ? e.productId : 0)
    Store.__s('usb.manufacturer', e ? e.manufacturerName : '')
    Store.__s('usb.product', e ? e.productName : '')
    Store.__s('usb.serialNumber', e ? e.serialNumber : 0)
  }
}

const webusb: any = new UsbDevice({
  debug: true
})

/**
 * @method onAdd - add device
 */
webusb.onAdd(e => {
  console.log('You have add devices', e)
  webusb.syncVuex(e)
})

/**
 * @method onConnect - device has reconnected
 */
webusb.onConnect(e => {
  console.log('You have already connect devices', e)
  webusb.syncVuex(e)
})

/**
 * @method onErr - device has something wrong
 */
webusb.onErr(e => {
  console.log('something wrong with usb device', e)
  webusb.syncVuex()
})

/**
 * @method onErr - device has something wrong
 */
webusb.onDisconnect(e => {
  console.log('Usb device disconnect', e)
  webusb.syncVuex()
})

/**
 * @method onMsg - when device send message
 */
webusb.onMsg(e => {
  console.log('onMsg', e)
  Store.__s('usb.msg', JSON.parse(JSON.stringify(e)))
})

const newCmd = async (type, proto) => {
  if (type !== 'Initialize') {
    await webusb.cmd('Initialize')
  }
  console.log(`${type} is running`)
  return webusb.cmd(type, proto)
}

Vue.prototype.$usb = webusb
