import md5 from 'md5'

export default {
  namespace: true,
  state: {
    username: '',
    roles: []
  },
  mutations: {
    setUserInfo (state, { username, roles }) {
      state.username = username
      state.roles = roles || []
    }
  },
  actions: {
    fetchUserInfo ({ commit }) {
      this.http.get('user/info').then((data) => {
        commit('setUserInfo', data)
        return data
      })
    },
    login ({ commit }, { username, password }) {
      return this.http.post('user/token', {
        username, password: md5(password)
      }).then(({ username }) => {
        commit('setUserInfo', { username })
        return { username }
      })
    },
    logout ({ commit }) {
      return this.http.delete('user/token/me').then(() => {
        commit('clearUserInfo')
      })
    }
  }
}
