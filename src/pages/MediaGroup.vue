<template>
  <q-page>
    <q-banner v-if="isError" dense class="bg-red text-white">
      {{error}}
      <template v-slot:action>
        <q-btn flat color="white" label="Dismiss" @click="dismiss" />
      </template>
    </q-banner>
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
      <q-card v-for="mediaGroup in mediaGroups" :key="mediaGroup._id" class="my-card">
      <!-- <q-video src="https://www.youtube.com/embed/k3_tw44QsZQ?rel=0" /> -->

      <q-card-section>
        <div class="text-h6">{{mediaGroup.name}}</div>
        <div class="text-subtitle2">{{mediaGroup._id}}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        Premissions: {{mediaGroup.security.permissions}}<br>
        Path: {{mediaGroup.path}}
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat color="red" @click="deleteMediaGroup(mediaGroup._id)">Delete</q-btn>
        <q-btn type="a" :href="`/#media-groups/${mediaGroup._id}`" flat color="purple">Open</q-btn>
      </q-card-actions>
    </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { MediaGroup } from '../components/models';
import axios from 'axios';
import { Cookies, Notify } from 'quasar';
import GlobalConstants from '../constants/GlobalConstants';

interface ResponseDefault {
  data: {
    results: Array<MediaGroup>
  }
}

export default defineComponent({
  name: 'Media Group',
  data: function() {
    let mediaGroups: MediaGroup[] = []
    return {
      mediaGroups,
      isLoading: true,
      fetch_url: `${GlobalConstants.API_SERVER}/api/media-groups`,
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
        this.mediaGroups = x;
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
    deleteMediaGroup(id: string) {
      axios.delete(`${this.fetch_url}/${id}`, this.config).then((r) => {
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
