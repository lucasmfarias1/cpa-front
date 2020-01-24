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
                label="Nome"
                class="input-group--focused"
                prepend-icon="person"
                :value="user.name"
                readonly
              ></v-text-field>
              <v-text-field
                label="CPF"
                class="input-group--focused"
                prepend-icon="mdi-account-card-details"
                :value="user.cpf"
                readonly
              ></v-text-field>
              <v-text-field
                label="Email"
                class="input-group--focused"
                prepend-icon="mdi-at"
                :value="user.email"
                readonly
              ></v-text-field>
              <v-text-field
                label="Curso"
                class="input-group--focused"
                prepend-icon="mdi-school"
                :value="user.course.name"
                v-if="user.course"
                readonly
              ></v-text-field>
              <v-text-field
                label="Data de nascimento"
                class="input-group--focused"
                prepend-icon="mdi-calendar-range"
                :value="moment(user.birthdate).calendar()"
                readonly
              ></v-text-field>

              <v-select
                :rules="[rules.required]"
                prepend-icon="mdi-format-list-numbered-rtl"
                :items="terms"
                :value="user.term"
                v-model="term"
                label="Ciclo"
              ></v-select>
              <v-select
                :rules="[rules.required]"
                prepend-icon="mdi-gender-male-female"
                :items="sexes"
                :value="user.sex"
                v-model="sex"
                label="Sexo"
              ></v-select>

              <div class="text-right mt-2">
                <v-btn
                  color="primary"
                  type="submit"
                  :disabled="!valid"
                  :loading="loading"
                >
                  Salvar
                </v-btn>
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
      valid: false,

      term: null,
      sex: null,

      terms: [
        { text: "1º", value: 1 },
        { text: "2º", value: 2 },
        { text: "3º", value: 3 },
        { text: "4º", value: 4 },
        { text: "5º", value: 5 },
        { text: "6º", value: 6 }
      ],
      sexes: [
        { text: "Masculino", value: "male" },
        { text: "Feminino", value: "female" }
      ],
      rules: {
        required: value => !!value || "Campo obrigatório"
      }
    };
  },

  mounted() {
    this.$store
      .dispatch("refreshCurrentUser")
      .then(user => {
        this.term = user.term;
        this.sex = user.sex;
      })
      .catch(() => {
        this.$store.dispatch("logout");
      });
  },

  computed: {
    user() {
      return this.$store.getters.currentUser;
    },

    loading() {
      return this.$store.getters.isLoading;
    }
  },

  methods: {
    submit() {
      this.$store.commit("setLoading", true);
      this.$http
        .post(`users/${this.user.id}`, {
          term: this.term,
          sex: this.sex
        })
        .then(() => {
          this.$store.commit("setSnackbar", {
            text: `Perfil atualizado com sucesso.`,
            color: "success"
          });
          this.$store.dispatch("refreshCurrentUser");
          this.$store.commit("setLoading", false);
        });
      this.$store.commit("setLoading", false);
    }
  }
};
</script>

<style scoped>
/*  */
</style>
