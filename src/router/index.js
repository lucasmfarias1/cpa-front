import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Questionario from "../views/Questionario.vue";
import QuizIndex from "../views/QuizIndex.vue";
import QuizCreate from "../views/QuizCreate.vue";
import QuizEdit from "../views/QuizEdit.vue";

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
    component: QuizIndex
  },
  {
    path: "/quiz/create",
    name: "quiz-create",
    component: QuizCreate
  },
  {
    path: "/quiz/edit/:id",
    name: "quiz-edit",
    component: QuizEdit
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

export default router;
