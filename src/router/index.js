import Vue from "vue";
import VueRouter from "vue-router";

const Login = () => import("views/Login");
const Home = () => import("views/Home");
Vue.use(VueRouter);

const routes = [
  { path: "", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/home", component: Home },
];

const router = new VueRouter({
  routes,
  mode: "history",
});
//全局路由守卫
router.beforeEach((to, from, next) => {
  if (to.path === "/login") return next();
  const token = window.sessionStorage.getItem("token");
  if (!token) return next("/login");
  next();
});

export default router;
