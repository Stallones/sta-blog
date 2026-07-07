<script setup lang="ts">
import { computed } from "vue";

export interface TocNode {
  text: string;
  level: number;
  index: number;
  id: string;
  children: TocNode[];
}

const props = defineProps<{
  node: TocNode;
  activeId: string;
}>();

const emit = defineEmits<{
  click: [id: string];
}>();

const indent = computed(() => (props.node.level - 2) * 14 + 4);
const isActive = computed(() => props.activeId === props.node.id);

function handleClick() {
  emit("click", props.node.id);
}
</script>

<template>
  <div class="toc-group">
    <div
      :class="['toc-item', { 'toc-item--active': isActive }]"
      :style="{ paddingLeft: `${indent}px` }"
      @click.prevent="handleClick"
    >
      <span class="toc-item__text" :title="node.text">{{ node.text }}</span>
    </div>
    <div v-if="node.children.length > 0" class="toc-children" @click.stop>
      <TocItem
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :activeId="activeId"
        @click="emit('click', $event)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.toc-item {
  cursor: pointer;
  padding: 5px 4px;
  border-radius: 4px;
  transition: background-color 0.2s, color 0.2s;
  line-height: 1.5;
  display: flex;
  align-items: center;

  &:hover {
    color: var(--mao-accent);
    background-color: var(--el-fill-color-light);
  }

  &--active {
    background-color: var(--mao-accent) !important;
    color: #fff !important;

    .toc-item__text {
      font-weight: 600;
    }
  }

  &__text {
    font-size: 0.85em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.toc-children {
  border-left: 1px solid var(--el-border-color-light);
  margin-left: 8px;
}
</style>
