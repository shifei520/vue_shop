import Vue from 'vue'
import App from './App.vue'
import router from './router'
//引入element ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//引入树状表格展示插件
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
//引入全局css样式
import 'assets/css/reset.css'
import 'assets/css/border.css'
import 'assets/css/base.css'
//引入字体图标
import 'assets/font/iconfont.css'
//引入axios
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VXETable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
