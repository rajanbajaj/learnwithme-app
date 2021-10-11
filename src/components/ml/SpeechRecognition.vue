<template>
    <q-card class="my-card">
      <div>{{content}}</div>
      <q-btn @click="startRecognizeAndConvertToText"><q-icon name="mic" />START</q-btn>
      <q-btn @click="stopRecognizeAndConvertToText"><q-icon name="mic" />STOP</q-btn>
    </q-card>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { ref } from 'vue'

  declare global {
    interface Window {
        SpeechRecognition:any;
        webkitSpeechRecognition:any;
    }
  }

  export default defineComponent({
    name: 'SpeechRecognitionComponent',
    setup() {
      let content = 'Stop';
      return {
        content: ref(content),
      };
    },
    methods: {
      startRecognizeAndConvertToText() {
         this.content = 'Start';
      },
      stopRecognizeAndConvertToText() {
         this.content = 'Stop';
      }
    }
  })
</script>
