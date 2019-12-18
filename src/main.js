import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import http from '@/utils/http'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css' // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css'

Vue.config.productionTip = false
Vue.prototype.$http = http
Vue.use(ElementUI, {
  size: 'small'
})

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
