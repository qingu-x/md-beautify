<p align="center">
  <img src="apps/web/public/favicon-dark.svg" width="80" height="80" alt="MD Beautify Logo" />
</p>

<h1 align="center">MD Beautify</h1>

<h4 align="center">
  本项目是基于 @tenngoxars 开发的 WeMD 项目进行全面的重构与升级，现更名为 MD Beautify。
  再次感谢 @tenngoxars
</h4>
<p align="center">
  <strong>更优雅的 Markdown 公众号排版工具</strong>
</p>

<p align="center">
  告别复杂工具。Markdown 写作，一键复制到公众号。<br>
  专为公众号创作者设计的<b>本地优先</b>编辑器。<br>
  支持 Obsidian
</p>

<p align="center">
  <a href="https://github.com/qingu-x/md-beautify">🌐 项目主页</a> •
  <a href="https://github.com/qingu-x/md-beautify#%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B">✏️ 快速开始</a> •
  <a href="https://github.com/qingu-x/md-beautify#%E4%BD%BF%E7%94%A8">📖 使用文档</a> •
  <a href="https://github.com/qingu-x/md-beautify/releases">📦 下载桌面版</a>
  <a href="https://github.com/qingu-x/obsidian-md-beautify-plugin/releases">Obsidian 插件</a>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-4CAF50?style=for-the-badge" alt="License: MIT" /></a>
  <img src="https://img.shields.io/badge/Vue-3.5.26-61DAFB?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue 3.5.26" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Electron-28-47848F?style=for-the-badge&logo=electron&logoColor=white" alt="Electron" />
  <img src="https://img.shields.io/badge/pnpm-9-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm" />
</p>

---

## ✨ 特性

|     | 功能              | 说明                                             |
| --- | ----------------- | ------------------------------------------------ |
| 📝  | **Markdown 语法** | 支持 GFM、表格、代码高亮、数学公式               |
| 🎨  | **主题切换**      | 内置十余款精美主题，支持可视化设计器或自定义 CSS |
| 📋  | **一键复制**      | 完美兼容微信公众号，所见即所得                   |
| 🖼️  | **多图床支持**    | 官方图床 / 七牛云 / 阿里云 / 腾讯云 / S3 兼容    |
| 💾  | **本地优先**      | 数据存储在本地，无需登录，隐私安全               |
| 📱  | **跨平台**        | Web 端 + 桌面端（macOS / Windows / Linux）       |
| 🌙  | **界面风格**      | 亮色 / 深色 双模式可选                           |
| 👁️  | **深色模式预览**  | 预览微信深色模式效果，还原度达 98%+              |
| 🔍  | **高级搜索**      | 支持正则匹配、全词匹配、批量替换                 |
| 🎞️  | **滑动图组**      | 支持水平滑动的多图展示组件，丰富视觉体验         |

---

## 💡 技术亮点

### 微信深色模式预览算法

MD Beautify 基于 Wemd 的**色彩语义保全算法**，可在编辑器中预览微信公众号深色模式下的实际效果，还原度达 **98% 以上**。

> 该算法基于微信官方开源的 [wechatjs/mp-darkmode](https://github.com/wechatjs/mp-darkmode) 核心算法迁移并优化，旨在保证高性能 CSS 转换的同时提供最接近官方的渲染效果。

- 智能识别不同元素类型，分别优化
- HSL 色彩空间计算，确保视觉一致性

👉 **[查看算法源码](packages/core/src/wechatDarkMode.ts)**

---

## 🚀 快速开始

### 在线使用

直接在本地运行 Web 版即可开始写作，无需安装，支持纯本地存储。

### 桌面版下载

前往 [Releases](https://github.com/qingu-x/md-beautify/releases) 下载对应平台安装包：

- **macOS**: `.dmg`（Intel 版）/ `-arm64.dmg`（Apple Silicon 版）
- **Windows**: `.exe`
- **Linux**: `.AppImage`

> ⚠️ **macOS 用户注意**：首次打开时如提示"应用已损坏"，请在终端执行：
>
> ```bash
> xattr -cr /Applications/MDBeautify.app
> ```
>
> ⚠️ **Windows 用户注意**：如 SmartScreen 提示"未知发布者"，点击「更多信息」→「仍要运行」
>
> ⚠️ **Linux 用户注意**：运行前需设置可执行权限：`chmod +x MDBeautify.AppImage`

### Docker 部署

```bash
docker-compose up -d
```

访问 `http://localhost:8080` 即可使用。

---

## 🛠️ 本地开发

### 环境要求

- Node.js ≥ 18
- pnpm ≥ 9（推荐 `corepack enable pnpm`）

### 安装与运行

```bash
# 安装依赖
pnpm install

# 启动 Web 开发服务器
pnpm dev:web

# 启动桌面端（需先启动 Web）
pnpm dev:desktop
```

### 构建

```bash
# 构建 Web
pnpm --filter @mdb/web build

# 构建桌面应用
pnpm --filter mdb-electron run build:mac  # macOS
pnpm --filter mdb-electron run build:win  # Windows
```

---

## 📁 项目结构

```
MDB/
├── apps/
│   ├── web/        # Vue + Vite 前端
│   ├── electron/   # Electron 桌面端
│   └── server/     # NestJS 图片上传服务
├── packages/
│   └── core/       # Markdown 解析 / 主题 / 工具
├── templates/      # 主题 CSS 模板
└── turbo.json      # Turborepo 配置
```

---

## 📸 截图

![screenshot](.github/assets/screenshot.png)

---

## 💬 反馈

如有问题或建议，欢迎提交 [Issue](https://github.com/qingu-x/md-beautify/issues)。

---

## 🤝 致谢

本项目的微信深色模式预览算法深度参考了微信官方开源的 [wechatjs/mp-darkmode](https://github.com/wechatjs/mp-darkmode) 核心逻辑。感谢微信团队为开发者提供的优秀解决方案！

---

## 📄 License

[MIT](LICENSE) © MDBeautify Team

再次感谢 [@tenngoxars](https://github.com/tenngoxars) 以及 WeMD Team 的原始项目。本项目同样采用 MIT 协议开源。
