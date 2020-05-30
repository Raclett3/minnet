<template>
  <div>Hello, {{ name }}</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class extends Vue {
  public name = '';
  mounted() {
    const names = ['John', 'Bob', 'Alice'];
    this.name = names[Math.floor(Math.random() * 3)];
  }
}
</script>

<style scoped></style>
