<template>
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">{{post.title}}</div>
        <div class="text-subtitle2">{{post.author}}</div>
      </q-card-section>

      <q-card-section class="q-pt-none" :v-html="post.body">
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat round :color="likeColor" @click="like(post._id)" icon="favorite" />
        <q-btn flat round :color="bookmarkColor" @click="bookmark(post._id)" icon="bookmark" />
        <q-btn flat round :color="shareColor" @click="share(post._id)" icon="share" />
        <q-btn type="a" :href="`/#posts/${post._id}`" flat color="purple">Visit Post</q-btn>
      </q-card-actions>
    </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {Post}  from '../models';
import { Cookies } from 'quasar';
import axios from 'axios';

export default defineComponent({
  name: 'PostShortComponent',
  props: {
    post: { type: Object as () => Post, required: true},
    icon: { type: String, default: 'article'}
  },
  data() {
    return {
      likeColor: 'default',
      bookmarkColor: 'default',
      shareColor: 'primary',
      fetch_url: `http://localhost:3000/api/posts/${this.post._id}`,
      config: {
        headers: {
          'Authorization': `Bearer ${Cookies.get('access_token')}`
        }
      },
      currentUserId: '',
      likes: 0,
      bookmarks: 0,
      isLikedByCurrentUser: 0,
      isBookmarkedByCurrentUser: 0,
    }
  },
  mounted() {
    this.currentUserId = this.parseJwt(Cookies.get('access_token')).id;

    // update likes
    axios.get(`${this.fetch_url}/likes/count`, this.config).then(res => {
      this.likes = res.data;
    }).catch(e => console.log(e));

    // update if current user liked the post
    axios.get(`${this.fetch_url}/likes/${this.currentUserId}/count`, this.config).then(res => {
      this.isLikedByCurrentUser = res.data;
      if (this.isLikedByCurrentUser) {
        this.likeColor = 'red';
      }
    }).catch(e => console.log(e));

    // update bookmarks
    axios.get(`${this.fetch_url}/bookmarks/count`, this.config).then(res => {
      this.bookmarks = res.data;
    }).catch(e => console.log(e));

    // update if current user bookmarked the post
    axios.get(`${this.fetch_url}/bookmarks/${this.currentUserId}/count`, this.config).then(res => {
      this.isBookmarkedByCurrentUser = res.data;
      if (this.isBookmarkedByCurrentUser) {
        this.bookmarkColor = 'accent';
      }
    }).catch(e => console.log(e));
  },
  methods: {
    like(id: String) {
      this.likeColor === 'default' ? this.likeColor = 'red' : this.likeColor = 'default';

      // like the post
      axios.post(`${this.fetch_url}/likes/${this.currentUserId}`, {data: ''}, this.config).then(res => {
        // update if current user liked the post
        axios.get(`${this.fetch_url}/likes/${this.currentUserId}/count`, this.config).then(res => {
          this.isLikedByCurrentUser = res.data;
          if (this.isLikedByCurrentUser) {
            this.likeColor = 'red';
          }
        }).catch(e => console.log(e));
      }).catch(e => console.log(e));
    },
    bookmark(id: String) {
      this.bookmarkColor === 'default' ? this.bookmarkColor = 'accent' : this.bookmarkColor = 'default';

      // bookmark the post
      axios.post(`${this.fetch_url}/bookmarks/${this.currentUserId}`, {data: ''}, this.config).then(res => {
        // update if current user liked the post
        axios.get(`${this.fetch_url}/bookmarks/${this.currentUserId}/count`, this.config).then(res => {
          this.isBookmarkedByCurrentUser = res.data;
          if (this.isBookmarkedByCurrentUser) {
            this.bookmarkColor = 'accent';
          }
        }).catch(e => console.log(e));
      }).catch(e => console.log(e));
    },
    share(id: String) {

    },
    parseJwt(token: String) {
      if (!token) { return; }
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse(window.atob(base64));
    }
  }
})
</script>
