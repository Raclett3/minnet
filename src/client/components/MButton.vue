<template>
  <div :style="{ backgroundColor, color }" class="button" @click="$emit('click')"><slot></slot></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class extends Vue {
  @Prop({ default: '#fff' }) backgroundColor!: string;
  @Prop({ default: '#000' }) color!: string;
}
</script>

<style scoped>
.button {
  border: none;
  display: inline-block;
  margin: 0;
  padding: 15px 25px;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
}

.button:hover {
  opacity: 0.8;
}
</style>
