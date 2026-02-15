# AI Prompt 管理器

一个专业的 AI 绘图 Prompt 管理 Chrome 扩展，帮助 AI 艺术家高效管理、组织和优化他们的 Prompt。

![Version](https://img.shields.io/badge/version-0.5.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Chrome](https://img.shields.io/badge/Chrome-Extension-orange.svg)

## ✨ 核心功能

### 📝 Prompt 管理
- **可视化编辑器**: 直观的标签编辑界面
- **拖拽排序**: 轻松调整标签顺序
- **权重调节**: 0.5-2.0 可调节权重
- **40+ 预设标签**: 常用标签库，一键添加
- **搜索与过滤**: 快速找到需要的 Prompt
- **批量操作**: 批量删除、批量收藏

### 📸 版本控制
- **自动快照**: 每次保存自动创建版本
- **时间轴视图**: 可视化版本历史
- **版本对比**: 详细的差异分析
- **一键恢复**: 安全的版本回滚
- **图片关联**: 上传生成结果图
- **评分系统**: 5星评价版本质量

### ⚙️ AI 参数
- **多模型支持**: Midjourney、Stable Diffusion、DALL-E
- **预设参数**: 常用参数快速添加
- **自定义参数**: 灵活的参数配置

### 💾 数据管理
- **完整备份**: JSON 格式导出所有数据
- **表格导出**: CSV 格式，Excel 可用
- **灵活导入**: 合并或替换模式
- **数据验证**: 防止错误导入

### 🎨 用户体验
- **暗黑模式**: 3种主题（浅色/深色/自动）
- **响应式设计**: 流畅的交互体验
- **键盘快捷键**: Ctrl+Shift+P 快速打开

## 🚀 快速开始

### 安装

1. **下载或克隆项目**
   ```bash
   git clone https://github.com/yourusername/prompt-manager.git
   cd prompt-manager
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **构建项目**
   ```bash
   pnpm run build
   ```

4. **加载到 Chrome**
   - 打开 `chrome://extensions/`
   - 开启"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择项目中的 `dist` 文件夹

### 基本使用

1. **创建 Prompt**
   - 点击扩展图标打开侧边栏
   - 点击"+ 新建"按钮
   - 使用标签编辑器创建 Prompt
   - 点击"保存"

2. **保存网页文本为 Prompt**
   - 选中网页上的文本
   - 右键点击"保存为 Prompt"
   - 自动保存到管理器

3. **编辑和管理**
   - 搜索：输入关键词快速查找
   - 收藏：点击星星图标
   - 编辑：点击编辑按钮
   - 复制：点击复制按钮一键复制

4. **版本控制**
   - 点击"历史"图标查看版本
   - 选择两个版本进行对比
   - 点击"恢复"回到旧版本
   - 上传图片关联到版本

5. **数据备份**
   - 点击设置图标（⚙️）
   - 切换到"数据管理"标签
   - 点击"导出所有数据"
   - 文件自动下载

## 📖 详细文档

- **[安装指南](./INSTALL.md)** - 详细的安装步骤和故障排查
- **[开发文档](./DEVELOPMENT.md)** - 开发环境设置和代码结构
- **[测试指南](./HOW_TO_TEST.md)** - 功能测试清单
- **[更新日志](./CHANGELOG.md)** - 版本更新历史
- **[项目总结](./PROJECT_FINAL_SUMMARY.md)** - 完整的项目文档

## 🛠️ 技术栈

- **前端**: React 18 + TypeScript 5
- **构建**: Vite 5
- **样式**: Tailwind CSS 3
- **图标**: Lucide React
- **拖拽**: @dnd-kit
- **浏览器**: Chrome Extension Manifest V3

## 🎯 使用场景

### 对 AI 艺术家
- 管理和组织大量 Prompt
- 追踪 Prompt 演化历史
- 快速复用优秀 Prompt
- 对比不同版本效果

### 对团队
- 导出/导入功能便于分享
- 标签系统便于分类
- 版本控制记录迭代过程

## 📊 项目结构

```
prompt_manager/
├── src/
│   ├── components/      # React 组件
│   ├── sidepanel/       # 侧边栏主界面
│   ├── popup/           # 弹出窗口
│   ├── background/      # 后台服务
│   ├── types/           # TypeScript 类型
│   ├── utils/           # 工具函数
│   └── styles/          # 全局样式
├── public/
│   ├── manifest.json    # 扩展清单
│   └── icons/           # 图标资源
├── dist/                # 构建输出
└── docs/                # 文档
```

## 🤝 贡献

欢迎贡献代码、报告问题或提出建议！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

详见 [CONTRIBUTING.md](.github/CONTRIBUTING.md)

## 📝 开发命令

```bash
# 安装依赖
pnpm install

# 开发模式（监听文件变化）
pnpm run dev

# 构建生产版本
pnpm run build

# 类型检查
pnpm run type-check
```

## 🔮 未来计划

- [ ] 云端同步
- [ ] 社区分享
- [ ] AI 辅助优化
- [ ] 多语言支持
- [ ] 移动端适配
- [ ] Chrome Web Store 上架

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](./LICENSE) 文件

## 👏 致谢

感谢所有贡献者和使用者！

## 📧 联系方式

- 问题反馈: [GitHub Issues](https://github.com/yourusername/prompt-manager/issues)
- 功能建议: [GitHub Discussions](https://github.com/yourusername/prompt-manager/discussions)

---

**⭐ 如果这个项目对你有帮助，请给个星标！**

Made with ❤️ by AI Prompt Manager Team
