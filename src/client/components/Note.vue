<template>
  <div class="note">
    <div class="author">{{ author }}</div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class extends Vue {
  @Prop({ default: '' }) public author!: string;
}
</script>

<style scoped>
.note {
  border-bottom: 1px solid #aaa;
  color: #111;
  padding: 10px;
  width: calc(100% - 20px);
}

.author {
  font-weight: bold;
}
</style>
