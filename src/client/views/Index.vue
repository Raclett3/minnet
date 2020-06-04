<template>
  <div>
    <div class="post">
      <m-textarea v-model="text" @enter="post()" />
      <m-button @click="post()">Post</m-button>
    </div>
    <div class="timeline">
      <note v-for="note in timeline" :key="note.id" :author="note.postedBy.name">{{ note.content }}</note>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { APINote } from '../../routes/api/entities/note';
import MButton from '../components/MButton.vue';
import MTextarea from '../components/MTextarea.vue';
import Note from '../components/Note.vue';
import { api } from '../lib/request';

@Component({ components: { MButton, MTextarea, Note } })
export default class extends Vue {
  public timeline: APINote[] = [];
  public text = '';
  public token = localStorage.getItem('token');

  private ws!: WebSocket;

  public async getTimeline() {
    this.timeline = await api('get', '/api/timeline', {});
  }

  public mounted() {
    const host = new URL(location.href).host;
    this.ws = new WebSocket(`wss://${host}/?channel=timeline`);
    this.ws.onmessage = data => {
      const note: APINote = JSON.parse(data.data);
      this.timeline.unshift(note);
    };
    this.getTimeline();
  }

  public async post() {
    if (this.token) {
      await api('post', '/api/notes', { token: this.token, text: this.text });
      this.text = '';
    }
  }
}
</script>

<style scoped>
.post {
  background-color: rgba(32, 32, 32, 0.2);
  margin: 0 auto;
  width: 100%;
  max-width: 768px;
}

.timeline {
  background-color: #fff;
  margin: 0 auto;
  width: 100%;
  max-width: 768px;
}
</style>
