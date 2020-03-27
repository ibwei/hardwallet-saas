const __DIR__ = 'firstguide'

const index = {
  path: '/',
  meta: {
    title: 'index'
  },
  component: () => import('../views/' + __DIR__ + '/index.vue')
}

export default {
  path: '/' + __DIR__,
  component: () => import(/* webpackChunkName: "Bitcoin" */ '../views/' + __DIR__ + '/index.vue'),
  children: [index]
}
