<template>
  <v-row justify="center">
    <v-dialog v-model="open" persistent>
      <v-card>
        <v-card-text class="py-4">
          <h3 class="display-1 mb-2 text-center">
            Ativar questionário #{{ quiz.id }}
          </h3>
          <h4 class="title text-center">Selecione a data limite</h4>
          <v-form @submit.prevent="submit">
            <v-row justify="center">
              <v-date-picker v-model="deadline"></v-date-picker>
            </v-row>
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
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>
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
