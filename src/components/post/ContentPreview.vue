<template>
    <q-card class="my-card">
      <q-card-section v-html="this.content">
      </q-card-section>
    </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ContentPreviewComponent',
  props: {
    content: { type: String, default: ''}
  },
})
</script>
