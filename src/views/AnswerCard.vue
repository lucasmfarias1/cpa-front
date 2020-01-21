<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col>
        <v-card width="100%">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Questionário {{ quiz.name }}</v-toolbar-title>
          </v-toolbar>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-card
        v-for="question in quiz.questions"
        :key="question.id"
        class="ma-4 pa-4"
        elevation="4"
        width="100%"
        max-width="550px"
      >
        <v-subheader>{{ question.body }}</v-subheader>
        <v-slider v-model="question.answer" step="1" max="5" min="1"></v-slider>
        <div class="d-flex">
          <p>Discordo totalmente</p>
          <v-spacer></v-spacer>
          <p>Concordo totalmente</p>
        </div>
      </v-card>
    </v-row>

    <v-row justify="center">
      <v-card>
        <v-btn color="primary" @click.prevent="submitAnswers">Enviar</v-btn>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      quiz: {},
      rules: {
        required: value => !!value || "Campo obrigatório"
      }
    };
  },

  mounted() {
    // if (this.$route.params.id)
    this.getQuizFromApi();
  },

  methods: {
    getQuizFromApi() {
      this.$store.commit("setLoading", true);
      this.$http
        .get(`quizzes/${this.$route.params.id}/answers/create/`)
        .then(response => {
          this.quiz = response.data.quiz;
          this.quiz.questions.forEach((question, index) => {
            this.quiz.questions[index].answer = 3;
          });
          this.$store.commit("setLoading", false);
        })
        .catch(() => {
          this.$store.commit("setSnackbar", {
            text: `Oops, algo deu errado.`,
            color: "danger"
          });
          this.$router.push("/");
          this.$store.commit("setLoading", false);
        });
    },

    submitAnswers() {
      this.$store.commit("setLoading", true);
      const answerCard = this.quiz.questions.map(question => {
        return {
          value: question.answer,
          question_id: question.id
        };
      })
      this.$http
        .post(`answer-cards`, answerCard)
    }
  }
};
</script>

<style scoped>
/*  */
</style>
