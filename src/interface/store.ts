import Vuex, { Commit, Dispatch } from 'vuex'
export type MagicMethod = {
  __s?: (type: string, msg: string) => any
  __d?: (type: string, msg: string) => any
  __g?: (type: string, msg: string) => any
  commit: Commit
  dispatch: Dispatch
  getters: any
}
