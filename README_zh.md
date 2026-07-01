<p align="center">
  <img src="apps/web/public/favicon-dark.svg" width="80" height="80" alt="MD Beautify Logo" />
</p>

<h1 align="center">MD Beautify</h1>

<h4 align="center">
  本项目是基于 @tenngoxars 开发的 WeMD 项目进行全面的重构与升级，现更名为 MD Beautify。
  再次感谢 @tenngoxars
</h4>
<p align="center">
  <strong>更优雅的 Markdown 美化与排版工具</strong>
</p>

<p align="center">
  告别枯燥样式。专注于 Markdown 写作，一键渲染美化并携带 HTML 格式复制。<br>
  专为内容创作者设计的<b>本地优先</b>、<b>隐私安全</b>的 Markdown 渲染神器。<br>
  内置 10+ 款精美主题 | 支持 Obsidian 插件 | 支持图片一键上传
</p>

<p align="center">
  <a href="README.md">English</a> •
  <a href="https://github.com/sliiu/md-beautify">🌐 项目主页</a> •
  <a href="https://github.com/sliiu/md-beautify/releases">📦 下载桌面版</a> •
  <a href="https://github.com/sliiu/obsidian-md-beautify-plugin">Obsidian 插件</a>
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

|     | 功能                | 说明                                                       |
| --- | ------------------- | ---------------------------------------------------------- |
| 📝  | **Markdown 全支持** | 支持 GFM、表格、代码高亮、数学公式、Mermaid 图表           |
| 🎨  | **多款精美主题**    | 内置十余款专业主题，支持可视化设计器或自定义 CSS           |
| 📋  | **一键渲染复制**    | 保持 HTML 格式复制，完美适配各种富文本编辑器，所见即所得   |
| 🖼️  | **自动图片上传**    | 批量上传本地图片至云端（支持七牛/阿里/腾讯/S3 等）         |
| 💾  | **数据隐私安全**    | 纯本地存储，无需登录，所有数据保留在你的浏览器或本地       |
| 📱  | **全平台覆盖**      | Web 端 + 桌面端（macOS / Windows / Linux） + Obsidian 插件 |
| 🌙  | **深色模式支持**    | 完美适配亮色/深色双模式，包含界面与内容预览                |
| 👁️  | **高精度预览**      | 独家色彩保全算法，高保真还原深色模式渲染效果               |
| 🎞️  | **动态交互组件**    | 支持滑动图组、交互式卡片，丰富 Markdown 的视觉表现         |

---

## 🌟 为什么选择 MD Beautify？

- **极致美化体验**：内置精心设计的多套主题，解决 Markdown 默认样式单一的问题。
- **携带格式复制**：渲染后的内容可直接携带 HTML 样式复制，完美粘贴至邮件、笔记、博客后台等富文本环境。
- **本地化隐私优先**：不收集任何用户信息，不经过中间服务器，图片直接从本地上传到你的私有云。
- **高度可定制**：通过内置的可视化编辑器，零基础也能设计出属于自己的专属渲染主题。

---

## 💡 技术亮点

### 高精度色彩保全算法

MD Beautify 基于 Wemd 的**色彩语义保全算法**，可在编辑器中高保真预览不同主题在深色模式下的实际效果，还原度达 **98% 以上**。

> 该算法旨在保证高性能 CSS 转换的同时提供最接近原生渲染的效果。

- 智能识别不同元素类型，分别优化
- HSL 色彩空间计算，确保视觉一致性

👉 **[查看算法源码](packages/core/src/wechatDarkMode.ts)**

---

## 🚀 快速开始

### 在线使用

直接在本地运行 Web 版即可开始写作，无需安装，支持纯本地存储。

### 桌面版下载

前往 [Releases](https://github.com/sliiu/md-beautify/releases) 下载对应平台安装包：

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
# 如果你安装了 Docker Desktop (Mac/Win)，使用：
docker compose up -d

# 如果是compose，使用：
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

如有问题或建议，欢迎提交 [Issue](https://github.com/sliiu/md-beautify/issues)。

如果你觉得这个项目对你有帮助，欢迎请作者喝杯咖啡！

### ☕️ 国际赞助

[![Buy Me A Coffee](https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png)](https://www.buymeacoffee.com/pax_z)

### 🧧 国内赞助

| 微信支付                                                                                    | 支付宝                                                                                 |
| ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| ![微信支付](https://github.com/sliiu/md-beautify/blob/vue/.github/assets/pay/wechatpay.jpg) | ![支付宝](https://github.com/sliiu/md-beautify/blob/vue/.github/assets/pay/alipay.jpg) |

---

## 🤝 致谢

再次感谢 [@tenngoxars](https://github.com/tenngoxars) 以及 WeMD Team 的原始项目。

本项目的深色模式预览算法深度参考了微信官方开源的 [wechatjs/mp-darkmode](https://github.com/wechatjs/mp-darkmode) 核心逻辑。感谢微信团队为开发者提供的优秀解决方案！

---

## 📄 License

[MIT](LICENSE) © MDBeautify Team
