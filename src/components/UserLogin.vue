<template>
  <v-card width="100%" max-width="450px">
    <v-toolbar color="primary" dark flat>
      <v-toolbar-title>Login do aluno</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-form @submit.prevent="login" v-model="valid">
        <v-text-field
          :rules="[rules.required, rules.min]"
          label="CPF"
          class="input-group--focused"
          prepend-icon="lock"
          v-model="cpf"
          counter="11"
          maxlength="11"
        ></v-text-field>
        <div class="text-right mt-2">
          <v-btn
            :loading="$store.getters.isLoading"
            color="primary"
            type="submit"
            :disabled="!valid"
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
      ra: "123",
      cpf: "425",
      rules: {
        required: value => !!value || "Campo obrigatório",
        min: v => v.length >= 11 || "Mínimo 11 caracteres"
      }
    };
  },

  methods: {
    login() {
      if (!this.valid) return;
      this.$store.commit("setLoading", true);
      let cpf = this.cpf;
      this.$store
        .dispatch("login", { cpf })
        .then(response => {
          this.$http.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.token}`;
          this.$router.push("/");
          this.$store.commit("setLoading", false);
        })
        .catch(error => {
          let errorMessage;
          if (error.response.status == 401) {
            errorMessage = "CPF não encontrado";
          } else {
            errorMessage =
              "Erro desconhecido. Por favor tente novamente mais tarde.";
          }
          this.$store.commit("setSnackbar", {
            text: errorMessage,
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
