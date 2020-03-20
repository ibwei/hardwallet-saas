const __DIR__ = 'receive'

export default {
  path: '/' + __DIR__,
  component: () => import(/* webpackChunkName: "Bitcoin" */ '../views/' + __DIR__ + '/index.vue'),
  children: []
}
