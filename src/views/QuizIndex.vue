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
        <v-toolbar-title>
          Questionários
          <span v-if="archived">Arquivados</span>
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-btn
          v-if="!archived"
          color="primary"
          dark
          class="mb-2"
          to="/quiz/create"
          >Novo</v-btn
        >
      </v-toolbar>
    </template>

    <template v-slot:item.status="{ item }">
      <v-chip
        class="ma-2"
        :color="statusChips[item.status].color"
        :text-color="statusChips[item.status].textColor"
      >
        {{ statusChips[item.status].text }}
      </v-chip>
    </template>

    <template v-slot:item.created_at="{ item }">
      <span>{{ moment(item.created_at).calendar() }}</span>
    </template>

    <template v-slot:item.action="{ item }">
      <v-btn
        title="Deletar questionário"
        class="mx-1"
        icon
        @click="deleteQuiz(item)"
        v-if="item.status == 0 && userCanEdit(item)"
      >
        <v-icon>delete</v-icon>
      </v-btn>

      <v-btn
        title="Editar questionário"
        class="mx-1"
        icon
        v-if="item.status == 0 && userCanEdit(item)"
        :to="'/quiz/edit/' + item.id"
      >
        <v-icon>edit</v-icon>
      </v-btn>

      <v-btn
        title="Ativar questionário"
        class="mx-1"
        icon
        @click.prevent="openModal(item)"
        v-if="item.status == 0 && userCanEdit(item)"
      >
        <v-icon>send</v-icon>
      </v-btn>

      <v-btn
        title="Encerrar questionário"
        class="mx-1"
        icon
        @click.prevent="finishQuiz(item)"
        v-if="item.status == 1 && userCanEdit(item)"
      >
        <v-icon>mdi-flag-checkered</v-icon>
      </v-btn>

      <v-btn
        title="Arquivar/desarquivar questionário"
        class="mx-1"
        icon
        @click.prevent="archiveQuiz(item)"
        v-if="(item.status == 2 || item.status == 3) && userCanEdit(item)"
      >
        <v-icon>mdi-file-cabinet</v-icon>
      </v-btn>

      <v-btn
        title="Mostrar resultados"
        class="mx-1"
        icon
        :to="`/quiz/${item.id}/results`"
        v-if="item.status == 2 || item.status == 3"
      >
        <v-icon>mdi-clipboard-check</v-icon>
      </v-btn>

      <quiz-modal
        :quiz="modalQuiz"
        :open="modalOpen"
        @closeModal="modalClosedHandler"
      ></quiz-modal>
    </template>
  </v-data-table>
</template>

<script>
import QuizModal from "../components/QuizModal.vue";

export default {
  components: {
    QuizModal
  },

  props: ["archived"],

  data() {
    return {
      modalOpen: false,
      modalQuiz: {},
      totalQuizzes: 0,
      quizzes: [],
      options: {},
      headers: [
        {
          text: "ID",
          align: "left",
          value: "id"
        },
        {
          text: "Nome",
          align: "left",
          value: "name"
        },
        {
          text: "Curso",
          value: "course_name"
        },
        {
          text: "Status",
          value: "status"
        },
        {
          text: "Número de questões",
          value: "question_count",
          sortable: false
        },
        { text: "Data de criação", value: "created_at" },
        { text: "Ações", value: "action", sortable: false }
      ],
      statusChips: [
        { text: "Pendente", color: "default", textColor: "#000" },
        { text: "Ativo", color: "primary", textColor: "#fff" },
        { text: "Encerrado", color: "green", textColor: "#fff" },
        { text: "Arquivado", color: "grey", textColor: "#fff" }
      ]
    };
  },

  computed: {
    loading() {
      return this.$store.getters.isLoading;
    },

    currentUser() {
      return this.$store.getters.currentUser;
    }
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
      if (confirm("Tem certeza que quer deletar este questionário?")) {
        this.$store.commit("setLoading", true);
        this.$http
          .delete("quizzes/" + quiz.id)
          .then(() => {
            // this.quizzes.splice(index, 1);
            this.getDataFromApi();
            this.$store.commit("setSnackbar", {
              text: `Questionário #${quiz.id} deletado com sucesso.`,
              color: "success"
            });
            this.$store.commit("setLoading", false);
          })
          .catch(() => {
            this.$store.commit("setSnackbar", {
              text: "Oops, algo deu errado. Por favor tente novamente.",
              color: "error"
            });
            this.$store.commit("setLoading", false);
          });
      }
    },

    getDataFromApi() {
      this.$store.commit("setLoading", true);

      const options = this.archived
        ? { ...this.options, archived: true }
        : this.options;

      this.$http
        .get("quizzes", { params: options })
        .then(response => {
          this.totalQuizzes = response.data.quizzes.total;
          this.quizzes = response.data.quizzes.data;
          this.$store.commit("setLoading", false);
        })
        .catch(() => {
          this.$store.commit("setLoading", false);
        });
    },

    openModal(quiz) {
      if (quiz.status == 0) {
        this.modalQuiz = quiz;
        this.modalOpen = true;
      }
    },

    modalClosedHandler(event, refresh = false) {
      if (refresh) this.getDataFromApi();
      this.modalOpen = false;
    },

    finishQuiz(quiz) {
      if (confirm("Tem certeza que quer encerrar este questionário?")) {
        this.$store.commit("setLoading", true);
        this.$http
          .post(`quizzes/${quiz.id}/finish`)
          .then(() => {
            this.getDataFromApi();
            this.$store.commit("setSnackbar", {
              text: `Questionário #${quiz.id} encerrado com sucesso.`,
              color: "success"
            });
            this.$store.commit("setLoading", false);
          })
          .catch(() => {
            this.$store.commit("setSnackbar", {
              text: "Oops, algo deu errado. Por favor tente novamente.",
              color: "error"
            });
            this.$store.commit("setLoading", false);
          });
      }
    },

    archiveQuiz(quiz) {
      this.$store.commit("setLoading", true);
      this.$http
        .post(`quizzes/${quiz.id}/archive`)
        .then(() => {
          this.getDataFromApi();
          const verb = quiz.status == 2 ? "arquivado" : "desarquivado";
          this.$store.commit("setSnackbar", {
            text: `Questionário #${quiz.id} ${verb}.`,
            color: "success"
          });
          this.$store.commit("setLoading", false);
        })
        .catch(() => {
          this.$store.commit("setSnackbar", {
            text: "Oops, algo deu errado. Por favor tente novamente.",
            color: "error"
          });
          this.$store.commit("setLoading", false);
        });
    },

    userCanEdit(quiz) {
      return (
        this.currentUser.is_master ||
        this.currentUser.course.id == quiz.course_id
      );
    }
  }
};
</script>
