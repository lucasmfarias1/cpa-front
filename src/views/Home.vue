<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col align="center">
        <v-card>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Questionário</th>
                  <th class="text-left">Número de questões</th>
                  <th class="text-left">Data limite</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="quiz in quizzes" :key="quiz.id">
                  <td>{{ quiz.name }}</td>
                  <td>{{ quiz.question_count }}</td>
                  <td>{{ quiz.deadline }}</td>
                  <td>
                    <v-btn :to="`/answer-card/${quiz.id}`" text class="primary">
                      Responder questionário
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>
    </v-row>
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

  components: {
    //
  },

  methods: {
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
