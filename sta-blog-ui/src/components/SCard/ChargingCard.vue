<script setup lang="ts">
import Card from "@/components/SCard/Card.vue";
import payQr from "@/assets/pay/a77178025b790601a8a0a8361718b148.png";

const chargingList = ref([
  {
    name: "One",
    money: "200",
    message: "全网最美博客ruyu-blog，期待新功能",
  },
  {
    name: "李貌",
    money: "100",
    message: "随心",
  },
  {
    name: "白菜豆腐汤",
    money: "50",
    message: "在线膜拜大佬",
  },
  {
    name: "曦月",
    money: "30",
    message: "仰天大笑出门去，我辈岂是蓬蒿人",
  },
  {
    name: "sn",
    money: "6",
    message: "膜拜大佬，学习了",
  },
  {
    name: "venus",
    money: "50",
    message: "感谢您的开源项目，致敬用爱发电!",
  },
  {
    name: "SmallL-U",
    money: "10",
    message: "加油",
  },
  {
    name: "御坂10086号",
    money: "10",
    message: "感谢群主开源，未来希望能看到更多的作品",
  },
]);
</script>

<template>
  <Card
    name="charging"
    variant="default"
    title="项目充电榜"
    prefix-icon="edit"
  >
      <div class="charging-desc">
        你们的每一次充电，不仅仅是电量的累积，更是对我们项目的信任和对未来的期待。每一份捐赠，无论大小，都承载着你们对我们的鼓励和对改变世界的信念。是你们，让项目持续更新得到了进一步保障，非常感谢大家！！！
        <br />（以下榜单时间排序）
      </div>
      <div class="charging-table">
        <div class="item-div">
          <div>姓名</div>
          <hr />
          <div v-for="charging in chargingList" :key="charging.name">
            {{ charging.name }}
          </div>
        </div>
        <div class="item-div">
          <div>金额</div>
          <hr />
          <div v-for="charging in chargingList" :key="charging.name">
            {{ "*".repeat(charging.money.length) }}
          </div>
        </div>
        <div class="item-div">
          <div>留言</div>
          <hr />
          <div v-for="charging in chargingList" :key="charging.name">
            <template v-if="charging.message.length <= 4">
              {{ charging.message }}
            </template>
            <template v-else>
              <el-popover placement="top-start" :width="200" trigger="hover">
                <template #reference>
                  {{ charging.message.slice(0, 4) }}...
                </template>
                <template #default>
                  <span class="popover-text">{{ charging.message }}</span>
                </template>
              </el-popover>
            </template>
          </div>
        </div>
      </div>
      <div class="charging-qr">
        <span class="charging-hint">为项目充电(支付宝)：</span>
        <div class="qr-wrap">
          <div class="qr-img">
            <el-image :src="payQr" />
          </div>
        </div>
        <span class="charging-hint">为项目充电：联系站长</span>
      </div>
    </Card>
</template>

<style scoped lang="scss">
.charging-desc {
  font-size: 12px;
  text-align: left;
}

.charging-table {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--mao-charging-bg-color);
    border-radius: $border-radius;
  }

  .popover-text {
    color: var(--text-secondary);
    font-size: 13px;
  }

  .charging-qr {
    margin-top: 0.5rem;
    font-size: 12px;
    font-weight: bold;
    text-align: left;
  }

  .charging-hint {
    color: var(--text-secondary);
  }

  .qr-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .qr-img {
    width: 150px;
    height: 150px;
    margin-top: 1rem;
  }

  .item-div {
    width: 33%;

    div:nth-child(1) {
      text-align: center;
      font-size: 15px;
      font-weight: 600;
    }

    font-size: 13px;

    div {
      margin: 5px 0;
      text-align: center;
      white-space: nowrap; /* 确保文本在一行内显示 */
      overflow: hidden; /* 隐藏溢出的内容 */
      text-overflow: ellipsis; /* 显示省略号 */
    }

    &:nth-child(3) {
      text-align: left;
    }
  }
</style>
