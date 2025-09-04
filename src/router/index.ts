import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
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
  },
  {
    path: "/auth/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
