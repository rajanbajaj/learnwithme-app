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
        <div class="q-px-md">
          <q-toggle
            v-model="dark"
            color="white"
          />
        </div>
        <div class="q-px-md">LWM v{{ version }}</div>
        <q-separator class="q-mx-md" dark vertical />

        <q-btn class="q-mx-md"  flat round v-if="loginStatus">
          <q-avatar size="32px">
            <img :src="tokenData.gravatar" />
          </q-avatar>
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup>
                <q-item-section>
                  <q-item-section><q-btn v-close-popup type="a" stretch flat :href="`/#members/${tokenData.id}`" label="Profile" /></q-item-section>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section><q-btn icon="logout" v-close-popup @click="logout" stretch flat label="Logout" /></q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <q-btn v-if="!loginStatus" type="a" href="/#login" stretch flat label="Login" />
        <q-separator v-if="!loginStatus" dark vertical />
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
import { Dark } from 'quasar'

const linksList = [
  {
    title: 'Learn With Us',
    caption: 'home',
    icon: 'school',
    link: '/#'
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
      version: require('../../package.json').version,
      accessToken: Cookies.get('access_token'),
      tokenData: [],
      dark: Dark.isActive ? true : false
    }
  },

  mounted() {
    if (this.loginStatus) {
      this.tokenData = this.parseJwt(this.accessToken);
    }
  },

  watch: {
    dark: function(newValue) {
      Dark.set(newValue);
      return;
    }
  },

  methods: {
    toggleLeftDrawer () {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },
    toggleDarkMode() {
      Dark.toggle()
    },
    logout() {
      Cookies.remove('access_token');
      window.location.href = '/';
    },
    parseJwt(token: String) {
      if (!token) { return; }
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse(window.atob(base64));
    }
  }
  })
</script>
