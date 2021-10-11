<template>
  <q-page>
     <q-circular-progress
      v-if="isLoading"
      indeterminate
      size="90px"
      :thickness="0.2"
      color="lime"
      center-color="grey-8"
      track-color="transparent"
      class="q-ma-xl"
    />

    <div v-else class="q-pa-md row items-start q-gutter-md">
      <q-card v-for="m in media" :key="m._id" class="my-card">
        <!-- <q-video src="https://www.youtube.com/embed/k3_tw44QsZQ?rel=0" /> -->
        <q-img v-if="m.mimetype.search('image') !== -1" :src="m._embedded" :alt="m.originalname" />
        <q-video
          v-else-if="m.mimetype.search('video') !== -1"
          :src="m._embedded"
        />

        <q-card-section>
          <div class="text-h6">{{m.originalname}}</div>
          <div class="text-subtitle2">{{m._id}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Premissions: {{m.security.permissions}}<br>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat color="red" @click="deleteMedia(m._id)">Delete</q-btn>
          <q-btn type="a" :href="m._embedded" flat color="purple">Open</q-btn>
        </q-card-actions>
      </q-card>
      <div class="q-pa-l">
        <MediaUploadButton :mediaGroupId="mediaGroupId" />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Media, MediaGroup } from '../components/models';
import axios from 'axios';
import { Cookies, Notify } from 'quasar';
import MediaUploadButton from '../components/media/MediaUploadButton.vue';
import { watchFile } from 'fs';

interface ResponseDefault {
  data: {
    __links : {
      base: string,
      self: string,
      next: string,
      prev: string,
    },
    results: Array<Media>,
    mediaGroup: MediaGroup,
  }
}

export default defineComponent({
  name: 'Media',
  components: {MediaUploadButton},
  data: function() {
    let media: Media[] = [];

    return {
      media,
      mediaGroup: {} as MediaGroup,
      isLoading: true,
      mediaGroupId: this.$route.params.id,
      fetch_url: `http://localhost:3000/api/${this.$route.params.id}/media?expand=mediaGroup`,
      base_url: 'http://localhost:3000',
      config: {
        headers: {
          'Authorization': `Bearer ${Cookies.get('access_token')}`
        }
      },
      isError: false,
      error: ''
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      axios.get(this.fetch_url, this.config).then((r: ResponseDefault) => {
        let x = r.data.results;
        this.mediaGroup = r.data.mediaGroup;
        this.media = x;
        this.isLoading = false;
      }).catch(e => {
        this.isLoading = false;
        this.isError = true;
        this.error = e.message;
      });
    },
    dismiss() {
      this.error = '';
      this.isError = false;
    },
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
    }
  }
});
</script>
