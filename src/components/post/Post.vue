<template>
  <div>
    <h1>
      <q-icon :name="icon" />
      {{post.title}}
    </h1>
    <small>{{post._id}}</small>
    <section v-html="post.body"></section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {Post}  from '../models';

export default defineComponent({
  name: 'PostComponent',
  props: {
    post: { type: Object as () => Post, required: true},
    icon: { type: String, default: 'article'}
  }
})
</script>
