import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/index.js";
import Home from "../views/Home.vue";
import UserLoginScreen from "../views/UserLoginScreen.vue";
import AdminLoginScreen from "../views/AdminLoginScreen.vue";
import AnswerCard from "../views/AnswerCard.vue";
import QuizIndex from "../views/QuizIndex.vue";
import QuizCreate from "../views/QuizCreate.vue";
import MyProfile from "../views/MyProfile.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/user-login",
    name: "user-login",
    component: UserLoginScreen,
    meta: {
      requiresGuest: true
    }
  },
  {
    path: "/answer-card/:id",
    name: "answer-card",
    component: AnswerCard,
    meta: {
      requiresAuth: true
    }
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
    path: "/quiz-archive",
    name: "quiz-archive",
    component: QuizIndex,
    props: { archived: true },
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/quiz/create",
    name: "quiz-create",
    component: QuizCreate,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/quiz/edit/:id",
    name: "quiz-edit",
    component: QuizCreate,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/admin-login",
    name: "admin-login",
    component: AdminLoginScreen,
    meta: {
      requiresGuest: true
    }
  },
  {
    path: "/meu-perfil",
    name: "meu-perfil",
    component: MyProfile,
    meta: {
      requiresAuth: true
    }
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
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (!store.getters.isLoggedIn) {
      next();
      return;
    }
  } else {
    next();
  }
});

export default router;
