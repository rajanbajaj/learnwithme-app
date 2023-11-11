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
    <div v-if="success && !isLoading" class="row q-pa-md">
      <PostComponent
        :post="post"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Post } from '../components/models';
import axios from 'axios';
import { Cookies } from 'quasar';
import { Notify } from 'quasar'
import PostComponent from '../components/post/Post.vue';
import GlobalConstants from '../constants/GlobalConstants';

interface ResponseDefault {
  data: Post
}

export default defineComponent({
  name: 'Post Profile',
  components: { PostComponent },
  data: function() {
    return {
      post: {},
      isLoading: true,
      fetch_url: `${GlobalConstants.API_SERVER}/api/posts/${this.$route.params.id}`,
      config: {
        headers: {
          'Authorization': `Bearer ${Cookies.get('access_token')}`
        }
      },
      success: false
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      axios.get(this.fetch_url, this.config).then((r: ResponseDefault) => {
        this.post = r.data
        this.isLoading = false
        this.success = true
      }).catch(e => {
        this.isLoading = false;
        Notify.create({
          message: e.message,
          color: 'red',
        });
      })
    }
  }
});
</script>
