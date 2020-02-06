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
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <h3 class="title">Filtros</h3>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="filters.min_age"
                        clearable
                        label="Idade Mínima"
                        type="number"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="filters.max_age"
                        clearable
                        label="Idade Máxima"
                        type="number"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-divider></v-divider>

                  <v-row>
                    <v-col>
                      <h4>Curso</h4>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col v-for="course in courses" :key="course.id">
                      <v-checkbox
                        v-model="filters.courses"
                        :label="course.shorthand"
                        :value="course.id"
                      ></v-checkbox>
                    </v-col>
                  </v-row>

                  <v-divider></v-divider>

                  <v-row>
                    <v-col>
                      <h4>Ciclo</h4>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col v-for="term in terms" :key="term">
                      <v-checkbox
                        v-model="filters.terms"
                        :label="`${term}º`"
                        :value="term"
                      ></v-checkbox>
                    </v-col>
                  </v-row>

                  <v-divider></v-divider>

                  <v-row>
                    <v-col>
                      <h4>Sexo</h4>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col v-for="sex in sexes" :key="sex.value">
                      <v-checkbox
                        v-model="filters.sexes"
                        :label="sex.text"
                        :value="sex.value"
                      ></v-checkbox>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col>
                      <v-btn :loading="loading" @click="getResultsFromApi">
                        Filtrar
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
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
      filters: {
        courses: [],
        terms: [1, 2, 3, 4, 5, 6],
        sexes: ["male", "female"],
        min_age: null,
        max_age: null
      },
      terms: [1, 2, 3, 4, 5, 6],
      sexes: [
        { value: "male", text: "Masculino" },
        { value: "female", text: "Feminino" }
      ],
      search: "",
      filter: {},
      courses: [],
      sortDesc: false,
      sortBy: "name",
      keys: [
        "Concordam",
        "Concordam parcialmente",
        "Neutros",
        "Discordam parcialmente",
        "Discordam"
      ]
    };
  },

  mounted() {
    this.getCoursesFromApi();
    this.getResultsFromApi();
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
    getResultsFromApi() {
      this.$store.commit("setLoading", true);

      this.$http
        .post(`quizzes/${this.$route.params.id}/results`, {
          filters: this.filters
        })
        .then(response => {
          this.quiz = response.data.quiz;
          this.results = response.data.results;
          this.$store.commit("setLoading", false);
        })
        .catch(() => {
          this.$store.commit("setLoading", false);
        });
    },

    getCoursesFromApi() {
      this.$store.commit("setLoading", true);

      this.$http
        .get(`courses`)
        .then(response => {
          this.courses = response.data.courses;
          this.filters.courses = response.data.courses.map(course => course.id);
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
