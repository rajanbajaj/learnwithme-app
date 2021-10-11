<template>
  <q-page>
    <q-banner v-if="isError" dense class="bg-red text-white">
      {{error}}
      <template v-slot:action>
        <q-btn flat color="white" label="Dismiss" @click="dismiss" />
      </template>
    </q-banner>

    <div class="q-pa-md">

    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <q-input
        filled
        v-model="name"
        label="Media Group Name *"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />

      <q-select filled v-model="path" :options="pathOptions" label="Path" />
      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>

  </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { ref } from 'vue'
import { Cookies } from 'quasar';

export default defineComponent({
  name: 'Register Media Group',
  setup() {
    return {
      name: ref(''),
      path: ref(''),
    }
  },
  data() {
    return {
      isLoading: false,
      isError: false,
      error: '',
      accessToken: '',
      pathOptions: [
        '/image',
        '/video',
        '/other'
      ],
      config: {
        headers: {
          'Authorization': `Bearer ${Cookies.get('access_token')}`
        }
      },
      url: 'http://localhost:3000/api/media-groups'
    };
  },
  methods: {
    onSubmit() {
      let payload = {
        name: this.name,
        path : this.path,
        owner: this.parseJwt(Cookies.get('access_token')).id,
      };

      axios.post(this.url, payload, this.config).then(r => {
        console.log(r);
      }).catch(e => {
        this.isError = true;
        this.error = e.message;
      });
    },

    onReset () {
      this.name = '';
      this.path = '';
    },

    dismiss() {
      this.error = '';
      this.isError = false;
    },

    parseJwt(token: string) {
      if (!token) { return; }
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse(window.atob(base64));
    }
  }
});
</script>
