<template>
  <q-page>
    <q-banner v-if="isError" dense class="bg-red text-white">
      {{error}}
      <template v-slot:action>
        <q-btn flat color="white" label="Dismiss" @click="dismiss" />
      </template>
    </q-banner>
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
    <div class="row" v-else>
      <q-btn v-for="member in members" :key="member._id" class="my-card q-ma-md q-pa-md" type="a" :href="`/#members/${member._id}`">
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img :src="member.gravatar">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{member.name}}</q-item-label>
            <q-item-label caption>{{member._id}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-btn>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Member } from '../components/models';
import axios from 'axios';
import { Cookies } from 'quasar';

interface ResponseDefault {
  data: {
    results: Array<Member>
  }
}

export default defineComponent({
  name: 'Members',
  data: function() {
    let members: Member[] = []
    return {
      members,
      isLoading: true,
      fetch_url: 'http://localhost:3000/api/members',
      config: {
        headers: {
          'Authorization': `Bearer ${Cookies.get('access_token')}`
        }
      },
      isError: false,
      error: ''
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      axios.get(this.fetch_url, this.config).then((r: ResponseDefault) => {
        let x = r.data.results;
        this.members = x;
        this.isLoading = false;
      }).catch(e => {
        this.isLoading = false;
        this.isError = true;
        this.error = e.message;
      });
    },
    dismiss() {
      this.error = '';
      this.isError = false;
    }
  }
});
</script>
