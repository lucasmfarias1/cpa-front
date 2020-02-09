<template>
  <v-container id="createq" ref="container">
    <v-row justify="center" class="ma-5" ref="firstrow">
      <h2 class="title">
        <span v-if="admin.id">Editar</span>
        <span v-else>Novo</span>
        Administrador
      </h2>
    </v-row>
    <v-row>
      <v-col>
        <v-form
          @keyup.native.enter="submitAdmin"
          ref="form"
          id="createform"
          v-model="valid"
        >
          <div ref="colq">
            <v-row class="d-flex align-center">
              <v-text-field
                :rules="[rules.required]"
                :disabled="loading"
                maxlength="191"
                class="ma-4"
                label="Nome"
                v-model="admin.name"
              >
              </v-text-field>
            </v-row>
            <v-row class="d-flex align-center">
              <v-text-field
                id="create-admin-cpf"
                ref="cpf"
                :rules="[rules.required, rules.minCpf]"
                :disabled="loading"
                v-mask="'###.###.###-##'"
                class="ma-4"
                label="CPF"
                v-model="admin.cpf"
              >
              </v-text-field>
            </v-row>
            <v-row class="d-flex align-center">
              <v-text-field
                :rules="passwordRules"
                :disabled="loading"
                class="ma-4"
                label="Senha"
                v-model="admin.password"
              >
              </v-text-field>
            </v-row>
            <v-row class="d-flex align-center">
              <v-text-field
                :rules="passwordRules"
                :disabled="loading"
                class="ma-4"
                label="Confirme a senha"
                v-model="admin.password_confirmation"
              >
              </v-text-field>
            </v-row>
            <v-row class="d-flex align-center">
              <v-select
                :items="courses"
                v-model="admin.course_id"
                item-text="shorthand"
                class="ma-4"
                item-value="id"
                label="Curso"
              ></v-select>
            </v-row>
          </div>
        </v-form>
      </v-col>
    </v-row>

    <v-footer
      style="left: auto"
      class="pa-0 ma-0"
      fixed
      ref="footer"
      :width="footerWidth"
    >
      <v-row align="center" justify="center" class="py-3 mb-9">
        <v-btn class="secondary" to="/admins">Voltar</v-btn>
        <v-btn
          :loading="loading"
          class="success"
          type="submit"
          @click.prevent="submitAdmin"
        >
          Salvar
        </v-btn>
      </v-row>
    </v-footer>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      courses: [],
      footerWidth: 0,
      valid: false,
      rules: {
        required: value => !!value || "Campo obrigatório",
        minCpf: v => (v && v.length) >= 14 || "Mínimo 14 caracteres",
        minPassword: v => (v && v.length) >= 4 || "Mínimo 4 caracteres"
      },
      admin: { cpf: "00000000000" }
    };
  },

  computed: {
    loading() {
      return this.$store.getters.isLoading;
    },

    passwordRules() {
      return this.admin.id ? [] : [this.rules.required, this.rules.minPassword];
    }
  },

  mounted() {
    let loadAdmin = new Promise(resolve => {
      if (this.$route.params.id) {
        this.getAdminFromApi();
      }
      resolve();
    });

    loadAdmin.then(() => {
      this.getCoursesFromApi();
    });

    this.$nextTick(() => {
      this.setFooterWidth();
      window.addEventListener("resize", this.setFooterWidth);
    });
  },

  methods: {
    submitAdmin() {
      if (!this.valid) {
        this.$refs.form.validate();
        this.$store.commit("setSnackbar", {
          text: `Por favor preencha todo o formulário.`,
          color: "error"
        });
        return;
      }

      if (this.admin.id) {
        this.updateAdmin();
      } else {
        this.storeAdmin();
      }
    },

    storeAdmin() {
      this.$store.commit("setLoading", true);

      let cpf = this.admin.cpf.replace(/\D/g, "");
      this.$http
        .post("admins", { ...this.admin, cpf: cpf })
        .then(response => {
          this.admin.id = response.data.admin.id;
          this.$store.commit("setSnackbar", {
            text: `Administrador #${response.data.admin.id} criado com sucesso`,
            color: "success"
          });
          this.$router.replace({
            path: `/admins/edit/${response.data.admin.id}`
          });
          this.$store.commit("setLoading", false);
        })
        .catch(error => {
          const errorResponse = error.response.data.errors;
          let errorArray = [];
          for (var errorInstance in errorResponse) {
            errorArray.push(errorResponse[errorInstance][0]);
          }
          errorArray = errorArray.unique().join(" ");

          this.$store.commit("setSnackbar", {
            text: `${errorArray}`,
            color: "error"
          });
          this.$store.commit("setLoading", false);
        });
    },

    updateAdmin() {
      this.$store.commit("setLoading", true);

      let cpf = this.admin.cpf.replace(/\D/g, "");
      this.$http
        .patch(`admins/${this.admin.id}`, { ...this.admin, cpf: cpf })
        .then(response => {
          this.$store.commit("setSnackbar", {
            text: `Administrador #${response.data.admin.id} atualizado com sucesso`,
            color: "success"
          });
          this.$store.commit("setLoading", false);
        })
        .catch(error => {
          const errorResponse = error.response.data.errors;
          let errorArray = [];
          for (var errorInstance in errorResponse) {
            errorArray.push(errorResponse[errorInstance][0]);
          }
          errorArray = errorArray.unique().join(" ");

          this.$store.commit("setSnackbar", {
            text: `${errorArray}`,
            color: "error"
          });
          this.$store.commit("setLoading", false);
        });
    },

    getAdminFromApi() {
      this.$store.commit("setLoading", true);
      this.$http
        .get(`admins/${this.$route.params.id}`)
        .then(response => {
          this.admin = response.data.admin;
          this.$store.commit("setLoading", false);
        })
        .catch(() => {
          this.$store.commit("setLoading", false);
        });
    },

    getCoursesFromApi() {
      this.$store.commit("setLoading", true);

      this.$http
        .get(`courses`)
        .then(response => {
          this.courses = response.data.courses;
          this.$store.commit("setLoading", false);
        })
        .catch(() => {
          this.$store.commit("setLoading", false);
        });
    },

    setFooterWidth() {
      this.footerWidth = this.$refs.container.parentNode.clientWidth;
    }
  }
};
</script>
