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
// 引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VXETable)
Vue.use(VueQuillEditor)

// 注册全局事件过滤器
Vue.filter('dateFormate', function(timer) {
  const date = new Date(timer)
  const y = date.getFullYear()
  const m =
    date.getMonth() + 1 > 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
  const d = date.getDate() > 10 ? date.getDate() : '0' + date.getDate()
  const h = date.getHours() > 10 ? date.getHours() : '0' + date.getHours()
  const mm =
    date.getMinutes() > 10 ? date.getMinutes() : '0' + date.getMinutes()
  const s = date.getMinutes() > 10 ? date.getMinutes() : '0' + date.getMinutes()
  return `${y}-${m}-${d} ${h}:${mm}:${s}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
