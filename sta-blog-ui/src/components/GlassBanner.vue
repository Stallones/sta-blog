<template>
  <div class="glass-banner">
    <div class="glass-banner-content">
      <h1 class="glass-banner-title">{{ title }}</h1>
      <p v-if="subtitle" class="glass-banner-subtitle">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
}>();
</script>

<style scoped lang="scss">
.glass-banner {
  @include glass-card;
  padding: $padding-lg $padding-md;
  margin-bottom: $margin-bottom;
  display: flex;
  align-items: center;

  .glass-banner-content {
    width: 100%;
    text-align: center;
  }

  .glass-banner-title {
    font-size: 1.6rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
    line-height: 1.3;
  }

  .glass-banner-subtitle {
    font-size: 0.95rem;
    color: var(--text-secondary);
    margin: 8px 0 0;
    line-height: 1.5;
  }
}
</style>
