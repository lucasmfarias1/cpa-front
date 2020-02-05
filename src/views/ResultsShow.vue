<template>
  <v-container fluid>
    <v-data-iterator
      :items="items"
      :search="search"
      :sort-by="sortBy.toLowerCase()"
      :sort-desc="sortDesc"
      hide-default-footer
    >
      <template v-slot:header>
        <v-card>
          <v-toolbar dark color="blue darken-3" class="mb-1">
            <v-text-field
              v-model="search"
              clearable
              flat
              solo-inverted
              hide-details
              prepend-inner-icon="search"
              label="Buscar"
            ></v-text-field>
            <template v-if="$vuetify.breakpoint.mdAndUp">
              <v-spacer></v-spacer>
              <v-select
                v-model="sortBy"
                flat
                hide-details
                :items="keys"
                prepend-inner-icon="sort"
                label="Ordenar por"
              ></v-select>
              <v-spacer></v-spacer>
              <v-btn-toggle v-model="sortDesc" mandatory>
                <v-btn large depressed color="blue" :value="false">
                  <v-icon>mdi-arrow-up</v-icon>
                </v-btn>
                <v-btn large depressed color="blue" :value="true">
                  <v-icon>mdi-arrow-down</v-icon>
                </v-btn>
              </v-btn-toggle>
            </template>
          </v-toolbar>

          <v-card-text>
            <h4 class="title">Filtros</h4>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="search"
                  clearable
                  flat
                  solo-inverted
                  hide-details
                  prepend-inner-icon="search"
                  label="Buscar"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="search"
                  clearable
                  flat
                  solo-inverted
                  hide-details
                  prepend-inner-icon="search"
                  label="Buscar"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="search"
                  clearable
                  flat
                  solo-inverted
                  hide-details
                  prepend-inner-icon="search"
                  label="Buscar"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="search"
                  clearable
                  flat
                  solo-inverted
                  hide-details
                  prepend-inner-icon="search"
                  label="Buscar"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </template>

      <template v-slot:default="props">
        <v-row>
          <v-col
            v-for="item in props.items"
            :key="item.name"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card>
              <v-card-title class="subheading font-weight-bold">{{
                item.name
              }}</v-card-title>

              <v-divider></v-divider>

              <v-list dense>
                <v-list-item v-for="(key, index) in filteredKeys" :key="index">
                  <v-list-item-content :class="{ 'blue--text': sortBy === key }"
                    >{{ key }}:</v-list-item-content
                  >
                  <v-list-item-content
                    class="align-end"
                    :class="{ 'blue--text': sortBy === key }"
                    >{{ item[key.toLowerCase()] }}</v-list-item-content
                  >
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      quiz: {},
      results: [],
      search: "",
      filter: {},
      sortDesc: false,
      sortBy: "name",
      keys: [
        "Concordam",
        "Concordam parcialmente",
        "Neutros",
        "Discordam parcialmente",
        "Discordam"
      ],
      legacyItems: [
        {
          name: "Questão asdqwf dwqkjd dw wdqjwifw wjd dw.",
          discordam: "14%",
          "discordam parcialmente": "14%",
          neutros: "14%",
          "concordam parcialmente": "14%",
          concordam: "14%"
        }
      ]
    };
  },

  mounted() {
    this.getDataFromApi();
  },

  computed: {
    filteredKeys() {
      return this.keys.filter(key => key !== `Name`);
    },

    loading() {
      return this.$store.getters.isLoading;
    },

    items() {
      return this.results.map(item => {
        return {
          name: item.questionBody,
          discordam: `${item.questionResults.disagree * 100}%`,
          "discordam parcialmente": `${item.questionResults.disagree_partial *
            100}%`,
          neutros: `${item.questionResults.neutral * 100}%`,
          "concordam parcialmente": `${item.questionResults.agree_partial *
            100}%`,
          concordam: `${item.questionResults.agree * 100}%`
        };
      });
    }
  },

  methods: {
    getDataFromApi() {
      this.$store.commit("setLoading", true);

      this.$http
        .post(`quizzes/${this.$route.params.id}/results`)
        .then(response => {
          this.quiz = response.data.quiz;
          this.results = response.data.results;
          this.$store.commit("setLoading", false);
        })
        .catch(() => {
          this.$store.commit("setLoading", false);
        });
    },

    percent(number) {
      return `${number * 100}%`;
    }
  }
};
</script>
