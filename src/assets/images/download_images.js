/**
 * 图片下载脚本
 * 
 * 此脚本用于下载示例图片资源，以便快速实现本地图片加载功能
 * 使用方法：
 * 1. 安装依赖：npm install node-fetch fs-extra
 * 2. 运行脚本：node download_images.js
 */

// 注意：此脚本使用ES模块语法，确保package.json中有"type": "module"设置
// 或者将文件扩展名改为.mjs
import fetch from 'node-fetch';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// 在ES模块中，__dirname不可用，需要通过以下方式获取
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 确保目录存在
fs.ensureDirSync(path.join(__dirname, 'covers'));
fs.ensureDirSync(path.join(__dirname, 'avatars'));

// 下载封面图片
async function downloadCoverImages() {
  console.log('开始下载封面图片...');
  
  const coverUrls = [
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
    'https://picsum.photos/400/380?random=11',
    'https://picsum.photos/400/480?random=12',
    'https://picsum.photos/400/580?random=13',
    'https://picsum.photos/400/340?random=14',
    'https://picsum.photos/400/440?random=15',
    'https://picsum.photos/400/540?random=16',
    'https://picsum.photos/400/360?random=17',
    'https://picsum.photos/400/460?random=18',
    'https://picsum.photos/400/560?random=19',
    'https://picsum.photos/400/370?random=20',
  ];
  
  for (let i = 0; i < coverUrls.length; i++) {
    const url = coverUrls[i];
    const filename = `cover${i + 1}.jpg`;
    const filePath = path.join(__dirname, 'covers', filename);
    
    try {
      const response = await fetch(url);
      const buffer = await response.buffer();
      fs.writeFileSync(filePath, buffer);
      console.log(`下载成功: ${filename}`);
    } catch (error) {
      console.error(`下载失败: ${filename}`, error.message);
    }
  }
  
  console.log('封面图片下载完成！');
}

// 下载头像图片
async function downloadAvatarImages() {
  console.log('开始下载头像图片...');
  
  const avatarUrls = [];
  
  // 生成20个随机头像URL
  for (let i = 1; i <= 20; i++) {
    // 随机选择男性或女性头像
    const gender = Math.random() > 0.5 ? 'men' : 'women';
    const id = Math.floor(Math.random() * 99) + 1;
    avatarUrls.push(`https://randomuser.me/api/portraits/${gender}/${id}.jpg`);
  }
  
  for (let i = 0; i < avatarUrls.length; i++) {
    const url = avatarUrls[i];
    const filename = `avatar${i + 1}.jpg`;
    const filePath = path.join(__dirname, 'avatars', filename);
    
    try {
      const response = await fetch(url);
      const buffer = await response.buffer();
      fs.writeFileSync(filePath, buffer);
      console.log(`下载成功: ${filename}`);
    } catch (error) {
      console.error(`下载失败: ${filename}`, error.message);
    }
  }
  
  console.log('头像图片下载完成！');
}

// 执行下载
async function main() {
  console.log('开始下载图片资源...');
  await downloadCoverImages();
  await downloadAvatarImages();
  console.log('所有图片下载完成！');
  console.log('请确保在package.json中添加依赖："node-fetch": "^3.3.0", "fs-extra": "^10.1.0"');
}

main().catch(console.error);