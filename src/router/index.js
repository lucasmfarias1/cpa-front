import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
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
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
