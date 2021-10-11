<template>
  <q-page>
  <div v-if="!success" class="q-pa-md">

    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <q-input
        filled
        v-model="name"
        label="Your name *"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />

      <q-input
        filled
        v-model="email"
        label="Your email *"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />

      <q-input
        filled
        v-model="bio"
        label="Your bio *"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />

      <q-select filled v-model="country" :options="countryOptions" label="country" />
      <q-select v-if="country === 'India'" filled v-model="state" :options="stateOptions" label="state" />

      <q-input
        filled
        v-model="address"
        label="Your address *"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />

      <q-input filled v-model="birthdate" mask="date" :rules="['date']">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
              <q-date v-model="birthdate">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <q-input
        filled
        type="password"
        v-model="password"
        label="Your password *"
        lazy-rules
        :rules="[val => val && val.length > 4 || 'min length 5']"
      />

      <q-input
        filled
        type="number"
        v-model="pincode"
        label="Your pincode *"
        lazy-rules
        :rules="[val => val !== null && val !== '' || 'Please type your pincode']"
      />
      <q-select filled v-model="profileType" :options="profileTypeOptions" label="Profile Type" />
      <q-toggle v-model="accept" label="I accept the license and terms" />

      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>

  </div>
  <div v-else class="q-pa-md">
    Successfully created Account! please login <a href="/#login">here</a>
  </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { ref } from 'vue'
import { Notify } from 'quasar'

export default defineComponent({
  name: 'Register',
  setup() {
    return {
      email: ref(''),
      password: ref(''),
      name: ref(''),
      country: ref(''),
      state: ref(''),
      address: ref(''),
      bio: ref(''),
      accept: ref(''),
      pincode: ref(''),
      birthdate: ref('2021/01/01'),
      username: '',
      profileType: ref('PUBLIC'),
    }
  },
  data() {
    return {
      isLoading: false,
      accessToken: '',
      countryOptions: [
        'India',
        'Other'
      ],
      stateOptions: [
        'Rajasthan',
        'Himachal',
        'Other'
      ],
      profileTypeOptions: ['PUBLIC', 'PRIVATE'],
      url: 'http://localhost:3000/api/members',
      success: false
    };
  },
  methods: {
    onSubmit() {
      if (!this.accept) {
        Notify.create({
          message: 'Please Accept the Agreement!',
          color: 'red',
        })
      }
      else {
        let payload = {
          email : this.email,
          password : this.password,
          name : this.name,
          username: this.name,
          country : this.country,
          state : this.state,
          address : this.address,
          bio : this.bio,
          accept : this.accept,
          pincode : this.pincode,
          birthdate : this.birthdate,
        };

        axios.post(this.url, payload).then(r => {
          Notify.create({
            message: 'Successfully created the account!',
            color: 'green',
          })
          this.success = true;
        }).catch(e => {
          Notify.create({
            message: e.message,
            color: 'red',
          })
        });
      }
    },

    onReset () {
      this.email = '';
      this.password = '';
      this.name = '';
      this.country = '';
      this.state = '';
      this.address = '';
      this.bio = '';
      this.accept = '';
      this.pincode = '';
      this.birthdate = '';
    }
  }
});
</script>
