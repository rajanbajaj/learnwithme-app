<template>
  <q-page>
    <div class="q-pa-md">

    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <q-input
        filled
        v-model="title"
        label="Post Title *"
      />

      <q-select 
        filled 
        v-model="post_visibility" 
        :options="visibilityOptions" 
        label="Visibility"
        map-options
        emit-value
      />
      <q-select
        label="Tags"
        filled
        v-model="tags"
        use-input
        use-chips
        multiple
        hide-dropdown-icon
        input-debounce="0"
        new-value-mode="add-unique"
        style="width: 250px"
      />

      <q-editor
        v-model="body"
        :dense="$q.screen.lt.lg"
        :toolbar="[
          ['save', 'media'],
          [
            {
              label: $q.lang.editor.align,
              icon: $q.iconSet.editor.align,
              fixedLabel: true,
              list: 'only-icons',
              options: ['left', 'center', 'right', 'justify']
            },
          ],
          ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
          ['hr', 'link', 'custom_btn'],
          [
            {
              label: $q.lang.editor.formatting,
              icon: $q.iconSet.editor.formatting,
              list: 'no-icons',
              options: [
                'p',
                'h1',
                'h2',
                'h3',
                'h4',
                'h5',
                'h6',
                'code'
              ]
            },
            {
              label: $q.lang.editor.fontSize,
              icon: $q.iconSet.editor.fontSize,
              fixedLabel: true,
              fixedIcon: true,
              list: 'no-icons',
              options: [
                'size-1',
                'size-2',
                'size-3',
                'size-4',
                'size-5',
                'size-6',
                'size-7'
              ]
            },
            {
              label: $q.lang.editor.defaultFont,
              icon: $q.iconSet.editor.font,
              fixedIcon: true,
              list: 'no-icons',
              options: [
                'default_font',
                'arial',
                'arial_black',
                'comic_sans',
                'courier_new',
                'impact',
                'lucida_grande',
                'times_new_roman',
                'verdana'
              ]
            },
            'removeFormat'
          ],
          ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
          ['undo', 'redo'],
          ['viewsource', 'fullscreen']
        ]"
        :fonts="{
          arial: 'Arial',
          arial_black: 'Arial Black',
          comic_sans: 'Comic Sans MS',
          courier_new: 'Courier New',
          impact: 'Impact',
          lucida_grande: 'Lucida Grande',
          times_new_roman: 'Times New Roman',
          verdana: 'Verdana'
        }"
        :definitions="{
          media: {
            tip: 'Add media',
            icon: 'photo',
            label: 'Media',
            fixedLabel: true,
            fixedIcon: true,
            handler: addMedia
          }
        }"
      />
      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>

    <q-dialog
      v-model="medium"
    >
      <ContentPreviewComponent :content="body" />
    </q-dialog>

  </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { ref } from 'vue'
import { Cookies, Notify } from 'quasar';
import ContentPreviewComponent from '../components/post/ContentPreview.vue';
import GlobalConstants from '../constants/GlobalConstants';

export default defineComponent({
  name: 'Register Post',
  components: {ContentPreviewComponent},
  setup() {
    return {
      title: ref(''),
      post_visibility: ref('PRIVATE'),
      body: ref(''),
      author: ref(''),
    }
  },
  data() {
    return {
      isLoading: false,
      accessToken: '',
      tags: [],
      visibilityOptions: [
        {
          label: 'PRIVATE (Visibility: Self)',
          value: 'PRIVATE',
          description: 'Visibility: Self'
        },
        {
          label: 'PUBLIC (Visibility: All users)',
          value: 'PUBLIC',
          description: 'Visibility: All users'
        },
        {
          label: 'PUBLIC_RESTRICTED (Visibility: Logged in users)',
          value: 'PUBLIC_RESTRICTED',
          description: 'Visibility: Logged in users'
        },
      ],
      config: {
        headers: {
          'Authorization': `Bearer ${Cookies.get('access_token')}`
        }
      },
      url: `${GlobalConstants.API_SERVER}/api/posts`,
      medium: false
    };
  },
  methods: {
    onSubmit() {
      let payload = {
        publish_status : this.post_visibility,
        body: this.body,
        title : this.title,
        tags : this.tags.toString(),
        author: this.parseJwt(Cookies.get('access_token')).id,
      };
      axios.post(this.url, payload, this.config).then(r => {
        Notify.create({
          message: 'Successfully Created',
          color: 'green',
        });
      }).catch(e => {
        Notify.create({
          message: e.message,
          color: 'red',
        });
      });
    },

    addMedia() {
      this.medium=true;
    },

    onReset () {
      this.post_visibility = 'PRIVATE'
      this.title = '';
      this.tags = [];
      this.author = '';
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
