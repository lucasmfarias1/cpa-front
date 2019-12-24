<template>
  <v-data-table
    :headers="headers"
    :items="quizzes"
    sort-by="date"
    :loading="loading"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Questionários</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark class="mb-2" to="/quiz/create">Novo</v-btn>
      </v-toolbar>
    </template>
    <template v-slot:item.action="{ item }">
      <v-icon small @click="deleteQuizz(item)">
        delete
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      headers: [
        {
          text: "Nome",
          align: "left",
          value: "name"
        },
        { text: "Número de questões", value: "date" },
        { text: "Data de criação", value: "date" },
        { text: "", value: "action", sortable: false }
      ],

      quizzes: []
    };
  },

  mounted() {
    this.$http.get("quizzes").then(response => {
      this.quizzes = response.data.quizzes;
      this.loading = false;
    });
  },

  methods: {
    deleteQuizz(quiz) {
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
    }
  }
};
</script>
