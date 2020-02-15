<template>
  <v-container m-0 id="createq" ref="container">
    <v-row justify="center" class="ma-5" ref="firstrow">
      <h2 class="title">
        <span v-if="quiz.id">Editar</span>
        <span v-else>Novo</span>
        Questionário
      </h2>
    </v-row>
    <v-row>
      <v-col>
        <v-form ref="form" id="createform" v-model="valid">
          <div ref="colq">
            <v-row class="d-flex align-center">
              <v-col>
                <v-select
                  :items="courses"
                  :readonly="!currentUser.is_master"
                  label="Curso"
                  v-model="quiz.course_id"
                  item-text="shorthand"
                  item-value="id"
                >
                </v-select>
              </v-col>
            </v-row>
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
          :loading="loading"
          @click="addQuestion"
        >
          <span class="d-none d-sm-none d-md-inline">
            Adicionar Questão
          </span>
          <span class="d-inline d-md-none">+ Questão</span>
        </v-btn>
        <v-btn
          :loading="loading"
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
        questions: [{ body: "" }],
        course_id: 0
      },
      courses: []
    };
  },

  computed: {
    loading() {
      return this.$store.getters.isLoading;
    },

    currentUser() {
      return this.$store.getters.currentUser;
    }
  },

  mounted() {
    if (this.currentUser.is_master) {
      this.getCoursesFromApi();
    } else {
      this.courses = [this.currentUser.course];
      this.quiz.course_id = this.currentUser.course.id;
    }

    if (this.$route.params.id) {
      this.getQuizFromApi();
    }

    this.$nextTick(() => {
      this.setFooterWidth();
      window.addEventListener("resize", this.setFooterWidth);
    });
  },

  destroyed() {
    window.removeEventListener("resize", this.setFooterWidth);
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
        this.$store.commit("setSnackbar", {
          text: `Por favor não deixe campos vazios no formulário.`,
          color: "error"
        });
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

      let quiz = { ...this.quiz };
      if (quiz.course_id == 0) delete quiz.course_id;

      this.$http
        .post("quizzes", quiz)
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

      let quiz = { ...this.quiz };
      if (quiz.course_id == 0) delete quiz.course_id;

      this.$http
        .patch(`quizzes/${this.quiz.id}`, quiz)
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
          const course_id =
            response.data.quiz.course_id == null
              ? 0
              : response.data.quiz.course_id;
          this.quiz = { ...response.data.quiz, course_id: course_id };
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
          this.courses = [
            ...response.data.courses,
            { id: 0, shorthand: "TODOS" }
          ];
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
