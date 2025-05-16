// 模拟数据服务

// 随机话题列表
const topics = ['科技', '美食', '旅行', '时尚', '健康', '教育', '娱乐', '体育', '艺术', '宠物'];

// 随机作者列表
const authors = [
  { name: '张三', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { name: '李四', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { name: '王五', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { name: '赵六', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
  { name: '钱七', avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
];

// 随机封面图列表
const coverImages = [
  'https://picsum.photos/400/300?random=1',
  'https://picsum.photos/400/400?random=2',
  'https://picsum.photos/400/500?random=3',
  'https://picsum.photos/400/600?random=4',
  'https://picsum.photos/400/350?random=5',
  'https://picsum.photos/400/450?random=6',
  'https://picsum.photos/400/550?random=7',
  'https://picsum.photos/400/320?random=8',
  'https://picsum.photos/400/420?random=9',
  'https://picsum.photos/400/520?random=10',
];

// 随机标题前缀
const titlePrefixes = ['探索', '发现', '了解', '分享', '揭秘', '解析', '品味', '感受', '体验', '欣赏'];

// 随机标题后缀
const titleSuffixes = ['的魅力', '的世界', '的奥秘', '的乐趣', '的精彩', '的故事', '的技巧', '的秘密', '的风采', '的风格'];

// 生成随机整数
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// 生成随机元素
const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// 生成随机标题
const generateRandomTitle = () => {
  const prefix = getRandomElement(titlePrefixes);
  const topic = getRandomElement(topics);
  const suffix = getRandomElement(titleSuffixes);
  return `${prefix}${topic}${suffix}`;
};

// 不再生成随机高度，改为固定的初始高度，实际高度将由内容自动撑开
const generateInitialHeight = (containerWidth) => {
  // 返回一个初始高度，实际高度将由内容自动撑开
  return 0; // 返回0，让元素高度完全由内容决定
};

// 生成随机颜色 (保持与原代码的颜色生成逻辑一致)
const generateRandomColor = () => {
  const colors = [
    "#f87171", "#fb923c", "#fbbf24", "#facc15", "#a3e635",
    "#4ade80", "#34d399", "#2dd4bf", "#22d3ee", "#38bdf8",
    "#60a5fa", "#818cf8", "#a78bfa", "#c084fc", "#e879f9",
    "#f472b6",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * 获取模拟数据
 * @param {number} count 需要获取的数据条数
 * @param {number} startIndex 起始索引
 * @param {number} containerWidth 容器宽度，用于计算高度
 * @returns {Array} 模拟数据数组
 */
export const getMockData = (count = 10, startIndex = 0, containerWidth = 375) => {
  return Array.from({ length: count }, (_, i) => {
    const index = startIndex + i;
    const author = getRandomElement(authors);
    
    return {
      id: `item-${index}`,
      title: generateRandomTitle(),
      topic: getRandomElement(topics),
      author: author.name,
      authorAvatar: author.avatar,
      likes: getRandomInt(0, 999),
      coverImage: getRandomElement(coverImages),
      height: generateInitialHeight(containerWidth),
      color: generateRandomColor(),
      left: 0,
      top: 0,
      isNew: true, // 标记为新元素，用于布局计算
    };
  });
};

/**
 * 刷新数据
 * @param {number} count 需要获取的数据条数
 * @param {number} containerWidth 容器宽度，用于计算高度
 * @returns {Array} 模拟数据数组
 */
export const refreshMockData = (count = 10, containerWidth = 375) => {
  return Array.from({ length: count }, (_, i) => {
    const author = getRandomElement(authors);
    
    return {
      id: `new-${i}`,
      title: generateRandomTitle(),
      topic: getRandomElement(topics),
      author: author.name,
      authorAvatar: author.avatar,
      likes: getRandomInt(0, 999),
      coverImage: getRandomElement(coverImages),
      height: generateInitialHeight(containerWidth),
      color: generateRandomColor(),
      left: 0,
      top: 0,
      isNew: true, // 标记为新元素，用于布局计算
    };
  });
};