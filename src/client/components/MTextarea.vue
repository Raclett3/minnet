<template>
  <div class="textarea">
    <p v-if="label" class="label">{{ label }}</p>
    <p><textarea v-model="value" :type="type" @input="$emit('input', $event.target.value)" /></p>
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

textarea {
  border: 1px solid #000;
  background-color: #fff;
  padding: 5px;
  margin: 0;
  width: calc(100% - 12px);
  resize: vertical;
}

.textarea {
  width: 100%;
}

.label {
  opacity: 0.5;
  font-size: 50%;
}
</style>
