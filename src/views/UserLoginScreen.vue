<template>
  <v-container class="fill-height">
    <v-container>
      <v-row align="center" justify="center">
        <user-login></user-login>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import UserLogin from "../components/UserLogin.vue";

export default {
  data() {
    return {
      //
    };
  },

  components: {
    UserLogin
  },

  methods: {
    //
  }
};
</script>

<style scoped>
/*  */
</style>
