const __DIR__ = 'bitcoin'

const A = {
  path: 'a',
  meta: {
    title: 'a page'
  },
  component: () => import('../views/' + __DIR__ + '/a.vue')
}

const B = {
  path: 'b',
  meta: {
    title: 'b'
  },
  component: () => import('../views/' + __DIR__ + '/b.vue')
}

export default {
  path: '/' + __DIR__,
  component: () => import(/* webpackChunkName: "Bitcoin" */ '../views/bitcoin/index.vue'),
  children: [A, B]
}
