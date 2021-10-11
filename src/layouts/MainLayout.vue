<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          LWM
        </q-toolbar-title>
        <div class="q-pa-md">LWM v{{ version }}</div>
        <q-separator dark vertical />
        <q-btn v-if="loginStatus" @click="logout" stretch flat label="Logout" />
        <q-btn v-if="!loginStatus" type="a" href="/#login" stretch flat label="Login" />
        <q-separator dark vertical />
        <q-btn v-if="!loginStatus" type="a" href="/#register" stretch flat label="Register" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import EssentialLink from '../components/EssentialLink.vue'

const linksList = [
  {
    title: 'Learn With Us',
    caption: 'home',
    icon: 'school',
    link: '/'
  },
  {
    title: 'Members',
    icon: 'account_circle',
    link: '/#members'
  },
  {
    title: 'Posts',
    icon: 'article',
    link: '/#posts'
  },
  {
    title: 'Register a Post',
    icon: 'article',
    link: '/#posts/register'
  },
  {
    title: 'Media',
    icon: 'perm_media',
    link: '/#media-groups'
  },
  {
    title: 'Register Media Group',
    icon: 'perm_media',
    link: '/#media-groups/register'
  },
];

import { defineComponent } from 'vue'
import { Cookies } from 'quasar'

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  computed: {
    loginStatus: function () {
      return Cookies.has('access_token');
    }
  },

  data() {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksList,
      version: require('../../package.json').version
    }
  },

  methods: {
    toggleLeftDrawer () {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },
    logout() {
      Cookies.remove('access_token');
      window.location.href = '/';
    }
  }
  })
</script>
