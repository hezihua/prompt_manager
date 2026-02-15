# 安装指南 📦

## 🎯 将扩展加载到 Chrome 浏览器

### 步骤 1: 打开扩展管理页面

在 Chrome 浏览器地址栏输入以下任一地址：

```
chrome://extensions/
```

或者：
- 点击浏览器右上角的三个点 ⋮
- 选择「扩展程序」→「管理扩展程序」

### 步骤 2: 开启开发者模式

在扩展管理页面的右上角，找到「**开发者模式**」开关，将其打开。

### 步骤 3: 加载扩展

1. 点击左上角的「**加载已解压的扩展程序**」按钮
2. 在文件选择对话框中，导航到项目目录
3. 选择 `dist` 文件夹（不是项目根目录！）
4. 点击「选择文件夹」

### 步骤 4: 确认安装

你应该能看到：
- ✅ 扩展卡片显示「AI Prompt 管理器」
- ✅ 版本号：0.1.0
- ✅ 状态：已启用
- ✅ 浏览器工具栏出现扩展图标

## 🔧 配置快捷键（可选）

### 修改默认快捷键

1. 在扩展管理页面，点击左侧菜单的「**键盘快捷键**」
2. 或直接访问：`chrome://extensions/shortcuts`
3. 找到「AI Prompt 管理器」
4. 点击铅笔图标修改快捷键
5. 默认快捷键：`Ctrl+Shift+P` (Mac: `Cmd+Shift+P`)

### 推荐快捷键设置

| 功能 | Windows/Linux | Mac |
|------|--------------|-----|
| 打开管理器 | Ctrl+Shift+P | Cmd+Shift+P |
| 快速保存 | Ctrl+Shift+S | Cmd+Shift+S |

## 🧪 测试扩展

### 1. 测试右键菜单

1. 在任意网页选中一段文字，例如：
   ```
   masterpiece, best quality, 1girl, cyberpunk, neon lights
   ```
2. 右键点击选中的文字
3. 应该能看到菜单项：「**保存为 Prompt**」
4. 点击后会显示通知：「Prompt 已保存」

### 2. 测试侧边栏

**方法 A - 使用快捷键**：
- 按 `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`)
- 侧边栏应该从右侧滑出

**方法 B - 点击图标**：
- 点击浏览器工具栏的扩展图标
- 侧边栏应该打开

### 3. 测试 Popup

- 点击扩展图标
- 应该显示一个小窗口
- 包含统计信息和快速操作按钮

### 4. 测试示例数据

首次安装时，应该能看到 2 个示例 Prompt：
- 赛博朋克少女
- 梦幻森林

### 5. 测试复制功能

1. 在侧边栏找到任意 Prompt
2. 点击右下角的复制图标
3. 粘贴到任意文本框，应该能看到格式化的 Prompt

## 🐛 常见问题排查

### 问题 1: 扩展无法加载

**错误信息**: "Manifest file is missing or unreadable"

**解决方案**:
```bash
# 重新构建项目
cd prompt_manager
pnpm run build

# 确认 dist 目录存在
ls -la dist/
```

### 问题 2: 右键菜单没有出现

**可能原因**:
- 扩展未正确加载
- 权限未授予

**解决方案**:
1. 在 `chrome://extensions/` 中点击扩展的「刷新」图标
2. 刷新当前网页
3. 重新选中文字并右键

### 问题 3: 侧边栏打不开

**可能原因**:
- 快捷键冲突
- 浏览器版本过低

**解决方案**:
1. 检查 Chrome 版本（需要 114+）
2. 在 `chrome://extensions/shortcuts` 修改快捷键
3. 尝试直接点击扩展图标

### 问题 4: 样式显示异常

**可能原因**:
- 缓存问题
- 构建不完整

**解决方案**:
```bash
# 清理并重新构建
rm -rf dist
pnpm run build

# 在浏览器中移除扩展后重新加载
```

### 问题 5: Service Worker 报错

**查看错误信息**:
1. 打开 `chrome://extensions/`
2. 找到「AI Prompt 管理器」
3. 点击「Service Worker」链接
4. 查看 Console 中的错误信息

**常见解决方案**:
- 点击「Service Worker」旁的刷新图标
- 重新加载扩展

## 🔄 更新扩展

当代码有更新时：

```bash
# 1. 拉取最新代码
git pull

# 2. 重新构建
pnpm run build

# 3. 在浏览器中刷新扩展
# 打开 chrome://extensions/
# 点击扩展卡片上的刷新图标 🔄
```

## 🗑️ 卸载扩展

1. 打开 `chrome://extensions/`
2. 找到「AI Prompt 管理器」
3. 点击「移除」按钮
4. 确认删除

**注意**: 卸载后，所有保存的 Prompt 数据会被清除！建议先导出数据（功能开发中）。

## 📱 其他浏览器支持

### Microsoft Edge

Edge 基于 Chromium，完全兼容：
1. 打开 `edge://extensions/`
2. 按照相同步骤加载扩展

### Brave Browser

Brave 也基于 Chromium：
1. 打开 `brave://extensions/`
2. 按照相同步骤加载扩展

### Arc Browser

Arc 支持 Chrome 扩展：
1. 打开设置 → 扩展
2. 按照相同步骤加载扩展

### Firefox

Firefox 使用不同的扩展系统（WebExtensions），需要修改 manifest.json。暂不支持。

## ✅ 安装成功检查清单

- [ ] 扩展在 `chrome://extensions/` 中显示为「已启用」
- [ ] 浏览器工具栏显示扩展图标
- [ ] 右键菜单有「保存为 Prompt」选项
- [ ] 快捷键 `Ctrl+Shift+P` 能打开侧边栏
- [ ] 侧边栏显示 2 个示例 Prompt
- [ ] 点击复制按钮能成功复制到剪贴板
- [ ] 搜索功能正常工作
- [ ] 收藏功能正常工作

## 🎉 下一步

安装成功后，请阅读：
- [快速开始指南](./QUICKSTART.md) - 学习如何使用
- [完整文档](./README.md) - 了解所有功能
- [开发文档](./DEVELOPMENT.md) - 如果你想参与开发

祝使用愉快！🚀
