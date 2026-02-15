# 如何测试扩展 🧪

Chrome 扩展**不能**像普通网页那样通过 `preview` 预览，需要在浏览器中加载。

## 🚀 方法一：生产构建测试（推荐）

适合：测试完整功能

### 步骤：

```bash
# 1. 构建项目
pnpm run build

# 2. 在 Chrome 中加载
# 打开 chrome://extensions/
# 开启"开发者模式"
# 点击"加载已解压的扩展程序"
# 选择 dist 文件夹
```

### 更新代码后：

```bash
# 1. 重新构建
pnpm run build

# 2. 在 chrome://extensions/ 页面点击扩展的刷新按钮 🔄
```

---

## 🔥 方法二：开发模式（推荐用于开发）

适合：频繁修改代码时使用

### 步骤：

```bash
# 1. 启动监听模式（终端保持运行）
pnpm run dev

# 2. 首次加载扩展
# 打开 chrome://extensions/
# 加载 dist 文件夹

# 3. 修改代码后，会自动重新构建
# 你会在终端看到：
# ✓ built in 500ms

# 4. 手动刷新扩展
# 在 chrome://extensions/ 点击刷新按钮 🔄
```

### 开发模式优势：

- ✅ 代码修改后自动重新构建
- ✅ 构建速度更快
- ✅ 包含 source map，便于调试

---

## 🐛 调试技巧

### 1. 调试 Service Worker（后台脚本）

```
1. 打开 chrome://extensions/
2. 找到 "AI Prompt 管理器"
3. 点击 "Service Worker" 链接
4. 打开 DevTools，查看 Console 输出
```

### 2. 调试侧边栏（Side Panel）

```
1. 打开侧边栏（Ctrl+Shift+P）
2. 右键点击侧边栏内容区域
3. 选择"检查"
4. 打开独立的 DevTools
```

### 3. 调试 Popup（弹窗）

```
1. 右键点击扩展图标
2. 选择"检查弹出内容"
3. 打开 DevTools
```

### 4. 查看存储数据

在任意 DevTools 中执行：

```javascript
// 查看所有数据
chrome.storage.local.get('prompt_manager_data', (result) => {
  console.log('存储数据:', result);
});

// 清空数据（慎用！）
chrome.storage.local.clear(() => {
  console.log('数据已清空');
});
```

---

## 📝 常见问题

### Q1: 修改代码后看不到效果？

**A**: 需要两步：
1. 确保 `pnpm run dev` 正在运行或重新 `pnpm run build`
2. 在 `chrome://extensions/` 点击扩展的刷新按钮

### Q2: Service Worker 报错？

**A**: 
1. 点击 "Service Worker" 旁的刷新图标
2. 或者移除扩展后重新加载

### Q3: 样式没有更新？

**A**:
1. 刷新扩展
2. 清空浏览器缓存（Ctrl+Shift+Delete）
3. 重新打开侧边栏/Popup

### Q4: 想看编译后的代码？

**A**: 查看 `dist/` 目录下的文件：
```bash
# 查看构建产物
ls -la dist/

# 查看编译后的 JS
cat dist/background/service-worker.js
```

---

## 🔄 完整开发流程

### 日常开发：

```bash
# 终端 1: 启动监听模式
pnpm run dev

# 终端 2: （可选）类型检查
pnpm run type-check -- --watch

# 开发步骤：
# 1. 修改代码
# 2. 等待终端显示 "✓ built"
# 3. 刷新扩展（chrome://extensions/）
# 4. 测试功能
# 5. 重复以上步骤
```

### 发布前测试：

```bash
# 1. 生产构建
pnpm run build

# 2. 完整测试所有功能
# - 右键保存
# - 侧边栏
# - 复制
# - 搜索
# - 删除
# - 收藏

# 3. 检查 Console 无错误

# 4. 确认构建产物
ls -la dist/
```

---

## 💡 提示

1. **开发时保持 `pnpm run dev` 运行**，这样每次保存文件都会自动重新构建
2. **使用 Chrome DevTools 的 Console** 查看日志和错误
3. **善用 Chrome Extension 的调试工具**
4. **定期清空测试数据** 避免干扰测试

---

## 🎯 快速命令参考

```bash
# 开发模式（自动监听）
pnpm run dev

# 生产构建
pnpm run build

# 类型检查
pnpm run type-check

# 查看构建产物
ls -la dist/

# 清理构建产物
rm -rf dist/
```

---

**重要**: Chrome 扩展不是 Web 应用，没有 `preview` 模式！  
必须在浏览器中加载才能测试。

祝开发顺利！🚀
