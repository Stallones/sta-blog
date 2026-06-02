<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { computed } from 'vue'

const mode = useColorMode()

const isDark = computed(() => mode.value === 'dark')

function toggle() {
  mode.value = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <div class="my-4" @click="toggle">
    <el-tooltip
        effect="light"
        :content="isDark ? '切换到亮色模式' : '切换到暗色模式'"
        placement="right"
    >
      <div>
        <svg-icon :name="isDark ? 'color_mode_moon' : 'color_mode_sun'" class="back-to-top"/>
      </div>
    </el-tooltip>
  </div>
</template>

<style scoped lang="scss">

.back-to-top {
  height: 30px !important;
  width: 30px !important;

  @media screen and (max-width: 768px) {
    height: 30px !important;
    width: 30px !important;
  }
}

</style>
