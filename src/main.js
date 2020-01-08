import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "axios";

Vue.config.productionTip = false;

const base = axios.create({
  baseURL: "http://cpa.test/api/v1"
});
Vue.prototype.$http = base;

Array.prototype.unique = function() {
  return this.filter(function (value, index, self) { 
    return self.indexOf(value) === index;
  });
}

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
