import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/common/Layout'

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

export default new Router({
  routes: constRoutes
})
