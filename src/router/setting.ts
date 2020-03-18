const __DIR__ = 'setting'

const Root = {
  path: '/',
  meta: {
    title: 'setting'
  },
  component: () => import('../views/' + __DIR__ + '/index.vue')
}

export default {
  path: '/' + __DIR__,
  component: () => import(/* webpackChunkName: "Bitcoin" */ '../views/setting/index.vue'),
  children: [Root]
}
