<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-card width="100%" max-width="450px">
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>Login</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-text-field
            :rules="[rules.required]"
            label="Login"
            class="input-group--focused"
            prepend-icon="person"
          ></v-text-field>

          <v-text-field
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            value=""
            :rules="[rules.required, rules.min]"
            :type="showPassword ? 'text' : 'password'"
            label="Senha"
            class="input-group--focused"
            prepend-icon="lock"
            @click:append="showPassword = !showPassword"
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary">Login</v-btn>
        </v-card-actions>
      </v-card>
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
      },
      showPassword: false
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
