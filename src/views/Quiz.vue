<template>
  <v-data-table
    :headers="headers"
    :items="quizzes"
    sort-by="date"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Novo Questionário</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark class="mb-2" to="/quiz/create">Novo</v-btn>
      </v-toolbar>
    </template>
    <template v-slot:item.action="{ item }">
      <v-icon small @click="deleteItem(item)">
        delete
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        {
          text: "Nome",
          align: "left",
          value: "name"
        },
        { text: "Início", value: "date" },
        { text: "Fim", value: "date" },
        { text: "", value: "action", sortable: false }
      ],

      quizzes: [
        { name: "test1", desc: "the first", date: "13/05/2009" },
        { name: "asdf", desc: "the second", date: "13/05/2012" },
        { name: "test1", desc: "the first", date: "13/05/2009" },
        { name: "asdf", desc: "the second", date: "13/05/2012" },
        { name: "test1", desc: "the first", date: "13/05/2009" },
        { name: "asdf", desc: "the second", date: "13/05/2012" },
        { name: "test1", desc: "the first", date: "13/05/2009" },
        { name: "asdf", desc: "the second", date: "13/05/2012" },
        { name: "test1", desc: "the first", date: "13/05/2009" },
        { name: "asdf", desc: "the second", date: "13/05/2012" },
        { name: "?Xd", desc: "the third", date: "13/05/2002" }
      ]
    };
  },

  methods: {
    deleteItem(item) {
      const index = this.quizzes.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.quizzes.splice(index, 1);
    }
  }
};
</script>
