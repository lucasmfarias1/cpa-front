<template>
  <v-container class="fill-height" fluid>
    <v-container>
      <v-row align="center" justify="center">
        <admin-login></admin-login>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import AdminLogin from "../components/AdminLogin.vue";

export default {
  data() {
    return {
      //
    };
  },

  components: {
    AdminLogin
  },

  methods: {
    //
  }
};
</script>

<style scoped>
/*  */
</style>
