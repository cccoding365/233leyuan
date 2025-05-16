<template>
  <div class="waterfall-container" ref="container">
    <!-- 下拉刷新指示器 -->
    <div
      class="refresh-indicator"
      :style="{ height: `${refreshHeight}px` }"
      :class="{ refreshing: isRefreshing }"
    >
      <div class="loading-spinner"></div>
      <span v-if="!isRefreshing">{{ refreshText }}</span>
      <span v-else>刷新中...</span>
    </div>

    <!-- 瀑布流内容 -->
    <div
      class="waterfall-content"
      ref="content"
      :style="{
        transform: `translateY(${contentOffset}px)`,
        paddingTop: `${containerPadding}px`,
      }"
    >
      <div
        v-for="(item, index) in items"
        :key="item.id"
        class="waterfall-item"
        :style="{
          width: `${itemWidth}px`,
          height: `${item.height}px`,
          transform: `translate3d(${item.left}px, ${item.top}px, 0)`,
        }"
      >
        <div
          class="item-cover"
          :style="{ backgroundImage: `url(${item.coverImage})` }"
        ></div>
        <div
          class="flex flex-col justify-start items-start box-border bg-white p-3 h-[40%]"
        >
          <div class="mb-3 text-xs">{{ item.title }}</div>
          <div class="text-xs bg-gray-100 px-1 rounded-sm mb-3">
            {{ item.topic }}
          </div>
          <div class="flex justify-between items-center w-full">
            <div class="flex items-center text-xs">
              <img :src="item.authorAvatar" class="w-6 h-6 rounded-full mr-2" />
              <span>{{ item.author }}</span>
            </div>
            <div class="flex items-center gap-1 text-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <!-- Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE -->
                <path
                  fill="#666666"
                  d="M5 9v12H1V9zm4 12a2 2 0 0 1-2-2V9c0-.55.22-1.05.59-1.41L14.17 1l1.06 1.06c.27.27.44.64.44 1.05l-.03.32L14.69 8H21a2 2 0 0 1 2 2v2c0 .26-.05.5-.14.73l-3.02 7.05C19.54 20.5 18.83 21 18 21zm0-2h9.03L21 12v-2h-8.79l1.13-5.32L9 9.03z"
                />
              </svg>
              <span class="text-[#666]">{{ item.likes }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载更多指示器 -->
    <div class="loading-indicator" v-if="isLoading">
      <div class="loading-spinner"></div>
      <span>加载中...</span>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  onMounted,
  onUnmounted,
  computed,
  nextTick,
  watch,
} from "vue";

// 响应式状态
const container = ref(null);
const content = ref(null);
const items = ref([]);
const columnHeights = reactive([0, 0]); // 固定两列
const refreshHeight = ref(0);
const isRefreshing = ref(false);
const isLoading = ref(false);
const touchStartY = ref(0);
const containerWidth = ref(0);

// 内容偏移量 - 用于下拉刷新时推动内容
const contentOffset = computed(() => {
  // 当刷新指示器显示时，内容向下偏移相同的距离
  return refreshHeight.value;
});

// 固定配置
const COLUMN_COUNT = 2; // 固定两列
const BASE_GAP = 8; // 基础间距
const BASE_CONTAINER_PADDING = 8; // 基础容器内边距

// 根据容器宽度计算实际间距 - 保持比例
const gapSize = computed(() => {
  // 基于一个参考宽度(例如375px)计算比例
  const ratio = Math.max(containerWidth.value / 375, 0.8);
  return Math.floor(BASE_GAP * ratio);
});

// 根据容器宽度计算容器内边距 - 保持比例
const containerPadding = computed(() => {
  const ratio = Math.max(containerWidth.value / 375, 0.8);
  return Math.floor(BASE_CONTAINER_PADDING * ratio);
});

// 下拉刷新相关状态
const refreshThreshold = 60; // 触发刷新的阈值
const refreshText = computed(() => {
  return refreshHeight.value >= refreshThreshold
    ? "释放立即刷新"
    : "下拉可以刷新";
});

// 计算每个元素的宽度 - 响应式
const itemWidth = computed(() => {
  if (containerWidth.value <= 0) return 0;
  const availableWidth =
    containerWidth.value -
    2 * containerPadding.value -
    gapSize.value * (COLUMN_COUNT - 1);
  return availableWidth / COLUMN_COUNT;
});

// 从mock服务获取数据
import { getMockData, refreshMockData } from "./services/mockService";

const fetchData = async (isRefresh = false) => {
  if (isRefresh) {
    isRefreshing.value = true;
  } else {
    isLoading.value = true;
  }

  // 模拟网络请求延迟
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 使用mock服务获取数据
  let newItems;
  if (isRefresh) {
    newItems = refreshMockData(10, containerWidth.value);
  } else {
    newItems = getMockData(10, items.value.length, containerWidth.value);
  }

  if (isRefresh) {
    // 刷新时，重置列高度并替换所有数据
    columnHeights[0] = 0;
    columnHeights[1] = 0;
    items.value = newItems;
    isRefreshing.value = false;
    // 平滑回弹到顶部
    setTimeout(() => {
      refreshHeight.value = 0;
    }, 300);
  } else {
    // 加载更多时，追加数据
    items.value = [
      ...items.value.map((item) => ({ ...item, isNew: false })),
      ...newItems,
    ];
    isLoading.value = false;
  }
  // 计算位置
  nextTick(() => {
    calculateLayout();
  });
};

// 计算瀑布流布局
const calculateLayout = () => {
  if (containerWidth.value <= 0) return;

  // 如果是刷新操作，重置列高度
  if (items.value.every((item) => item.isNew)) {
    columnHeights[0] = 0;
    columnHeights[1] = 0;
  }

  items.value.forEach((item) => {
    // 只计算新元素的位置，保留旧元素的位置
    if (!item.isNew) return;

    // 找出高度较小的列
    const minHeightIndex = columnHeights[0] <= columnHeights[1] ? 0 : 1;

    // 计算位置，考虑容器内边距
    const left =
      containerPadding.value +
      minHeightIndex * (itemWidth.value + gapSize.value);
    const top =
      columnHeights[minHeightIndex] +
      (columnHeights[minHeightIndex] > 0 ? gapSize.value : 0);

    // 更新元素位置
    item.left = left;
    item.top = top;

    // 更新列高度
    columnHeights[minHeightIndex] = top + item.height;

    // 移除新元素标记
    item.isNew = false;
  });

  // 更新内容区域高度，考虑底部内边距
  const contentHeight =
    Math.max(columnHeights[0], columnHeights[1]) + containerPadding.value;
  if (content.value) {
    content.value.style.height = `${contentHeight}px`;
  }
};

// 处理滚动事件 - 上拉加载更多
const handleScroll = () => {
  if (isLoading.value) return;

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  // 当滚动到底部附近时加载更多
  if (documentHeight - scrollTop - windowHeight < 300) {
    fetchData();
  }
};

// 处理触摸事件 - 下拉刷新
const handleTouchStart = (e) => {
  touchStartY.value = e.touches[0].clientY;
};

const handleTouchMove = (e) => {
  // 只有在顶部才能下拉刷新
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (scrollTop > 0 || isRefreshing.value) return;

  const touchY = e.touches[0].clientY;
  const diff = touchY - touchStartY.value;

  if (diff > 0) {
    // 阻止默认滚动
    e.preventDefault();
    // 计算下拉高度，使用阻尼效果
    refreshHeight.value = Math.min(Math.floor(diff * 0.5), 120);
  }
};

const handleTouchEnd = () => {
  if (refreshHeight.value > refreshThreshold) {
    // 触发刷新
    fetchData(true);
  } else {
    // 回弹
    refreshHeight.value = 0;
  }
};

// 使用节流函数优化resize事件
const throttle = (fn, delay) => {
  let timer = null;
  return function () {
    if (timer) return;
    timer = setTimeout(() => {
      fn.apply(this, arguments);
      timer = null;
    }, delay);
  };
};

// 监听窗口大小变化
const handleResize = throttle(() => {
  if (container.value) {
    const newWidth = container.value.offsetWidth;
    // 只有当宽度变化时才重新计算
    if (newWidth !== containerWidth.value) {
      containerWidth.value = newWidth;
      // 标记所有元素为新元素，以便重新计算位置
      items.value.forEach((item) => {
        item.isNew = true;
      });
      calculateLayout();
    }
  }
}, 200);

// 生命周期钩子
onMounted(() => {
  // 初始化容器宽度
  if (container.value) {
    containerWidth.value = container.value.offsetWidth;
  }

  // 初始加载数据
  fetchData();

  // 添加事件监听
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", handleResize);

  // 添加触摸事件监听
  document.addEventListener("touchstart", handleTouchStart, {
    passive: false,
  });
  document.addEventListener("touchmove", handleTouchMove, { passive: false });
  document.addEventListener("touchend", handleTouchEnd);
});

onUnmounted(() => {
  // 移除事件监听
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", handleResize);

  document.removeEventListener("touchstart", handleTouchStart);
  document.removeEventListener("touchmove", handleTouchMove);
  document.removeEventListener("touchend", handleTouchEnd);
});
</script>

<style scoped>
.waterfall-container {
  position: relative;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  box-sizing: border-box;
}

.refresh-indicator {
  position: fixed;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: height 0.3s ease;
  overflow: hidden;
  z-index: 10;
}

.refresh-icon {
  margin-bottom: 8px;
}

.rotate {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.waterfall-content {
  position: relative;
  width: 100%;
  transition: transform 0.3s ease, height 0.3s ease;
}

.waterfall-item {
  position: absolute;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, left 0.3s ease, top 0.3s ease,
    width 0.3s ease, height 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.item-cover {
  width: 100%;
  height: 60%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.item-content {
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: 40%;
  box-sizing: border-box;
  background-color: white;
}

.item-topic {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  background-color: #f0f0f0;
  padding: 2px 6px;
  border-radius: 10px;
}

.item-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
  line-height: 1.3;
}

.item-author {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 6px;
  object-fit: cover;
}

.item-likes {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #ff4d4f;
}

.like-icon {
  margin-right: 4px;
  font-size: 14px;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  width: 100%;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spin 1s linear infinite;
  margin-bottom: 8px;
}
</style>
