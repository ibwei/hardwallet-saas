import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const files = require.context('.', true, /\.ts$/)
const modules: Array<any> = []
files.keys().forEach(key => {
  if (key === './index.ts') return
  modules.push(files(key).default)
})

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: '',
    redirect: '/wallet/account'
  },
  ...modules
]

const router: any = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
