<template>
  <div>
    <p v-if="label" class="label">{{ label }}</p>
    <p><input :value="value" :type="type" @input="$emit('input', $event.target.value)" /></p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class extends Vue {
  @Prop({ default: '' }) value!: string;
  @Prop({ default: '' }) label!: string;
  @Prop({ default: 'text' }) type!: string;
}
</script>

<style scoped>
p {
  margin: 0;
}

input {
  border: 1px solid #000;
  border-radius: 0;
  color: #000;
  background-color: #fff;
  display: inline-block;
  margin: 0;
  padding: 5px;
  text-decoration: none;
  font-size: 16px;
}

.label {
  opacity: 0.5;
  font-size: 90%;
}
</style>
