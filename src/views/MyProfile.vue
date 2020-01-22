<template>
  <v-container align="center" justify="center">
    <v-row align="center" justify="center" width="100%">
      <v-col justify="center" align="center">
        <v-card width="95%">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Meu perfil</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="submit" v-model="valid">
              <v-text-field
                :rules="[rules.required, rules.min]"
                label="Nome"
                class="input-group--focused"
                prepend-icon="person"
                :value="name"
              ></v-text-field>
              <v-text-field
                label="CPF"
                class="input-group--focused"
                prepend-icon="person"
                :value="cpf"
              ></v-text-field>
              <v-text-field
                label="Email"
                class="input-group--focused"
                prepend-icon="person"
                :value="email"
              ></v-text-field>
              <v-text-field
                label="Curso"
                class="input-group--focused"
                prepend-icon="person"
                :value="course"
              ></v-text-field>
              <v-text-field
                label="Ciclo"
                class="input-group--focused"
                prepend-icon="person"
                :value="term"
              ></v-text-field>
              <v-text-field
                label="Data de nascimento"
                class="input-group--focused"
                prepend-icon="person"
                :value="birthdate"
              ></v-text-field>
              <div class="text-right mt-2">
                <v-btn color="primary" type="submit" :disabled="!valid"
                  >Enviar</v-btn
                >
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
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
