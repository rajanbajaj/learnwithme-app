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
    <div class="row q-pa-md" v-else>
      <div class="col">
        {{member.name}} <small>( {{member._id}} )</small>
      </div>
      <div class="col-1">
        <q-avatar>
          <img :src="member.gravatar">
        </q-avatar>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Member } from '../components/models';
import axios from 'axios';
import { Cookies } from 'quasar';

interface ResponseDefault {
  data: Member
}

export default defineComponent({
  name: 'Member Profile',
  data: function() {
    return {
      member: {},
      isLoading: true,
      fetch_url: `http://localhost:3000/api/members/${this.$route.params.id}`,
      config: {
        headers: {
          'Authorization': `Bearer ${Cookies.get('access_token')}`
        }
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      axios.get(this.fetch_url, this.config).then((r: ResponseDefault) => {
        this.member = r.data
        this.isLoading = false
      }).catch(e => console.log(e))
    }
  }
});
</script>
