<template>
  <v-data-table
    :headers="headers"
    :items="admins"
    :options.sync="options"
    :server-items-length="totalAdmins"
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
          Administradores
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark class="mb-2" to="/admins/create"
          >Novo</v-btn
        >
      </v-toolbar>
    </template>

    <template v-slot:item.created_at="{ item }">
      <span>{{ moment(item.created_at).calendar() }}</span>
    </template>

    <template v-slot:item.action="{ item }">
      <v-btn
        title="Deletar admin"
        class="mx-1"
        icon
        @click="deleteAdmin(item)"
        v-if="!item.is_master"
      >
        <v-icon>delete</v-icon>
      </v-btn>

      <v-btn
        title="Editar admin"
        class="mx-1"
        icon
        :to="'/admins/edit/' + item.id"
      >
        <v-icon>edit</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: [],

  data() {
    return {
      totalAdmins: 0,
      admins: [],
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
          text: "CPF",
          value: "cpf"
        },
        { text: "Data de criação", value: "created_at" },
        { text: "Ações", value: "action", sortable: false }
      ]
    };
  },

  computed: {
    loading() {
      return this.$store.getters.isLoading;
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
    deleteAdmin(admin) {
      if (confirm("Tem certeza que quer deletar este administrador?")) {
        this.$store.commit("setLoading", true);
        this.$http
          .delete("admins/" + admin.id)
          .then(() => {
            this.getDataFromApi();
            this.$store.commit("setSnackbar", {
              text: `Administrador #${admin.id} deletado com sucesso.`,
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
        .get("admins", { params: options })
        .then(response => {
          this.totalAdmins = response.data.admins.total;
          this.admins = response.data.admins.data;
          this.$store.commit("setLoading", false);
        })
        .catch(() => {
          this.$store.commit("setLoading", false);
        });
    }
  }
};
</script>
