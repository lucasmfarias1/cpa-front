<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item link to="/">
          <v-list-item-action>
            <v-icon>mdi-clipboard-list</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Responder Questionários</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="!$store.getters.isLoggedIn" link to="/user-login">
          <v-list-item-action>
            <v-icon>mdi-contact-mail</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Login do aluno</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider dark class="my-2" />

        <v-list-item link to="/admin-login">
          <v-list-item-action>
            <v-icon>mdi-shield-account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Área do Admin</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/quiz">
          <v-list-item-action>
            <v-icon>mdi-clipboard-text-multiple</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Criar Questionários</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/quiz-archive">
          <v-list-item-action>
            <v-icon>mdi-file-cabinet</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Questionários Arquivados</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <v-card v-if="$store.getters.isLoggedIn">
          <v-card-text>
            <div>Aluno</div>
            <p class="title text--primary mb-0">
              {{ username }}
            </p>
            <p class="title text--primary mb-0">
              {{ course }}
            </p>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="secondary" @click.prevent="logout">
              Sair
            </v-btn>
            <v-btn text color="secondary" to="/meu-perfil">
              Meu Perfil
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-navigation-drawer>

    <v-app-bar app color="indigo" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Questionários CPA Fatec-RL</v-toolbar-title>
    </v-app-bar>

    <v-content id="content" class="white d-flex justify-center">
      <router-view :key="$route.path"></router-view>
    </v-content>
    <v-footer color="indigo" class="d-none d-sm-flex" app>
      <span class="white--text">Desenvolvido pela equipe web da Fatec-RL</span>
    </v-footer>

    <v-snackbar
      bottom
      v-model="$store.state.snackbar"
      :color="$store.state.snackbarColor"
      :timeout="3000"
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
          delete this.$http.defaults.headers.common["Authorization"];
          this.$store.dispatch("logout");
        }
        throw err;
      });
    });
  },

  computed: {
    username() {
      return this.$store.getters.currentUser.name
        ? this.$store.getters.currentUser.name
        : "";
    },

    course() {
      return this.$store.getters.currentUser.course
        ? this.$store.getters.currentUser.course.shorthand
        : "";
    }
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
        delete this.$http.defaults.headers.common["Authorization"];
        if (this.$route.path !== "/") this.$router.push("/");
      });
    }
  }
};
</script>
