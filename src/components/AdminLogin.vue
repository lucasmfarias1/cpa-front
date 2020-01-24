<template>
  <v-card width="100%" max-width="450px">
    <v-toolbar color="primary" dark flat>
      <v-toolbar-title>Área do admin - Login</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-form @submit.prevent="login">
        <v-text-field
          :rules="[rules.required, rules.min]"
          label="CPF"
          class="input-group--focused"
          prepend-icon="person"
          v-model="cpf"
        ></v-text-field>

        <v-text-field
          :rules="[rules.required]"
          label="Senha"
          class="input-group--focused"
          prepend-icon="lock"
          v-model="senha"
        ></v-text-field>
        <div class="text-right mt-2">
          <v-btn :loading="$store.getters.isLoading" color="primary" type="submit">Login</v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      cpf: "425",
      senha: "123",
      rules: {
        required: value => !!value || "Campo obrigatório",
        min: v => v.length >= 11 || "Mínimo 11 caracteres"
      }
    };
  },

  methods: {
    login() {
      let cpf = this.cpf;
      let senha = this.senha;
      this.$store
        .dispatch("login", { cpf, senha })
        .then(() => this.$router.push("/quiz"))
        .catch(err => console.log(err));
    }
  }
};
</script>

<style scoped>
/*  */
</style>
