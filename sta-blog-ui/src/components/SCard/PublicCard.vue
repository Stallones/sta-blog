<script setup lang="ts">
import { computed } from "vue";
import { useDemotion } from "@/composables/useDemotion";

const { isOnline, yiyuanOnline, imageOnline } = useDemotion();

const services = computed(() => [
  { name: "ruoyi-vue-pro", online: isOnline.value },
  { name: "hitokoto", online: yiyuanOnline.value },
  { name: "minio", online: imageOnline.value },
]);
</script>

<template>
  <Card name="public" variant="default" title="服务" prefix-icon="announcement">
    <ul class="service-list">
      <li v-for="svc in services" :key="svc.name" class="service-item">
        <span class="service-name">{{ svc.name }}</span>
        <span class="service-status">
          <span class="service-dot" :class="svc.online ? 'online' : 'offline'" />
          {{ svc.online ? "正常" : "离线" }}
        </span>
      </li>
    </ul>
  </Card>
</template>

<style scoped lang="scss">
.service-list {
  list-style: none;
  margin: 0;
  padding: 4px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.service-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding: 0 8px;
}

.service-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  display: inline-block;
  margin-right: 6px;

  &.online {
    background-color:var(--color-success);
    box-shadow: 0 0 6px rgba(82, 196, 26, 0.5);
  }

  &.offline {
    background-color: var(--color-danger);
    box-shadow: 0 0 6px rgba(245, 34, 45, 0.5);
  }
}

.service-name {
  color: var(--text-primary);
}

.service-status {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  color: var(--text-secondary);
}
</style>
