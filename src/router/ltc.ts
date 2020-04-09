const __DIR__ = 'ltc'

const Account = {
  path: 'wallet',
  meta: {
    title: 'Wallet'
  },
  component: () => import('../views/' + __DIR__ + '/wallet/index.vue'),
  redirect: '/wallet/account',
  children: [
    {
      path: 'account',
      meta: {
        title: 'Account'
      },
      component: () => import('../views/' + __DIR__ + '/wallet/Account.vue')
    }
  ]
}

const Send = {
  path: 'send',
  meta: {
    title: 'Send'
  },
  component: () => import('../views/' + __DIR__ + '/send/index.vue')
}

const Receive = {
  path: 'receive',
  meta: {
    title: 'Receive'
  },
  component: () => import('../views/' + __DIR__ + '/receive/index.vue')
}

export default {
  path: '/' + __DIR__,
  redirect: '/' + __DIR__ + '/wallet',
  component: () => import(/* webpackChunkName: "Bitcoin" */ '../views/ltc/index.vue'),
  children: [Account, Receive, Send]
}
