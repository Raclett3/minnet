<template>
  <div class="timeline">
    <note v-for="note in timeline" :key="note.id" :author="note.postedBy.name">{{ note.content }}</note>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { APINote } from '../../routes/api/entities/note';
import Note from '../components/Note.vue';
import { api } from '../lib/request';

@Component({ components: { Note } })
export default class extends Vue {
  public timeline: APINote[] = [];
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
}
</script>

<style scoped>
.timeline {
  background-color: #fff;
  margin: 0 auto;
  width: 100%;
  max-width: 768px;
}
</style>
