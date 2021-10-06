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
    <PostShortComponent v-for="post in posts" :post="post" :key="post._id" class="q-py-5"/>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Post } from '../components/models';
import PostShortComponent from '../components/post/PostShort.vue';
import axios from 'axios';
import { Cookies } from 'quasar';

interface ResponseDefault {
  data: {
    results: Array<Post>
  }
}

export default defineComponent({
  name: 'Posts',
  components: {PostShortComponent},
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
