import Vue from 'vue'
import Vuex, { Store, Commit, Dispatch } from 'vuex'
// Store functionality
import modules from './modules'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import state from './state'
import VuexPersistedState from 'vuex-persistedstate'

export type MagicMethod = {
  __s?: (type: string, msg: string) => any
  __d?: (type: string, msg: string) => any
  __g?: (type: string, msg: string) => any
  commit: Commit
  dispatch: Dispatch
  getters: any
}

Vue.use(Vuex)

const store: Store<any> & MagicMethod & any = new Vuex.Store({
  strict: true,
  state,
  mutations,
  actions,
  getters,
  modules,
  plugins: [
    VuexPersistedState({
      paths: ['app.language', 'cashUnit', 'coinType']
    })
  ]
})

store.__s = (type, msg) => {
  let _state = store.state
  if (!type) return store.state
  if (type.indexOf('.') === -1) {
    if (msg !== undefined) {
      store.commit({
        type: '__set',
        key: type,
        val: msg,
        root: true
      })
      return _state
    } else {
      return _state[type]
    }
  }
  const _path = type.split('.')
  for (let i = 0; i < _path.length; i++) {
    if (_state[_path[i]] !== undefined) {
      _state = _state[_path[i]]
    } else {
      _state = undefined
    }
  }
  if (msg !== undefined && _path.length === 2) {
    store.commit({
      type: _path[0] + '/__set',
      key: _path[1],
      val: msg
    })
  }
  return _state
}

store.__d = (type, msg) => store.dispatch(type, msg)

store.__g = type => {
  if (!type) return store.getters
  return store.getters[type]
}
export default store
