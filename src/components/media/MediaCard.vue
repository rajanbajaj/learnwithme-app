<template>
    <q-card class="my-card">
      <!-- <q-video src="https://www.youtube.com/embed/k3_tw44QsZQ?rel=0" /> -->
      <q-img v-if="media.mimetype.search('image') !== -1" :src="media._embedded" :alt="media.originalname" />
      <q-video
        v-else-if="media.mimetype.search('video') !== -1"
        :src="media._embedded"
      />

      <q-card-section>
        <div class="text-h6">{{media.originalname}}</div>
        <div class="text-subtitle2">{{media._id}}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        Premissions: {{media.security.permissions}}<br>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat color="red" @click="deleteMedia(media._id)">Delete</q-btn>
        <q-btn type="a" :href="media._embedded" flat color="purple">Open</q-btn>
        <q-btn @click="copyLink(media._embedded)" flat color="blue">Copy Link</q-btn>
      </q-card-actions>
    </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {Media}  from '../models';
import axios from 'axios';
import { Cookies, Notify } from 'quasar';
import GlobalConstants from '../../constants/GlobalConstants'

export default defineComponent({
  name: 'MediaCardComponent',
  props: {
    media: { media: Object as () => Media, required: true},
  },
  data: function() {
    return {
      base_url: GlobalConstants.API_SERVER,
      config: {
        headers: {
          'Authorization': `Bearer ${Cookies.get('access_token')}`
        }
      },
    }
  },
  methods: {
    deleteMedia(id: string) {
      axios.delete(`${this.base_url}/api/media/${id}`, this.config).then((r) => {
        Notify.create({
          message: 'Successfully Deleted',
          color: 'green',
        });
      }).catch(e => {
        Notify.create({
          message: e.message,
          color: 'red',
        });
      });
    },
    copyLink(link: string) {
       const elem = document.createElement('textarea');
       elem.value = link;
       document.body.appendChild(elem);
       elem.select();
       document.execCommand('copy');
       document.body.removeChild(elem);
       Notify.create({
          message: 'Copied',
          color: 'blue',
        });
    }
  }
})
</script>
