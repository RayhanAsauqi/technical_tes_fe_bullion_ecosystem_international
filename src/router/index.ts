import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import Cookies from "js-cookie";
import Login from "../views/Auth/Login.vue";
import Register from "../views/Auth/Register.vue";
import Dashboard from "../views/Dashboard/index.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Root",
    redirect: "/auth/login",
  },
  {
    path: "/auth/login",
    name: "Login",
    component: Login,
    meta: { requiresGuest: true },
  },
  {
    path: "/auth/register",
    name: "Register",
    component: Register,
    meta: { requiresGuest: true },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

function isAuthenticated(): boolean {
  const token = Cookies.get("token");
  return !!token;
}

router.beforeEach((to, _from, next) => {
  const authenticated = isAuthenticated();

  if (to.meta.requiresAuth && !authenticated) {
    next({ name: "Login" });
  } else if (to.meta.requiresGuest && authenticated) {
    next({ name: "Dashboard" });
  } else {
    next();
  }
});

export default router;
