import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/index.js";
import Home from "../views/Home.vue";
import UserLoginScreen from "../views/UserLoginScreen.vue";
import AdminLoginScreen from "../views/AdminLoginScreen.vue";
import AdminIndex from "../views/AdminIndex.vue";
import AdminCreate from "../views/AdminCreate.vue";
import AnswerCard from "../views/AnswerCard.vue";
import QuizIndex from "../views/QuizIndex.vue";
import QuizCreate from "../views/QuizCreate.vue";
import ResultsShow from "../views/ResultsShow.vue";
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
      requiresAuth: true,
      forbidsAdmin: true
    }
  },
  {
    path: "/quiz",
    name: "quiz",
    component: QuizIndex,
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: "/quiz-archive",
    name: "quiz-archive",
    component: QuizIndex,
    props: { archived: true },
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: "/quiz/create",
    name: "quiz-create",
    component: QuizCreate,
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: "/quiz/edit/:id",
    name: "quiz-edit",
    component: QuizCreate,
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: "/quiz/:id/results",
    name: "quiz-result",
    component: ResultsShow,
    meta: {
      requiresAuth: true,
      requiresAdmin: true
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
    path: "/admins",
    name: "admins",
    component: AdminIndex,
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: "/admins/create",
    name: "admins-create",
    component: AdminCreate,
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: "/admins/edit/:id",
    name: "admins-edit",
    component: AdminCreate,
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: "/meu-perfil",
    name: "meu-perfil",
    component: MyProfile,
    meta: {
      requiresAuth: true,
      forbidsAdmin: true
    }
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.isLoggedIn) next("/");
    else next();
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresGuest)) {
    if (store.getters.isLoggedIn) next("/");
    else next();
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    if (!store.getters.currentUser.is_admin == 1) next("/");
    else next();
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.forbidsAdmin)) {
    if (store.getters.currentUser.is_admin == 1) next("/");
    else next();
  } else {
    next();
  }
});

export default router;
