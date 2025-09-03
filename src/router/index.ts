import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import Login from "../views/Auth/Login.vue";
import Register from "../views/Auth/Register.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    redirect: "/login",
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
