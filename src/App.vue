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
					backgroundColor: item.color,
				}"
			>
				<div class="item-content">
					<div class="item-index">{{ index + 1 }}</div>
					<div class="item-title">{{ item.title }}</div>
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
const BASE_GAP = 10; // 基础间距
const BASE_CONTAINER_PADDING = 10; // 基础容器内边距

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

// 模拟获取数据
const fetchData = async (isRefresh = false) => {
	if (isRefresh) {
		isRefreshing.value = true;
	} else {
		isLoading.value = true;
	}

	// 模拟网络请求延迟
	await new Promise(resolve => setTimeout(resolve, 500));

	// 生成随机数据
	const newItems = Array.from({ length: 10 }, (_, i) => {
		// 根据容器宽度调整元素高度，保持宽高比
		const baseHeight = Math.floor(Math.random() * 150) + 100; // 100-250px的基础随机高度
		const ratio = Math.max(containerWidth.value / 375, 0.8);
		const height = Math.floor(baseHeight * ratio);

		return {
			id: isRefresh ? `new-${i}` : `item-${items.value.length + i}`,
			height,
			title: isRefresh
				? `新内容 ${i + 1}`
				: `内容 ${items.value.length + i + 1}`,
			color: getRandomColor(),
			left: 0,
			top: 0,
			isNew: true, // 标记为新元素
		};
	});

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
			...items.value.map(item => ({ ...item, isNew: false })),
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
	if (items.value.every(item => item.isNew)) {
		columnHeights[0] = 0;
		columnHeights[1] = 0;
	}

	items.value.forEach(item => {
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

// 生成随机颜色
const getRandomColor = () => {
	const colors = [
		"#f87171",
		"#fb923c",
		"#fbbf24",
		"#facc15",
		"#a3e635",
		"#4ade80",
		"#34d399",
		"#2dd4bf",
		"#22d3ee",
		"#38bdf8",
		"#60a5fa",
		"#818cf8",
		"#a78bfa",
		"#c084fc",
		"#e879f9",
		"#f472b6",
	];
	return colors[Math.floor(Math.random() * colors.length)];
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
const handleTouchStart = e => {
	touchStartY.value = e.touches[0].clientY;
};

const handleTouchMove = e => {
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
			items.value.forEach(item => {
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

.item-content {
	padding: 12px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
	box-sizing: border-box;
	color: white;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.item-index {
	font-size: 24px;
	font-weight: bold;
	margin-bottom: 8px;
}

.item-title {
	font-size: 16px;
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
