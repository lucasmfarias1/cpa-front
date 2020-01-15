<template>
  <v-row justify="center">
    <v-dialog v-model="open" persistent max-width="500px">
      <v-card>
        <v-card-text class="pa-4">
          <v-form @submit.prevent="submit">
            <v-row>
              <v-col cols="12">
                <h3 class="display-1 mb-2 text-center">
                  Ativar questionário
                </h3>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" lg="6" align="center">
                <v-card align="left" class="mx-auto" outlined>
                  <v-list-item three-line>
                    <v-list-item-content>
                      <div class="overline mb-2">
                        Questionário #{{ quiz.id }}
                      </div>
                      <v-list-item-title class="title mb-0">
                        {{ quiz.name }}
                      </v-list-item-title>
                      <v-list-item-subtitle class="subtitle-1">
                        Número de questões: {{ quiz.question_count }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle class="subtitle-1">
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </v-col>
              <v-col cols="12" lg="6" align="center">
                <h4 class="title text-center">Selecione a data limite</h4>
                <v-date-picker v-model="deadline"></v-date-picker>
              </v-col>
            </v-row>

            <v-row align="center">
              <v-col cols="12">
                <div class="text-center mt-2">
                  <p class="title red--text text--accent-4">
                    Atenção: uma vez ativado, o questionário estará
                    disponível para qualquer aluno responder.
                  </p>
                </div>
              </v-col>
            </v-row>

            <v-row align="center">
              <v-col cols="12">
                <div class="text-center mt-2">
                  <v-btn class="mx-2" color="primary" type="submit"
                    >Ativar questionário</v-btn
                  >
                  <v-btn
                    class="mx-2"
                    color="secondary darken-1"
                    text
                    @click="$emit('closeModal')"
                  >
                    Fechar
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: ["quiz", "open"],

  data() {
    return {
      deadline: null
    };
  },

  methods: {
    submit() {
      alert("submit");
    }
  }
};
</script>
