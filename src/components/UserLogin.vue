<template>
  <v-card width="100%" max-width="450px">
    <v-toolbar color="primary" dark flat>
      <v-toolbar-title>Login do aluno</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-form @submit.prevent="login">
        <v-text-field
          :rules="[rules.required]"
          label="RA"
          class="input-group--focused"
          prepend-icon="person"
          v-model="ra"
        ></v-text-field>

        <v-text-field
          :rules="[rules.required, rules.min]"
          label="CPF"
          class="input-group--focused"
          prepend-icon="lock"
          v-model="cpf"
        ></v-text-field>
        <div class="text-right mt-2">
          <v-btn color="primary" type="submit">Login</v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
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
      let ra = this.ra;
      let cpf = this.cpf;
      this.$store
        .dispatch("login", { ra, cpf })
        .then(response => {
          this.$http.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.token}`;
          this.$router.push("/");
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style scoped>
/*  */
</style>
