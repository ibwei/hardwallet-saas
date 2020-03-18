const __DIR__ = 'bitcoin'

const Transaction = {
  path: 'Transaction',
  meta: {
    title: 'Transaction'
  },
  component: () => import('../views/' + __DIR__ + '/Transaction.vue')
}

export default {
  path: '/' + __DIR__,
  component: () => import(/* webpackChunkName: "Bitcoin" */ '../views/bitcoin/index.vue'),
  children: [Transaction]
}
