<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-card width="100%" max-width="700px">
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>Questionário {{ quiz.name }}</v-toolbar-title>
        </v-toolbar>

        <v-card-text
          v-for="question in quiz.questions"
          :key="question.id"
          class="mb-5"
        >
          <v-subheader>{{ question.body }}</v-subheader>
          <v-slider
            v-model="answer_card.answers[question.body.id].value"
            :rules="rules"
            step="1"
            :max="4"
          ></v-slider>
          <div class="d-flex">
            <p>Discordo totalmente</p>
            <v-spacer></v-spacer>
            <p>Concordo totalmente</p>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary">Continuar</v-btn>
        </v-card-actions>
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

  methods: {
    //
  }
};
</script>

<style scoped>
/*  */
</style>
