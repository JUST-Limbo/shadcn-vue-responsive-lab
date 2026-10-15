<script setup lang="ts">
defineProps<{ eyebrow: string; title: string; description: string }>()
</script>

<template>
  <div class="scenario-intro">
    <span class="eyebrow">{{ eyebrow }}</span>
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
  </div>
</template>
