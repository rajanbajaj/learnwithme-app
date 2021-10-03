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
    <div class="row" v-else>
      <q-card v-for="post in posts" :key="post._id" class="my-card">
        <q-item>
          <q-item-section>
            <q-item-label>{{post.title}}</q-item-label>
            <q-item-label caption>{{post._id}}</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-card-actions align="right">
          <q-btn type="a" :href="`/#posts/${post._id}`" flat color="purple">Visit Post</q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Post } from '../components/models';
import axios from 'axios';
import { Cookies } from 'quasar';

interface ResponseDefault {
  data: {
    results: Array<Post>
  }
}

export default defineComponent({
  name: 'Posts',
  data: function() {
    let posts: Post[] = []
    return {
      posts,
      isLoading: true,
      fetch_url: 'http://localhost:3000/api/posts',
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
    this.getData()
  },
  methods: {
    getData() {
      axios.get(this.fetch_url, this.config).then((r: ResponseDefault) => {
        let x = r.data.results
        this.posts = x
        this.isLoading = false
      }).catch(e => {
        this.isLoading = false;
        this.isError = true;
        this.error = e.message;
      });
    },
    dismiss() {
      this.error = '';
      this.isError = false;
    }
  }
});
</script>
