import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    snackbarText: "",
    snackbarColor: "success",
    snackbar: false
  },
  mutations: {
    setSnackbar (state, payload) {
      state.snackbarText = payload.text;
      state.snackbarColor = payload.color;
      state.snackbar = true;
    }
  },
  actions: {},
  modules: {}
});
