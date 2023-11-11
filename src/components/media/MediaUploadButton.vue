<template>
  <div>
    <q-btn color="grey-4" text-color="purple" glossy unelevated icon="camera_enhance" label="Upload" @click="medium = true" />
    <q-dialog
      v-model="medium"
    >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Medium</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-uploader
            :url="uploadURL"
            style="max-width: 300px"
            :headers="[{name: 'Authorization', value: `Bearer ${access_token}`}]"
            :field-name="(file) => 'file'"
          />
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Cookies } from 'quasar';
import GlobalConstants from '../../constants/GlobalConstants';

export default defineComponent({
  name: 'MediaUpladButton',
  props: {
    mediaGroupId: { type: String}
  },
  data () {
    return {
      medium: false,
      uploadURL: `${GlobalConstants.API_SERVER}/api/${this.mediaGroupId}/media`,
      access_token: Cookies.get('access_token')
    }
  },
})
</script>
