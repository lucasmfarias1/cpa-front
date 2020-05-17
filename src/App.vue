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

        <v-list-item
          link
          to="/admin-login"
          v-if="!isLoggedIn || isAdmin"
          :disabled="isLoggedIn"
        >
          <v-list-item-action>
            <v-icon>mdi-shield-account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Área do Admin</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="isAdmin" link to="/quiz">
          <v-list-item-action>
            <v-icon>mdi-clipboard-text-multiple</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Gerenciar Questionários</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="isAdmin" link to="/quiz-archive">
          <v-list-item-action>
            <v-icon>mdi-file-cabinet</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Questionários Arquivados</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="isAdmin && isMaster" link to="/admins">
          <v-list-item-action>
            <v-icon>mdi-account-group</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Gerenciar Administradores</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <v-card v-if="$store.getters.isLoggedIn">
          <v-card-text>
            <div v-if="isAdmin">
              Administrador <span v-if="isMaster">Master</span>
            </div>
            <div v-else>Aluno</div>
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
            <v-btn v-if="!isAdmin" text color="secondary" to="/meu-perfil">
              Meu Perfil
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-navigation-drawer>

    <v-app-bar app color="indigo" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Questionar -  Fatec-RL</v-toolbar-title>
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
    },

    isAdmin() {
      return this.$store.getters.currentUser.is_admin == 1;
    },

    isMaster() {
      return this.$store.getters.currentUser.is_master;
    },

    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
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
