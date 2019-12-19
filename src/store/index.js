import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import http from '@/utils/http'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    collapse: false,
    tagsList: [{ path: '/home', title: '首页' }]
  },
  mutations: {
    setTagsList (state, payload) {
      state.tagsList = payload
    },
    closeTag (state, path) {
      const index = state.tagsList.findIndex(tag => tag.path === path)
      state.tagsList.splice(index, 1)
    },
    changeCollapse (state, payload) {
      if (payload !== undefined) {
        state.collapse = Boolean(payload)
      } else {
        state.collapse = !state.collapse
      }
    }
  },
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
