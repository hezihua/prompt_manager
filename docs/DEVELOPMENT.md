# 开发文档

## 本地开发流程

### 1. 环境准备

确保安装了 Node.js 18+ 和 npm。

```bash
node -v  # 应该显示 v18.x 或更高
npm -v
```

### 2. 安装依赖

```bash
npm install
```

### 3. 开发模式

```bash
npm run dev
```

这会启动 Vite 的监听模式，文件修改后会自动重新构建。

**注意**: 每次重新构建后，需要在 `chrome://extensions/` 页面点击扩展的「刷新」按钮。

### 4. 调试技巧

#### 调试 Service Worker（后台脚本）

1. 打开 `chrome://extensions/`
2. 找到你的扩展，点击「Service Worker」链接
3. 会打开一个 DevTools 窗口，可以看到 console.log 输出

#### 调试 Side Panel（侧边栏）

1. 打开侧边栏
2. 右键点击侧边栏内容区域 → 检查
3. 会打开一个独立的 DevTools

#### 调试 Popup（弹窗）

1. 右键点击扩展图标 → 检查弹出内容
2. 会打开一个 DevTools

### 5. 生产构建

```bash
npm run build
```

构建产物会输出到 `dist/` 目录。

## 项目架构解析

### 数据流

```
用户操作
  ↓
UI 组件 (SidePanel/Popup)
  ↓
Storage Manager (utils/storage.ts)
  ↓
Chrome Storage API
  ↓
本地持久化存储
```

### 消息通信

扩展的不同部分通过 Chrome 的消息机制通信：

```typescript
// 发送消息
chrome.runtime.sendMessage({
  type: 'SAVE_PROMPT',
  data: project
});

// 接收消息（在 service-worker.ts 中）
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'SAVE_PROMPT':
      // 处理逻辑
      break;
  }
});
```

### 组件设计原则

1. **单一职责** - 每个组件只做一件事
2. **可复用** - 尽可能提取通用组件
3. **类型安全** - 充分利用 TypeScript 的类型系统
4. **性能优化** - 使用 React.memo 避免不必要的重渲染

## 代码规范

### TypeScript

- 所有函数必须有明确的类型注解
- 避免使用 `any`，使用 `unknown` 代替
- 接口命名使用 PascalCase
- 类型命名使用 PascalCase

### React

- 函数组件使用箭头函数
- Props 接口命名为 `ComponentNameProps`
- 使用 React Hooks（useState, useEffect）
- 避免直接修改 state

### CSS

- 优先使用 Tailwind CSS 工具类
- 自定义样式写在 `global.css` 的 `@layer components` 中
- 颜色使用主题色变量

## 性能优化建议

### 1. 存储优化

```typescript
// 不好：每次都读取全部数据
const projects = await storage.getProjects();
const project = projects.find(p => p.id === id);

// 好：只读取需要的数据
const project = await storage.getProject(id);
```

### 2. 组件优化

```typescript
// 使用 React.memo 避免不必要的重渲染
export const PromptCard = React.memo<PromptCardProps>(({ project }) => {
  // ...
});
```

### 3. 搜索优化

对于大量数据，考虑使用防抖（debounce）：

```typescript
const debouncedSearch = useMemo(
  () => debounce((query: string) => {
    setSearchQuery(query);
  }, 300),
  []
);
```

## 常见问题

### Q: 修改代码后看不到效果？

A: 需要在 `chrome://extensions/` 页面刷新扩展。对于 Service Worker 的修改，可能需要点击「Service Worker」链接，然后关闭 DevTools 窗口重新打开。

### Q: Storage 数据丢失了？

A: 检查是否在 `chrome://extensions/` 中点击了「清除数据」。开发时建议定期导出数据备份。

### Q: 为什么 Tailwind 样式不生效？

A: 确保在 HTML 文件中正确引入了编译后的 CSS。检查 `tailwind.config.js` 的 `content` 配置是否包含了所有组件文件。

### Q: 如何添加新的权限？

A: 在 `public/manifest.json` 的 `permissions` 数组中添加，然后重新加载扩展。某些权限可能需要用户授权。

## 部署检查清单

- [ ] 运行 `npm run build` 无错误
- [ ] 所有 TypeScript 类型检查通过
- [ ] 在 Chrome 中测试所有核心功能
- [ ] 检查 Console 无报错
- [ ] 更新版本号（manifest.json 和 package.json）
- [ ] 更新 CHANGELOG.md
- [ ] 创建 Git tag

## 有用的资源

- [Chrome Extension 官方文档](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 迁移指南](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Vite 文档](https://vitejs.dev/)
- [React 文档](https://react.dev/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
