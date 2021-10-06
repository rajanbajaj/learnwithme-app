<template>
  <q-page v-if="!success && !loginStatus">
    <q-input filled v-model="email" label="email" />
    <q-input filled v-model="password" label="password" type="password" />
    <q-btn :disable="isLoading" round dense flat icon="send" @click="authenticate" />
  </q-page>
  <q-page v-else>
    Page will refresh in 5 seconds. If not please click <a href="/">here</a>
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
  computed: {
    loginStatus: function () {
      return Cookies.has('access_token');
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
      let authentication_server = 'http://localhost:3000';
      axios.post(authentication_server+'/api/login', {email: this.email, password: this.password}).then(r => {
        this.accessToken = r.data.accessToken;
        Cookies.set('access_token', this.accessToken)
        // window.location.href = "/";
        this.isLoading = false;
        this.success = true;
        Notify.create({
          message: 'Successfully Logged In!',
          color: 'green',
        });
        setTimeout(() => {
          window.location.href = "/"
        }, 5000);
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
