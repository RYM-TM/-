# 回忆收藏馆

一个温暖的个人情感回忆收藏空间，记录文案、照片、音乐和感情经历。

## ✨ 功能特性

- 📖 **文案馆** — 收藏那些触动心弦的句子
- 💌 **回忆墙** — 时间线记录感情经历
- 🖼️ **相册** — 照片画廊，支持大图预览
- 🎵 **音乐台** — 背景音乐，全局播放器
- 🎬 **视频集** — 美好视频回忆

## 🎨 设计风格

暖色调温馨风，使用 HTML + CSS + JavaScript 原生开发，无需构建工具。

## 📁 项目结构

```
├── index.html          # 首页
├── quotes.html         # 文案馆
├── memories.html       # 回忆墙
├── gallery.html        # 相册
├── music.html          # 音乐台
├── videos.html         # 视频集
├── css/                # 样式文件
├── js/                 # 脚本文件
├── data/               # JSON 数据文件
└── assets/             # 资源文件
```

## 🚀 本地运行

```bash
# 方式一：Python
python3 -m http.server 8000

# 方式二：Node.js
npx serve .
```

然后访问 `http://localhost:8000`

## 📝 自定义内容

编辑 `data/` 目录下的 JSON 文件：

- `quotes.json` — 文案数据
- `memories.json` — 回忆数据
- `photos.json` — 相册数据
- `music.json` — 音乐数据
- `videos.json` — 视频数据

## 🌐 部署

推荐使用 GitHub Pages 部署：
1. 将代码推送到 GitHub 仓库
2. 在 Settings → Pages 中选择 `main` 分支
3. 等待部署完成即可访问

## 📄 License

个人使用
