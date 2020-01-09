<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col align="center">
        <h1 class="title">Atualmente não há nenhum questionário ativo.</h1>
      </v-col>
      <v-col align="center">
        <h2 class="subtitle-1">
          Para responder ao questionário ativo, basta fazer login com o seu
          número de RA e CPF.
        </h2>
        <v-subheader></v-subheader>
        <v-card width="100%" max-width="450px">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-text-field
              :rules="[rules.required]"
              label="RA"
              class="input-group--focused"
              prepend-icon="person"
            ></v-text-field>

            <v-text-field
              value=""
              :rules="[rules.required]"
              label="CPF"
              class="input-group--focused"
              prepend-icon="lock"
            ></v-text-field>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" to="/questionario">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      rules: {
        required: value => !!value || "Campo obrigatório",
        min: v => v.length >= 6 || "Mínimo 6 caracteres",
        emailMatch: () => "Combinação de email e senha inválida"
      }
    };
  },

  methods: {
    //
  }
};
</script>

<style scoped>
/*  */
</style>
