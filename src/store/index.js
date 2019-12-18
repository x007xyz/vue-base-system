import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import http from '@/utils/http'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    user
  },
  plugins: [
    store => {
      store.http = http
    }
  ]
})
