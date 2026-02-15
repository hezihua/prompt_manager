# AI Prompt 管理器

> 专业的 AI 绘图 Prompt 管理 Chrome 扩展

![Version](https://img.shields.io/badge/version-0.5.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🎯 简介

AI Prompt 管理器是一个为 AI 艺术家设计的 Chrome 浏览器扩展，帮助你高效管理、组织和优化 AI 绘图 Prompt。

### 核心特性

- 📝 **可视化编辑器** - 拖拽排序、权重调节、40+ 预设标签
- 📸 **版本控制** - 自动快照、时间轴、版本对比、一键恢复
- ⚙️ **AI 参数** - 支持 Midjourney、Stable Diffusion、DALL-E
- 💾 **数据管理** - 导出/导入、完整备份
- 🎨 **暗黑模式** - 3 种主题（浅色/深色/自动）
- 🔲 **批量操作** - 批量删除、批量收藏

## 🚀 快速开始

### 安装

```bash
# 克隆项目
git clone https://github.com/yourusername/prompt-manager.git
cd prompt-manager

# 安装依赖
pnpm install

# 构建
pnpm run build
```

### 加载到 Chrome

1. 打开 `chrome://extensions/`
2. 开启"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择 `dist` 文件夹

### 开始使用

- 点击扩展图标打开侧边栏
- 点击"+ 新建"创建 Prompt
- 或右键保存网页文本为 Prompt

## 📚 文档

- **[使用指南](./docs/USER_GUIDE.md)** - 详细功能说明
- **[安装指南](./docs/INSTALL.md)** - 完整安装步骤
- **[开发文档](./docs/DEVELOPMENT.md)** - 开发环境和代码结构
- **[测试指南](./docs/HOW_TO_TEST.md)** - 功能测试清单
- **[项目总结](./docs/PROJECT_FINAL_SUMMARY.md)** - 完整项目文档
- **[更新日志](./docs/CHANGELOG.md)** - 版本历史

查看完整文档列表: [docs/DOCS_INDEX.md](./docs/DOCS_INDEX.md)

## 🛠️ 技术栈

- React 18 + TypeScript 5
- Vite 5
- Tailwind CSS 3
- Chrome Extension Manifest V3
- @dnd-kit (拖拽)

## 📊 项目统计

- **代码量**: 4,000+ 行
- **组件**: 13 个
- **工具类**: 8 个
- **开发周期**: 5 周

## 🤝 贡献

欢迎贡献！查看 [贡献指南](./.github/CONTRIBUTING.md)

## 🔒 隐私政策

### 数据收集

本扩展**不收集任何用户个人信息或使用数据**。

### 数据存储

- 所有数据存储在用户浏览器本地（Chrome Storage API）
- 不上传到任何服务器
- 不与第三方共享

### 权限说明

本扩展请求以下权限：

- **storage**: 用于本地存储 Prompt 数据和用户设置
- **contextMenus**: 用于右键菜单快捷操作
- **sidePanel**: 用于显示侧边栏管理界面
- **notifications**: 用于操作通知提示（可选）

### 数据安全

用户可以随时通过扩展的导出功能备份数据，或通过卸载扩展删除所有本地数据。

### 远程代码

本扩展**不使用任何远程托管的代码**。所有代码都打包在扩展文件中，不从外部服务器加载任何脚本。

### 联系方式

如有隐私相关问题，请通过 [GitHub Issues](https://github.com/hezihua/prompt-manager/issues) 联系我们。

**最后更新**: 2026-02-15

---

## 📄 许可证

[MIT License](./LICENSE)

## ⭐ Star History

如果这个项目对你有帮助，请给个星标！

---

Made with ❤️ by AI Prompt Manager Team
