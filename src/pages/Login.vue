<template>
  <q-page v-if="!success">
    <q-input filled v-model="email" label="email" />
    <q-input filled v-model="password" label="password" />
    <q-btn :disable="isLoading" round dense flat icon="send" @click="authenticate" />
  </q-page>
  <q-page v-else>
    Logged In go to <a href="/">Home</a>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ref } from 'vue'
import axios from 'axios';
import { Cookies } from 'quasar'
import { Notify } from 'quasar'

export default defineComponent({
  name: 'Login',
  setup() {
    return {
      email: ref(''),
      password: ref('')
    }
  },
  data() {
    return {
      isLoading: false,
      success: false,
      accessToken: '',
    };
  },
  methods: {
    authenticate() {
      this.isLoading = true;
      let authentication_server = 'http://127.0.0.1:3000';
      axios.post(authentication_server+'/api/login', {email: this.email, password: this.password}).then(r => {
        this.accessToken = r.data.accessToken;
        Cookies.set('access_token', this.accessToken)
        this.isLoading = false;
        this.success = true;
        Notify.create({
          message: 'Successfully Logged In!',
          color: 'green',
        });
      }).catch(e => {
        this.isLoading = false;
        Notify.create({
          message: e.message,
          color: 'red',
        });
      });
    }
  }
});
</script>
