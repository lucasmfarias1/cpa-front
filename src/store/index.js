import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    snackbarText: "",
    snackbarColor: "success",
    snackbar: false,

    status: "",
    token: localStorage.getItem("token") || "",
    user: {}
  },

  mutations: {
    setSnackbar(state, payload) {
      state.snackbarText = payload.text;
      state.snackbarColor = payload.color;
      state.snackbar = true;
    },

    auth_request(state) {
      state.status = "loading";
    },

    auth_success(state, payload) {
      state.status = "success";
      state.token = payload.token;
      state.user = payload.user;
    },

    auth_error(state) {
      state.status = "error";
    },

    logout(state) {
      state.status = "";
      state.token = "";
    }
  },

  getters : {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
  },

  actions: {
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit("auth_request");
        axios({
          url: "http://cpa.test/api/auth/login",
          data: user,
          method: "POST"
        })
          .then(resp => {
            const token = resp.data.access_token;
            const user = resp.data.user;
            localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = token;
            commit("auth_success", {
              token: token,
              user: user
            });
            resolve(resp);
          })
          .catch(err => {
            commit("auth_error");
            localStorage.removeItem("token");
            reject(err);
          });
      });
    },

    logout({ commit }) {
      return new Promise(resolve => {
        commit("logout");
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        resolve();
      });
    }
  },

  modules: {}
});
