<template>
  <vue-danmaku
    class="danmaku"
    :debounce="3000"
    random-channel
    :speeds="80"
    :channels="5"
    is-suspend
    v-model:danmus="treeHoleList"
    use-slot
    loop
  >
    <template v-slot:dm="{ danmu }">
      <div class="barrage_container">
        <div>
          <el-avatar :src="danmu.avatar" />
        </div>
        <div>
          <span>{{ danmu.nickname }}：</span><span>{{ danmu.content }}</span>
        </div>
      </div>
    </template>
  </vue-danmaku>
</template>

<script setup lang="ts">
import vueDanmaku from "vue3-danmaku";
import { addTreeHole, getTreeHoleList } from "@/apis/treeHole";
import { ElMessage } from "element-plus";
import { useServiceStore } from "@/store/useServiceStore";

const isServiceAvailable = useServiceStore().isServiceAvailable;

const treeHoleList = ref<any[]>([]);
// 是否显示提交按钮
const isShowSubmit = ref(false);
const content = ref("");

onMounted(() => {
  if (isServiceAvailable) getTreeHole();
});

async function getTreeHole() {
  const res = await getTreeHoleList();
  if (res.code === 200) {
    treeHoleList.value = res.data;
  }
}
</script>

<style scoped lang="scss">
// 弹幕
.danmaku {
  padding: 60px;
  height: 60vh;
  width: 100vw;

  .barrage_container {
    display: flex;
    align-items: center;
    position: relative;

    // 下边框动画
    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 0;
      height: 0.2em;
      border-radius: 0.1em;
      // 蓝紫色渐变色背景
      background: linear-gradient(to right, #00c6ff, #0072ff);
      transition: width 0.3s ease; /* 过渡动画效果 */
    }

    &:hover::after {
      width: 100%;
    }

    & div:last-child span:first-child {
      margin-left: 0.5rem;
      color: white;
      font-weight: bold;
    }

    & div:last-child span:last-child {
      font-size: 1.2rem;
    }

    & div:last-child {
      // 悬浮动态移动下边框
      border-bottom: 1px solid #ebebeb;
      padding: 0.5rem;
      margin-left: 0.5rem;
      border-radius: $border-radius;
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
}
</style>
