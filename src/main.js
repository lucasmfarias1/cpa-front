import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "axios";
import moment from "moment";
import "moment/locale/pt-br";
import VueTheMask from 'vue-the-mask'

Vue.use(VueTheMask)

Vue.config.productionTip = false;

moment.locale("pt-BR");
Vue.prototype.moment = moment;

const base = axios.create({
  baseURL: "http://cpa.test/api/v1"
});
Vue.prototype.$http = base;

const token = localStorage.getItem("token");
if (token) {
  Vue.prototype.$http.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${token}`;
  store.dispatch("setCurrentUser", token).catch(() => {
    store.dispatch("logout");
  });
}

Array.prototype.unique = function() {
  return this.filter(function(value, index, self) {
    return self.indexOf(value) === index;
  });
};

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
