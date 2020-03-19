const __DIR__ = 'send'

export default {
  path: '/' + __DIR__,
  component: () => import(/* webpackChunkName: "Bitcoin" */ '../views/' + __DIR__ + '/index.vue'),
  children: []
}
