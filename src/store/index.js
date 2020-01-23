import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    snackbarText: "",
    snackbarColor: "success",
    snackbar: false,

    loading: false,
    status: "",
    token: localStorage.getItem("token")
      ? `Bearer ${localStorage.getItem("token")}`
      : "",
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
      state.token = `Bearer ${payload.token}`;
      state.user = payload.user;
    },

    auth_error(state) {
      state.status = "error";
    },

    logout(state) {
      state.status = "";
      state.token = "";
      state.user = {};
    },

    set_user(state, user) {
      state.user = user;
    },

    setLoading(state, boolean) {
      state.loading = !!boolean;
    }
  },

  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    currentUser: state => state.user,
    isLoading: state => state.loading,
    token: state => state.token
  },

  actions: {
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit("auth_request");
        axios({
          url: "http://cpa.test/api/v1/auth/login",
          data: user,
          method: "POST"
        })
          .then(resp => {
            const token = resp.data.access_token;
            const user = resp.data.user;
            localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            commit("auth_success", {
              token: token,
              user: user
            });
            resolve({ token: token, user: user });
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
        axios({
          url: "http://cpa.test/api/v1/auth/logout",
          method: "POST"
        });
        commit("logout");
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        resolve();
      });
    },

    setCurrentUser({ commit }, token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return new Promise((resolve, reject) => {
        axios({
          url: "http://cpa.test/api/v1/auth/me",
          method: "POST"
        })
          .then(response => {
            commit("set_user", response.data);
            resolve(response.data.user);
          })
          .catch(error => reject(error));
      });
    },

    refreshCurrentUser({ commit }) {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return new Promise((resolve, reject) => {
        axios({
          url: "http://cpa.test/api/v1/auth/me",
          method: "POST"
        })
          .then(response => {
            commit("set_user", response.data);
            resolve(response.data);
          })
          .catch(error => reject(error));
      });
    }
  },

  modules: {}
});
