<template>
  <v-container class="fill-height">
    <v-container>
      <v-row align="center" justify="center">
        <v-col align="center">
          <v-card class="py-1">
            <v-progress-circular
              v-if="$store.getters.isLoading"
              indeterminate
              color="primary"
            ></v-progress-circular>
            <v-simple-table v-else>
              <template v-slot:default>
                <thead>
                  <tr v-if="availableQuizzes.length > 0">
                    <th class="text-left">Questionário</th>
                    <th class="text-left">Número de questões</th>
                    <th class="text-left">Data limite</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody v-if="availableQuizzes.length > 0">
                  <tr v-for="quiz in availableQuizzes" :key="quiz.id">
                    <td>{{ quiz.name }}</td>
                    <td>{{ quiz.question_count }}</td>
                    <td>
                      {{
                        moment(quiz.deadline)
                          .endOf("day")
                          .calendar()
                      }}
                    </td>
                    <td>
                      <v-btn
                        @click="checkUserCanAnswer(quiz.id)"
                        text
                        class="primary"
                      >
                        Responder questionário
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <th colspan="3">
                      <h3 class="title text-center">
                        Nenhum questionário ativo no momento
                      </h3>
                    </th>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      quizzes: []
    };
  },

  mounted() {
    this.getQuizzesFromApi();
  },

  computed: {
    availableQuizzes() {
      return this.quizzes.filter(quiz => quiz.is_available);
    }
  },

  components: {
    //
  },

  methods: {
    checkUserCanAnswer(quizId) {
      if (!this.$store.getters.isLoggedIn) {
        this.$store.commit("setSnackbar", {
          text: `Por favor faça login para responder ao questionário.`,
          color: "secondary"
        });
        this.$router.push("/user-login");
      } else if (this.$store.getters.currentUser.is_admin) {
        this.$store.commit("setSnackbar", {
          text: `Administradores não podem responder questionários.`,
          color: "error"
        });
      } else {
        this.$store.commit("setLoading", true);
        this.$http
          .get(`quizzes/${quizId}/check`)
          .then(() => {
            this.$router.push(`/answer-card/${quizId}`);
            this.$store.commit("setLoading", false);
          })
          .catch(() => {
            this.$store.commit("setSnackbar", {
              text: `Você já respondeu a este questionário.`,
              color: "error"
            });
            this.$store.commit("setLoading", false);
          });
      }
    },

    getQuizzesFromApi() {
      this.$store.commit("setLoading", true);
      this.$http.get("/active-quizzes").then(response => {
        this.quizzes = response.data.quizzes;
        this.$store.commit("setLoading", false);
      });
    }
  }
};
</script>

<style scoped>
/*  */
</style>
