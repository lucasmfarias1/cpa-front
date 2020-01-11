<template>
  <v-data-table
    :headers="headers"
    :items="quizzes"
    :options.sync="options"
    :server-items-length="totalQuizzes"
    :loading="loading"
    class="elevation-1"
    sort-by="name"
    :footer-props="{
      itemsPerPageOptions: [10, 20, 50]
    }"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Questionários</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark class="mb-2" to="/quiz/create">Novo</v-btn>
      </v-toolbar>
    </template>

    <template v-slot:item.created_at="{ item }">
      <span>{{ moment(item.created_at).calendar() }}</span>
    </template>

    <template v-slot:item.action="{ item }">
      <v-btn class="mx-1" icon @click="deleteQuiz(item)">
        <v-icon>
          delete
        </v-icon>
      </v-btn>

      <v-btn class="mx-1" icon :to="'/quiz/edit/' + item.id">
        <v-icon>edit</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      totalQuizzes: 0,
      quizzes: [],
      options: {},
      headers: [
        {
          text: "Nome",
          align: "left",
          value: "name"
        },
        {
          text: "Número de questões",
          value: "question_count",
          sortable: false
        },
        { text: "Data de criação", value: "created_at" },
        { text: "", value: "action", sortable: false }
      ]
    };
  },

  watch: {
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true
    }
  },

  mounted() {
    this.getDataFromApi();
  },

  methods: {
    deleteQuiz(quiz) {
      const index = this.quizzes.indexOf(quiz);
      if (confirm("Are you sure you want to delete this quiz?")) {
        this.$http
          .delete("quizzes/" + quiz.id)
          .then(response => {
            console.log(response.data);
            this.quizzes.splice(index, 1);
          })
          .catch(error => {
            console.log(error);
          });
      }
    },

    getDataFromApi() {
      this.loading = true;
      this.$http.get("quizzes", { params: this.options }).then(response => {
        this.totalQuizzes = response.data.quizzes.total;
        this.quizzes = response.data.quizzes.data;
        this.loading = false;
      });
    }
  }
};
</script>
