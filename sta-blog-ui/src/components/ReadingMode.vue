<script setup lang="ts">

</script>

<template>
  <div class="reading-toggle">
    <el-tooltip
        effect="light"
        content="阅读模式"
        placement="right"
    >
      <div>
        <svg-icon name="reading_mode" class="back-to-top"/>
      </div>
    </el-tooltip>
  </div>
</template>

<style scoped lang="scss">

.reading-toggle {
  margin: 1rem 0;
}

.back-to-top {
  height: 30px !important;
  width: 30px !important;

  @media screen and (max-width: 768px) {
    height: 30px !important;
    width: 30px !important;
  }
}


</style>