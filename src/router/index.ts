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
    component: import(`@/views/Connect.vue`)
  },
  ...modules
]

const router: any = new VueRouter({
  base: process.env.BASE_URL,
  routes,
  linkActiveClass: 'active',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { x: 0, y: 0 }
  }
})

router.beforeEach((to, from, next) => {
  if (to.path === from.path) return
  next()
})

router.afterEach(() => {
  window.scrollTo(0, 0)
})

export default router
