<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <user-login></user-login>
    </v-row>
  </v-container>
</template>

<script>
import UserLogin from "../components/UserLogin.vue";

export default {
  data() {
    return {
      ra: "123",
      cpf: "425",
      rules: {
        required: value => !!value || "Campo obrigatório",
        min: v => v.length >= 11 || "Mínimo 11 caracteres",
        emailMatch: () => "Combinação de email e senha inválida"
      }
    };
  },

  components: {
    UserLogin
  },

  methods: {
    login() {
      let ra = this.ra;
      let cpf = this.cpf;
      this.$store
        .dispatch("login", { ra, cpf })
        .then(() => this.$router.push("/quiz"))
        .catch(err => console.log(err));
    }
  }
};
</script>

<style scoped>
/*  */
</style>
