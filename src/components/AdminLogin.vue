<template>
  <v-card width="100%" max-width="450px">
    <v-toolbar color="primary" dark flat>
      <v-toolbar-title>Área do admin - Login</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-form @submit.prevent="login" v-model="valid">
        <v-text-field
          :rules="[rules.required, rules.min]"
          label="CPF"
          class="input-group--focused"
          prepend-icon="person"
          v-model="cpf"
        ></v-text-field>

        <v-text-field
          :rules="[rules.required, rules.min]"
          label="Senha"
          class="input-group--focused"
          prepend-icon="lock"
          v-model="password"
        ></v-text-field>
        <div class="text-right mt-2">
          <v-btn
            :loading="$store.getters.isLoading"
            :disabled="!valid"
            color="primary"
            type="submit"
            >Login</v-btn
          >
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      cpf: "",
      password: "",
      rules: {
        required: value => !!value || "Campo obrigatório",
        min: v => v.length >= 4 || "Mínimo 4 caracteres"
      }
    };
  },

  methods: {
    login() {
      this.$store.commit("setLoading", true);

      let cpf = this.cpf;
      let password = this.password;
      this.$store
        .dispatch("login", { cpf, password })
        .then(response => {
          this.$http.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.token}`;
          this.$store.commit("setSnackbar", {
            text: "Login de admin realizado com sucesso.",
            color: "success"
          });
          this.$router.push("/quiz");
          this.$store.commit("setLoading", false);
        })
        .catch(() => {
          this.$store.commit("setSnackbar", {
            text: "Credenciais incorretas. Por favor tente novamente.",
            color: "error"
          });
          this.$store.commit("setLoading", false);
        });
    }
  }
};
</script>

<style scoped>
/*  */
</style>
