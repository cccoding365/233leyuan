// 模拟数据服务

// 导入本地图片资源
import coverImg1 from '../assets/images/covers/cover1.jpg';
import coverImg2 from '../assets/images/covers/cover2.jpg';
import coverImg3 from '../assets/images/covers/cover3.jpg';
import coverImg4 from '../assets/images/covers/cover4.jpg';
import coverImg5 from '../assets/images/covers/cover5.jpg';
import coverImg6 from '../assets/images/covers/cover6.jpg';
import coverImg7 from '../assets/images/covers/cover7.jpg';
import coverImg8 from '../assets/images/covers/cover8.jpg';
import coverImg9 from '../assets/images/covers/cover9.jpg';
import coverImg10 from '../assets/images/covers/cover10.jpg';
import coverImg11 from '../assets/images/covers/cover11.jpg';
import coverImg12 from '../assets/images/covers/cover12.jpg';
// import coverImg13 from '../assets/images/covers/cover13.jpg';
import coverImg14 from '../assets/images/covers/cover14.jpg';
import coverImg15 from '../assets/images/covers/cover15.jpg';
import coverImg16 from '../assets/images/covers/cover16.jpg';
import coverImg17 from '../assets/images/covers/cover17.jpg';
import coverImg18 from '../assets/images/covers/cover18.jpg';
import coverImg19 from '../assets/images/covers/cover19.jpg';
// import coverImg20 from '../assets/images/covers/cover20.jpg';

import avatarImg1 from '../assets/images/avatars/avatar1.jpg';
import avatarImg2 from '../assets/images/avatars/avatar2.jpg';
import avatarImg3 from '../assets/images/avatars/avatar3.jpg';
import avatarImg4 from '../assets/images/avatars/avatar4.jpg';
import avatarImg5 from '../assets/images/avatars/avatar5.jpg';
import avatarImg6 from '../assets/images/avatars/avatar6.jpg';
import avatarImg7 from '../assets/images/avatars/avatar7.jpg';
import avatarImg8 from '../assets/images/avatars/avatar8.jpg';
import avatarImg9 from '../assets/images/avatars/avatar9.jpg';
import avatarImg10 from '../assets/images/avatars/avatar10.jpg';
import avatarImg11 from '../assets/images/avatars/avatar11.jpg';
import avatarImg12 from '../assets/images/avatars/avatar12.jpg';
import avatarImg13 from '../assets/images/avatars/avatar13.jpg';
import avatarImg14 from '../assets/images/avatars/avatar14.jpg';
import avatarImg15 from '../assets/images/avatars/avatar15.jpg';
import avatarImg16 from '../assets/images/avatars/avatar16.jpg';
import avatarImg17 from '../assets/images/avatars/avatar17.jpg';
import avatarImg18 from '../assets/images/avatars/avatar18.jpg';
import avatarImg19 from '../assets/images/avatars/avatar19.jpg';
import avatarImg20 from '../assets/images/avatars/avatar20.jpg';

// 随机话题列表
const topics = ['科技', '美食', '旅行', '时尚', '健康', '教育', '娱乐', '体育', '艺术', '宠物'];

// 本地作者列表
const authors = [
  { name: '张三', avatar: avatarImg1 },
  { name: '李四', avatar: avatarImg2 },
  { name: '王五', avatar: avatarImg3 },
  { name: '赵六', avatar: avatarImg4 },
  { name: '钱七', avatar: avatarImg5 },
  { name: '孙八', avatar: avatarImg6 },
  { name: '周九', avatar: avatarImg7 },
  { name: '吴十', avatar: avatarImg8 },
  { name: '郑十一', avatar: avatarImg9 },
  { name: '王十二', avatar: avatarImg10 },
  { name: '李十三', avatar: avatarImg11 },
  { name: '赵十四', avatar: avatarImg12 },
  { name: '钱十五', avatar: avatarImg13 },
  { name: '孙十六', avatar: avatarImg14 },
  { name: '周十七', avatar: avatarImg15 },
  { name: '吴十八', avatar: avatarImg16 },
  { name: '郑十九', avatar: avatarImg17 },
  { name: '王二十', avatar: avatarImg18 },
  { name: '张二一', avatar: avatarImg19 },
  { name: '李二二', avatar: avatarImg20 },
];

// 本地封面图列表
const coverImages = [
  coverImg1,
  coverImg2,
  coverImg3,
  coverImg4,
  coverImg5,
  coverImg6,
  coverImg7,
  coverImg8,
  coverImg9,
  coverImg10,
  coverImg11,
  coverImg12,
//   coverImg13,
  coverImg14,
  coverImg15,
  coverImg16,
  coverImg17,
  coverImg18,
  coverImg19,
//   coverImg20,
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