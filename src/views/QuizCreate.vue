<template>
  <v-container m-0 id="createq" ref="container">
    <v-row justify="center" class="ma-5" ref="firstrow">
      <h2 class="title">
        Novo Questionário
      </h2>
    </v-row>
    <v-row>
      <v-col>
        <v-form ref="form" id="createform" v-model="valid">
          <div ref="colq">
            <v-row class="d-flex align-center">
              <v-text-field
                :rules="[rules.required]"
                :disabled="loading"
                maxlength="191"
                class="ma-4"
                label="Título do questionário"
                v-model="quiz.name"
              >
              </v-text-field>
            </v-row>
            <v-row
              class="d-flex align-center mb-9"
              v-for="(question, index) in quiz.questions"
              :key="index"
            >
              <v-textarea
                :rules="[rules.required]"
                :disabled="loading"
                @keyup.delete="deleteEmptyQuestion(question)"
                @keydown.enter="addQuestion($event)"
                autofocus
                class="ma-4"
                rows="3"
                maxlength="191"
                counter="191"
                max-width="100%"
                :label="'Questão #' + (index + 1)"
                v-model="question.body"
                :key="index"
              >
              </v-textarea>
              <v-btn
                v-if="quiz.questions.length > 1"
                class="mr-4"
                icon
                @click="deleteQuestion(question)"
              >
                <v-icon>delete</v-icon>
              </v-btn>
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
        <v-btn class="secondary" to="/quiz">Voltar</v-btn>
        <v-btn
          class="mx-0 mx-sm-1 mx-md-5 primary"
          :disabled="loading"
          @click="addQuestion"
        >
          <span class="d-none d-sm-none d-md-inline">
            Adicionar Questão
          </span>
          <span class="d-inline d-md-none">+ Questão</span>
        </v-btn>
        <v-btn
          :disabled="loading"
          class="success"
          type="submit"
          @click.prevent="submitQuiz"
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
      footerWidth: 0,
      valid: false,
      rules: {
        required: value => !!value || "Campo obrigatório"
      },
      quiz: {
        name: "",
        questions: [{ body: "" }]
      }
    };
  },

  computed: {
    loading() {
      return this.$store.getters.isLoading;
    }
  },

  mounted() {
    if (this.$route.params.id) {
      this.getQuizFromApi();
    }

    this.$nextTick(() => {
      this.setFooterWidth();
      window.addEventListener("resize", this.setFooterWidth);
    });
  },

  methods: {
    addQuestion(event) {
      event.preventDefault();
      this.quiz.questions.push({ body: "" });
      this.$nextTick(() => {
        window.scrollBy({
          top: 999,
          behavior: "smooth"
        });
      });
    },

    deleteQuestion(question) {
      if (this.quiz.questions.length < 2) return;
      const index = this.quiz.questions.indexOf(question);
      this.quiz.questions.splice(index, 1);
    },

    deleteEmptyQuestion(question) {
      if (question.body != "") return;
      if (this.quiz.questions.length < 2) return;

      const index = this.quiz.questions.indexOf(question);
      this.quiz.questions.splice(index, 1);
      this.focusLastQuestion();
    },

    focusLastQuestion() {
      this.$nextTick(() => {
        if (this.quiz.questions.length < 1) return;
        const target = this.$refs.colq.lastElementChild.getElementsByTagName(
          "textarea"
        )[0];
        target.focus();
      });
    },

    submitQuiz() {
      if (!this.valid) {
        this.$refs.form.validate();
        this.focusFirstInvalid();
        return;
      }

      if (this.quiz.id) {
        this.updateQuiz();
      } else {
        this.storeQuiz();
      }
    },

    storeQuiz() {
      this.$store.commit("setLoading", true);
      this.$http
        .post("quizzes", this.quiz)
        .then(response => {
          this.quiz.id = response.data.quiz.id;
          this.$store.commit("setSnackbar", {
            text: `Questionário #${response.data.quiz.id} criado com sucesso`,
            color: "success"
          });
          this.$router.replace({ path: `/quiz/edit/${response.data.quiz.id}` });
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

    updateQuiz() {
      this.$store.commit("setLoading", true);
      this.$http
        .patch(`quizzes/${this.quiz.id}`, this.quiz)
        .then(response => {
          this.$store.commit("setSnackbar", {
            text: `Questionário #${response.data.quiz.id} atualizado com sucesso`,
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

    getQuizFromApi() {
      this.$store.commit("setLoading", true);
      this.$http
        .get(`quizzes/${this.$route.params.id}`)
        .then(response => {
          this.quiz = response.data.quiz;
          this.$store.commit("setLoading", false);
        })
        .catch(error => {
          console.log(error.response.data);
          this.$store.commit("setLoading", false);
        });
    },

    focusFirstInvalid(component = this) {
      if (!component.valid) {
        this.$vuetify.goTo(component);
        return true;
      }

      let focused = false;

      component.$children.some(childComponent => {
        focused = this.focusFirstStatus(childComponent);
        return focused;
      });

      return focused;
    },

    setFooterWidth() {
      this.footerWidth = this.$refs.container.parentNode.clientWidth;
    }
  }
};
</script>
