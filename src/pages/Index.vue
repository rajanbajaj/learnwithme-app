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
      <PostShortComponent v-for="post in posts" :post="post" :key="post._id" class="col-md-5" />
    </div>

    <div>
      <div class="q-pa-lg flex flex-center">
        <q-pagination
          v-model="currentPage"
          color="purple"
          :max="max"
          :max-pages="maxPages"
          boundary-links
          direction-links
          icon-first="skip_previous"
          icon-last="skip_next"
          icon-prev="fast_rewind"
          icon-next="fast_forward"
        />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Post } from '../components/models';
import PostShortComponent from '../components/post/PostShort.vue';
import axios from 'axios';
import { Cookies } from 'quasar';
import GlobalConstants from '../constants/GlobalConstants';

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
      fetch_url: `${GlobalConstants.API_SERVER}/api/posts?status=PUBLIC,PUBLIC_RESTRICTED&limit=4`,
      fetch_count_url: `${GlobalConstants.API_SERVER}/api/posts/count?status=PUBLIC,PUBLIC_RESTRICTED`,
      config: {
        headers: {
          'Authorization': `Bearer ${Cookies.get('access_token')}`
        }
      },
      isError: false,
      error: '',
      currentPage: 1,
      max: 0,
      maxPages: 0 
    }
  },
  created() {
    let keyword = this.$route.query.keyword;
    if (keyword) {
      this.fetch_url = this.fetch_url + `&keyword=${keyword}`
      this.fetch_count_url = this.fetch_count_url + `&keyword=${keyword}`
    }
    this.getData();
    this.getCount();
  },
  watch: {
    currentPage: function () {
      this.getData();
    }
  },
  methods: {
    getData() {
      axios.get(this.fetch_url + `&start=${(this.currentPage-1) * 4}`, this.config).then((r: ResponseDefault) => {
        let x = r.data.results
        this.posts = x
        this.isLoading = false
      }).catch(e => {
        this.isLoading = false;
        this.isError = true;
        this.error = e.message;
      });
    },

    getCount() {
      axios.get(this.fetch_count_url, this.config).then(r => {
        let x = r.data
        this.max = Math.ceil(x/4)
        this.maxPages = Math.ceil(x/8)
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
    },

    parseJwt(token: string) {
      if (!token) { return; }
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse(window.atob(base64));
    },
  }
});
</script>
