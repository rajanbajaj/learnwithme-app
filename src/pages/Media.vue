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
      <MediaCard v-for="m in media" :key="m._id" :media="m" />
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
import MediaCard from '../components/media/MediaCard.vue';
import { watchFile } from 'fs';
import GlobalConstants from '../constants/GlobalConstants';

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
  components: {MediaUploadButton, MediaCard},
  data: function() {
    let media: Media[] = [];

    return {
      media,
      mediaGroup: {} as MediaGroup,
      isLoading: true,
      mediaGroupId: this.$route.params.id,
      fetch_url: `${GlobalConstants.API_SERVER}/api/${this.$route.params.id}/media?expand=mediaGroup`,
      base_url: `${GlobalConstants.API_SERVER}`,
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
  }
});
</script>
