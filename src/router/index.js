import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('views/Login')
const Home = () => import('views/Home')
const Users = () => import('views/users/Users')
const Rights = () => import('views/power/Rights')
const Roles = () => import('views/power/Roles')
const Categories = () => import('views/goods/Category')
const Params = () => import('views/goods/Params')
const GoodsList = () => import('views/goods/GoodsList')
const Add = () => import('views/goods/Add')
const Welcome = () => import('components/Welcome')
const Order = () => import('views/order/Order')
const Report = () => import('views/report/Report')

Vue.use(VueRouter)

const routes = [
  { path: '', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Categories },
      { path: '/params', component: Params },
      { path: '/goods', component: GoodsList },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ]
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})
//全局路由守卫
router.beforeEach(async (to, from, next) => {
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})
export default router
