<template>
  <div class="signin">
    <h2>Sign in</h2>
    <m-input v-model="username" label="Username" @enter="signIn()" />
    <m-input v-model="password" type="password" label="Password" @enter="signIn()" />
    <m-button @click="signIn()">Sign in</m-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import MButton from '../components/MButton.vue';
import MInput from '../components/MInput.vue';
import { api } from '../lib/request';

@Component({ components: { MButton, MInput } })
export default class extends Vue {
  public username = '';
  public password = '';

  public async signIn() {
    const token: string = await api('post', '/api/users/signin', { username: this.username, password: this.password });
    localStorage.setItem('token', token);
    this.$router.push('/');
  }
}
</script>

<style scoped>
.signin {
  background-color: #fff;
  margin: 0 auto;
  width: 100%;
  max-width: 768px;
}
</style>
