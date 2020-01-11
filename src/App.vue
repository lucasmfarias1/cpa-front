<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item link to="/">
          <v-list-item-action>
            <v-icon>mdi-contact-mail</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/quiz">
          <v-list-item-action>
            <v-icon>mdi-contact-mail</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Questionários</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/login">
          <v-list-item-action>
            <v-icon>mdi-contact-mail</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Área do admin</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="$store.getters.isLoggedIn" @click.prevent="logout">
          <v-list-item-action>
            <v-icon>mdi-contact-mail</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="indigo" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Questionários CPA Fatec-RL</v-toolbar-title>
    </v-app-bar>

    <v-content id="content" class="white d-flex justify-center">
      <router-view></router-view>
    </v-content>
    <v-footer color="indigo" class="d-none d-sm-flex" app>
      <span class="white--text">Desenvolvido pela equipe web da Fatec-RL</span>
    </v-footer>

    <v-snackbar
      bottom
      v-model="$store.state.snackbar"
      :color="$store.state.snackbarColor"
      :timeout="6000"
      >{{ $store.state.snackbarText }}</v-snackbar
    >
  </v-app>
</template>

<script>
export default {
  created: function() {
    this.$http.interceptors.response.use(undefined, function(err) {
      return new Promise(function() {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch("logout");
        }
        throw err;
      });
    });
  },

  props: {
    source: String
  },

  data: () => ({
    drawer: null
  }),

  methods: {
    logout: function() {
      this.$store.dispatch("logout").then(() => {
        if (this.$route.path !== "/") this.$router.push("/");
      });
    }
  }
};
</script>
