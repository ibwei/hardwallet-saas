const __DIR__ = 'wallet'

const Account = {
  path: 'account',
  meta: {
    title: 'Account'
  },
  component: () => import('../views/' + __DIR__ + '/Account.vue')
}

const Receive = {
  path: 'receive',
  meta: {
    title: 'Receive'
  },
  component: () => import('../views/' + __DIR__ + '/Receive.vue')
}

export default {
  path: '/' + __DIR__,
  redirect: `/${__DIR__}/account`,
  component: () => import('../views/' + __DIR__ + '/index'),
  children: [Account, Receive]
}
