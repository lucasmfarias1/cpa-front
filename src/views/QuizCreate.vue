<template>
  <v-container id="createq">
    <v-row>
      <v-col>
        <v-form id="createform">
          <div ref="colq">
            <v-row
              class="d-flex align-center"
              v-for="(question, index) in questions"
              :key="index"
            >
              <v-textarea
                @keyup.delete="deleteEmptyQuestion(question)"
                @keydown.enter="addQuestion($event)"
                autofocus
                class="ma-4"
                rows="3"
                max-width="100%"
                :label="'Questão #' + (index + 1)"
                v-model="question.body"
                :key="index"
              >
              </v-textarea>
              <v-btn class="mr-4" icon @click="deleteQuestion(question)">
                <v-icon>delete</v-icon>
              </v-btn>
            </v-row>
          </div>
          <v-row class="d-flex justify-center">
            <v-btn class="secondary" to="/quiz">Voltar</v-btn>
            <v-btn class="mx-0 mx-sm-1 mx-md-5 primary" @click="addQuestion"
              ><span class="d-none d-sm-none d-md-inline"
                >Adicionar Questão</span
              >
              <span class="d-inline d-md-none">+ Questão</span></v-btn
            >
            <v-btn class="success">Salvar</v-btn>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      items: [
        "Múltipla escolha",
        "Slider",
        "Dissertativa",
        "Verdadeiro ou Falso"
      ],
      questions: [{ body: "" }],
      picker: new Date().toISOString().substr(0, 10)
    };
  },

  methods: {
    addQuestion(event) {
      event.preventDefault();
      this.questions.push({ body: "" });
      this.$nextTick(() => {
        window.scrollBy({
          top: 999,
          behavior: "smooth"
        });
      });
    },

    deleteQuestion(question) {
      if (this.questions.length < 2) return;
      const index = this.questions.indexOf(question);
      this.questions.splice(index, 1);
    },

    deleteEmptyQuestion(question) {
      if (question.body != "") return;
      if (this.questions.length < 2) return;

      const index = this.questions.indexOf(question);
      this.questions.splice(index, 1);
      this.focusLastQuestion();
    },

    focusLastQuestion() {
      this.$nextTick(() => {
        if (this.questions.length < 1) return;
        const target = this.$refs.colq.lastElementChild.getElementsByTagName(
          "textarea"
        )[0];
        target.focus();
      });
    }
  }
};
</script>
