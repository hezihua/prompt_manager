# AI Prompt 管理器 🎨

一个强大的浏览器扩展，用于管理 AI 绘图 Prompt。支持标签系统、版本控制、一键复制等功能。

## ✨ 功能特性

### MVP 版本 (v0.1.0)

- ✅ **右键保存** - 选中文本后右键点击「保存为 Prompt」
- ✅ **侧边栏管理** - 优雅的侧边栏界面，查看和管理所有 Prompt
- ✅ **一键复制** - 支持 Midjourney 和 Stable Diffusion 格式
- ✅ **搜索过滤** - 快速搜索标题、标签、描述
- ✅ **标签系统** - 支持多种标签类型（主体、风格、光效、构图等）
- ✅ **收藏功能** - 标记重要的 Prompt
- ✅ **权重管理** - 每个标签支持独立的权重设置
- ✅ **示例数据** - 首次安装自动加载精选示例

## 🚀 快速开始

### 开发环境

```bash
# 安装依赖
npm install

# 开发模式（自动监听文件变化）
npm run dev

# 构建生产版本
npm run build
```

### 安装到浏览器

1. 运行 `npm run build` 构建项目
2. 打开 Chrome 浏览器，访问 `chrome://extensions/`
3. 开启右上角的「开发者模式」
4. 点击「加载已解压的扩展程序」
5. 选择项目的 `dist` 文件夹

### 使用方法

#### 方法一：右键保存
1. 在任意网页选中想要保存的 Prompt 文本
2. 右键点击 → 选择「保存为 Prompt」
3. 系统会自动保存并显示通知

#### 方法二：侧边栏管理
1. 点击浏览器工具栏的扩展图标
2. 或使用快捷键 `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`)
3. 在侧边栏中查看、搜索、管理你的 Prompt

#### 方法三：Popup 快速访问
1. 点击扩展图标打开 Popup
2. 查看统计信息和快速操作

## 📦 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **样式**: Tailwind CSS 3
- **图标**: Lucide React
- **存储**: Chrome Storage API
- **扩展版本**: Manifest V3

## 📁 项目结构

```
prompt_manager/
├── public/
│   ├── manifest.json          # 扩展清单文件
│   └── icons/                 # 图标资源
├── src/
│   ├── background/
│   │   └── service-worker.ts  # 后台服务（右键菜单、消息处理）
│   ├── sidepanel/
│   │   ├── SidePanel.tsx      # 侧边栏主界面
│   │   └── index.tsx          # 侧边栏入口
│   ├── popup/
│   │   ├── Popup.tsx          # 弹窗界面
│   │   └── index.tsx          # 弹窗入口
│   ├── components/
│   │   └── PromptCard.tsx     # Prompt 卡片组件
│   ├── types/
│   │   └── prompt.ts          # TypeScript 类型定义
│   ├── utils/
│   │   ├── storage.ts         # 存储管理器
│   │   └── prompt-builder.ts  # Prompt 构建器
│   └── styles/
│       └── global.css         # 全局样式
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🎯 数据模型

### PromptProject（核心实体）

```typescript
interface PromptProject {
  id: string;
  title: string;
  description?: string;
  coverUrl?: string;
  createdAt: number;
  updatedAt: number;
  
  content: {
    positive: PromptFragment[];  // 正面提示词
    negative: PromptFragment[];  // 负面提示词（SD）
    params: AIParameter[];       // 参数
  };
  
  tags: string[];
  starred: boolean;
}
```

### PromptFragment（标签碎片）

```typescript
interface PromptFragment {
  id: string;
  text: string;           // 英文指令
  translation?: string;   // 中文翻译
  type: FragmentType;     // 类型：subject/style/lighting/etc
  weight: number;         // 权重
  isLocked: boolean;      // 是否锁定
}
```

## 🔧 核心功能实现

### 1. 右键菜单保存

在 `service-worker.ts` 中监听右键菜单点击事件：

```typescript
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'save-prompt') {
    const selectedText = info.selectionText?.trim();
    // 创建并保存 Prompt
  }
});
```

### 2. 一键复制

支持多种 AI 模型格式：

```typescript
// Midjourney 格式
PromptBuilder.buildMidjourney(project);

// Stable Diffusion 格式
PromptBuilder.buildStableDiffusion(project);
```

### 3. 本地存储

使用 Chrome Storage API 持久化数据：

```typescript
const storage = new StorageManager();
await storage.addProject(project);
await storage.getProjects();
```

## 🎨 UI 设计亮点

1. **标签色彩系统** - 不同类型的标签使用不同颜色
   - 主体 (Subject): 蓝色
   - 风格 (Style): 紫色
   - 光效 (Lighting): 黄色
   - 构图 (Composition): 绿色
   - 技法 (Technique): 粉色

2. **权重可视化** - 标签旁直接显示权重值

3. **流畅动画** - 使用 Tailwind 的 transition 系统

## 🗺️ 后续计划

### 第二周：标签编辑器
- [ ] 可视化标签编辑界面
- [ ] 拖拽排序
- [ ] 权重滑块调节
- [ ] 标签库管理

### 第三周：版本控制
- [ ] Prompt 快照功能
- [ ] 时间轴视图
- [ ] 图片关联
- [ ] 版本对比

### 第四周：高级功能
- [ ] 导出/导入数据
- [ ] 云端同步
- [ ] 社区分享
- [ ] AI 辅助优化

## 🐛 已知问题

- [ ] 开发模式下需要手动刷新扩展
- [ ] 暂不支持图片上传
- [ ] 编辑功能暂未实现（计划在第二周）

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 👨‍💻 作者

开发者工具系列项目 - 专注于提升创作效率

---

**提示**: 这是一个 MVP 版本，更多功能正在开发中。如有问题或建议，请提交 Issue。
