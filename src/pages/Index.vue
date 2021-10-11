<template>
  <q-page class="row items-center justify-evenly">
    Home page
    <SpeechRecognitionComponent />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SpeechRecognitionComponent from '../components/ml/SpeechRecognition.vue';

export default defineComponent({
  name: 'Home',
  components: {SpeechRecognitionComponent},
});
</script>
