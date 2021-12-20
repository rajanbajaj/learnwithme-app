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
import { Post } from '../components/models';

interface ResponseDefault {
  data: Post
}

export default defineComponent({
  name: 'Edit Post',
  components: {ContentPreviewComponent},
  setup() {
    return {
      title: ref(''),
      publish_status: ref(''),
      body: ref(''),
      author: ref(''),
    }
  },
  data() {
    let tagsx: String = '';
    return {
      success: false,
      post: {},
      isLoading: false,
      accessToken: '',
      tags: tagsx,
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
      fetch_url: `http://localhost:3000/api/posts/${this.$route.params.id}`,
      medium: false
    };
  },

  created() {
    this.getData()
  },

  methods: {
    getData() {
      axios.get(this.fetch_url, this.config).then((r: ResponseDefault) => {
        this.post = r.data
        this.title = r.data.title
        this.body = r.data.body
        this.tags = r.data.tags
        this.publish_status = r.data.publish_status
        this.isLoading = false
        this.success = true
      }).catch(e => {
        this.isLoading = false;
        Notify.create({
          message: e.message,
          color: 'red',
        });
      })
    },

    onSubmit() {
      let payload = {
        publish_status : this.publish_status,
        body: this.body,
        title : this.title,
        tags : this.tags.toString(),
        author: this.parseJwt(Cookies.get('access_token')).id,
      };

      axios.put(this.fetch_url, payload, this.config).then(r => {
        Notify.create({
          message: 'Successfully Updated',
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
      this.tags = '';
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
