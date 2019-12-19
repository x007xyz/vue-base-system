import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/common/Layout'
import store from '../store'
import { getToken } from '@/utils/token'

Vue.use(Router)

export const constRoutes = [{
  path: '/login',
  name: 'login',
  component: () => import(/* webpackChunkName: "login" */ '@page/Login.vue')
}, {
  path: '/',
  name: 'home',
  component: Layout,
  redirect: '/home',
  children: [{
    path: 'home',
    name: 'home',
    meta: { title: '首页' },
    component: () => import(/* webpackChunkName: "home" */ '@page/Home.vue')
  }, {
    path: '/404',
    component: () =>
      import(/* webpackChunkName: "404" */ '@page/error/404.vue'),
    meta: { title: '404' }
  },
  {
    path: '/403',
    component: () =>
      import(/* webpackChunkName: "403" */ '@page/error/403.vue'),
    meta: { title: '403' }
  }]
}]

export const asyncRoutes = [
  {
    path: '/page1',
    name: 'page1',
    component: Layout,
    meta: { title: '页面1', icon: 'el-icon-s-claim', roles: ['admin', 'member'] },
    children: [
      {
        path: 'page1-1',
        name: 'page1-1',
        meta: { title: '页面1-1', icon: '', roles: ['admin', 'member'] },
        component: () =>
          import(
            /* webpackChunkName: "page1-1" */ '@page/Page1-1.vue'
          )
      },
      {
        path: 'page1-2',
        name: 'page1-2',
        meta: { title: '页面1-2', icon: '', roles: ['admin', 'member'] },
        // hidden: true, // 设置则不显示
        component: () =>
          import(
            /* webpackChunkName: "page1-2" */ '@page/Page1-2.vue'
          )
      }]
  },
  {
    path: '/page2',
    name: 'page2',
    component: Layout,
    meta: { title: '页面2', icon: 'el-icon-s-claim', roles: ['admin', 'member'] },
    children: [{
      path: 'index',
      name: 'page2_index',
      meta: { title: '页面2-1', icon: 'el-icon-s-claim', roles: ['admin', 'member'] },
      component: () => import(/* webpackChunkName: "page2_index" */ '@page/Page2')
    }]
  },
  {
    path: '/admin',
    name: 'admin',
    meta: { title: '管理员页面', icon: 'el-icon-s-custom', roles: ['admin'] },
    component: Layout,
    children: [{
      path: 'index',
      name: 'admin-index',
      meta: { title: '账号管理', icon: 'el-icon-s-custom', roles: ['admin'] },
      component: () => import(/* webpackChunkName: "admin" */ '@page/Admin')
    }]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const router = new Router({
  routes: constRoutes.concat(asyncRoutes)
})
const whiteList = ['/login']
router.beforeEach((to, from, next) => {
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      const needRoles = to.meta && to.meta.roles && to.meta.roles.length > 0
      if (needRoles) {
        const hasRoles = store.state.user.roles.some(role => to.meta.roles.includes(role))
        if (hasRoles) {
          next()
        } else {
          next('/403')
        }
      } else {
        next()
      }
    }
  } else {
    if (whiteList) {
      if (whiteList.includes(to.path)) {
        next()
      } else {
        next('/login')
      }
    }
  }
})

export default router
