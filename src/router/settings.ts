const __DIR__ = 'settings'

const A = {
  path: 'a',
  meta: {
    title: 'a page'
  },
  component: () => import('../views/' + __DIR__ + '/a.vue')
}

export default {
  path: '/' + __DIR__,
  component: () => import(/* webpackChunkName: "Bitcoin" */ '../views/settings/index.vue'),
  children: [A]
}
