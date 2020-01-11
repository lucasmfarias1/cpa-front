import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/index.js";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Questionario from "../views/Questionario.vue";
import QuizIndex from "../views/QuizIndex.vue";
import QuizCreate from "../views/QuizCreate.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/questionario",
    name: "questionario",
    component: Questionario
  },
  {
    path: "/quiz",
    name: "quiz",
    component: QuizIndex,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/quiz/create",
    name: "quiz-create",
    component: QuizCreate
  },
  {
    path: "/quiz/edit/:id",
    name: "quiz-edit",
    component: QuizCreate
  },
  {
    path: "/login",
    name: "login",
    component: Login
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next();
      return;
    }
    next("/");
  } else {
    next();
  }
});

export default router;
