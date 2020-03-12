import VueRouter, { Route } from 'vue-router'
import { AxiosInstance } from 'axios'
import { UsbType } from './interface/usbType'
import { Store } from 'vuex'

declare module 'vue/types/vue' {
  interface Vue {
    (vuetify: any, ...obj: any): void
    $router: VueRouter
    $route: Route
    $axios: AxiosInstance
    $usb: UsbType
    $store: Store<any>
  }
}
