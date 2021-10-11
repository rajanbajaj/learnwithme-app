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
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />

      <q-select filled v-model="publish_status" :options="publishOptions" label="Status" />
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
        :options="tagOptions"
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
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Medium</div>
        </q-card-section>

        <q-card-section class="q-pt-none">

          HERE
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { ref } from 'vue'
import { Cookies, Notify } from 'quasar';

export default defineComponent({
  name: 'Register Post',
  setup() {
    return {
      title: ref(''),
      publish_status: ref(''),
      body: ref(''),
      author: ref(''),
    }
  },
  data() {
    return {
      isLoading: false,
      accessToken: '',
      tags: [],
      tagOptions: [
        'blog',
        'media',
        'photography',
        'coding'
      ],
      publishOptions: [
        'DRAFT',
        'PUBLIC',
        'PRIVATE'
      ],
      config: {
        headers: {
          'Authorization': `Bearer ${Cookies.get('access_token')}`
        }
      },
      url: 'http://localhost:3000/api/posts',
      medium: false
    };
  },
  methods: {
    onSubmit() {
      let payload = {
        publish_status : this.publish_status,
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
      this.publish_status = '';
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
