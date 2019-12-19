import md5 from 'md5'
import { asyncRoutes } from '@/router'

/**
 * 根据路由meta.role确定是否当前用户拥有访问权限
 * @roles 用户拥有角色
 * @route 待判定路由
 */
function hasPermission (roles, route) {
  // 如果当前路由有roles字段则需判断用户访问权限
  if (route.meta && route.meta.roles) {
    // 若用户拥有的角色中有被包含在待判定路由角色表中的则拥有访问权
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    // 没有设置roles则无需判定即可访问
    return true
  }
}

/**
 * 递归过滤AsyncRoutes路由表
 * @routes 待过滤路由表，首次传入的就是AsyncRoutes
 * @roles 用户拥有角色
 */
export function filterAsyncRoutes (routes, roles) {
  const res = []

  routes.forEach(route => {
    // 复制一份
    const tmp = { ...route }
    // 如果用户有访问权则加入结果路由表
    if (hasPermission(roles, tmp)) {
      // 如果存在子路由则递归过滤之
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

export default {
  namespace: true,
  state: {
    username: localStorage.getItem('username') || '',
    roles: JSON.parse(localStorage.getItem('roles') || '[]')
  },
  mutations: {
    clearUserInfo (state) {
      state.username = ''
      state.roles = []
      localStorage.removeItem('username')
      localStorage.removeItem('roles')
    },
    setUserInfo (state, { username, roles }) {
      state.username = username
      localStorage.setItem('username', state.username)
      state.roles = roles || []
      localStorage.setItem('roles', JSON.stringify(state.roles))
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
      return this.http.delete('user/token').then(() => {
        commit('clearUserInfo')
      })
    }
  },
  getters: {
    asyncRoutes (state) {
      return filterAsyncRoutes(asyncRoutes, state.roles)
    }
  }
}
