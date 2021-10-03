<template>
  <q-page>
    <q-banner v-if="isError" dense class="bg-red text-white">
      {{error}}
      <template v-slot:action>
        <q-btn flat color="white" label="Dismiss" @click="dismiss" />
      </template>
    </q-banner>

    <div class="q-pa-md" style="max-width: 400px">

    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <q-input
        filled
        v-model="title"
        label="Post Title *"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />

      <q-select filled v-model="publish_status" :options="publishOptions" label="Status" />
      <q-select
        label="Tags"
        filled
        v-model="tags"
        use-input
        use-chips
        multiple
        hide-dropdown-icon
        input-debounce="0"
        new-value-mode="add-unique"
        style="width: 250px"
        :options="tagOptions"
      />

      <div class="q-pa-md q-gutter-sm">
        <q-editor
          v-model="body"
          :definitions="{
            save: {
              tip: 'Save your work',
              icon: 'save',
              label: 'Save',
              handler: saveWork
            },
            upload: {
              tip: 'Upload to cloud',
              icon: 'cloud_upload',
              label: 'Upload',
              handler: uploadIt
            }
          }"
          :toolbar="[
            ['bold', 'italic', 'strike', 'underline'],
            ['upload', 'save']
          ]"
        />
      </div>
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
  name: 'Register Post',
  setup() {
    return {
      title: ref(''),
      publish_status: ref(''),
      body: ref(''),
      author: ref(''),
    }
  },
  data() {
    return {
      isLoading: false,
      isError: false,
      error: '',
      accessToken: '',
      tags: [],
      tagOptions: [
        'blog',
        'media',
        'photography',
        'coding'
      ],
      publishOptions: [
        'DRAFT',
        'PUBLISH',
      ],
      config: {
        headers: {
          'Authorization': `Bearer ${Cookies.get('access_token')}`
        }
      },
      url: 'http://localhost:3000/api/posts'
    };
  },
  methods: {
    onSubmit() {
      let payload = {
        publish_status : this.publish_status,
        body: this.body,
        title : this.title,
        tags : this.tags.toString(),
        author: this.parseJwt(Cookies.get('access_token')).id,
      };

      axios.post(this.url, payload, this.config).then(r => {
        console.log(r);
      }).catch(e => {
        this.isError = true;
        this.error = e.message;
      });
    },

    saveWork() {
      let payload = {
        publish_status : 'DRAFT',
        body: this.body,
        title : this.title,
        tags : this.tags.toString(),
        author: this.parseJwt(Cookies.get('access_token')).id,
      };

      axios.post(this.url, payload, this.config).then(r => {
        console.log(r);
      }).catch(e => {
        this.isError = true;
        this.error = e.message;
      });
    },

    onReset () {
      this.publish_status = '';
      this.title = '';
      this.tags = '';
      this.author = '';
    },

    dismiss() {
      this.error = '';
      this.isError = false;
    },

    parseJwt(token) {
      if (!token) { return; }
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse(window.atob(base64));
    }
  }
});
</script>
