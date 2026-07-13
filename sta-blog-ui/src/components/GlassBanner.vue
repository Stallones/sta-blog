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
@use "@/styles/_layout.scss" as *;

.glass-banner {
  // @include surface-card;
  width: 100%;
  max-width: $layout-max-w;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0;
  // backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  // background: hsla(0, 0%, 100%, 0.55);
  border: none;
  box-shadow: none;

  &::before {
    background: none;
  }

  .glass-banner-content {
    width: 100%;
    text-align: center;
  }

  .glass-banner-title {
    font-size: 4.6rem;
    font-weight: normal;
    color: white;
    margin: 0;
    line-height: 1.3;
    text-shadow:
      0 1px 0 hsl(174, 5%, 80%), 0 2px 0 hsl(174, 5%, 75%),
      0 3px 0 hsl(174, 5%, 70%), 0 4px 0 hsl(174, 5%, 66%),
      0 5px 0 hsl(174, 5%, 64%), 0 6px 0 hsl(174, 5%, 62%),
      0 7px 0 hsl(174, 5%, 61%), 0 8px 0 hsl(174, 5%, 60%),
      0 0 5px hsla(0, 0%, 0%, 0.05), 0 1px 3px hsla(0, 0%, 0%, 0.2),
      0 3px 5px hsla(0, 0%, 0%, 0.2), 0 5px 10px hsla(0, 0%, 0%, 0.2),
      0 10px 10px hsla(0, 0%, 0%, 0.2), 0 20px 20px hsla(0, 0%, 0%, 0.3);
  }

  .glass-banner-subtitle {
    color: hsla(0, 0%, 100%, 0.7);
    font-size: 1.6rem;
    letter-spacing: 5px;
    margin: 1rem 0 0 0;
    font-weight: normal;
  }
}
</style>
