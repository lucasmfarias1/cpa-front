import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Questionario from "../views/Questionario.vue";
import Quiz from "../views/Quiz.vue";
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
    component: Quiz
  },
  {
    path: "/quiz/create",
    name: "quiz-create",
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

export default router;
