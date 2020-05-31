<template>
  <div class="body">
    <div class="fixed">
      <router-link to="/">Home</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class extends Vue {}
</script>

<style scoped>
.fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: calc(100% - 20px);
  padding: 10px;
  background-color: #fff;
}
</style>
