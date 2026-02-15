# 🎨 Chrome Web Store 素材制作指南

## 📂 素材文件位置

我已经为你创建了两个 HTML 模板文件，可以直接用浏览器截图：

1. **屏幕截图模板** (1280x800)
   - 文件: `docs/screenshot-1280x800.html`
   - 用途: Chrome Web Store 屏幕截图（必需）

2. **小型宣传图模板** (440x280)
   - 文件: `docs/promo-440x280.html`
   - 用途: Chrome Web Store 小型宣传图块（必需）

---

## 📸 如何制作截图

### 方法 1：使用 Chrome 截图（推荐）

#### 步骤 1：在 WSL 中打开 HTML 文件

```bash
cd /home/hezihua/workspace/prompt_manager/docs
explorer.exe screenshot-1280x800.html
explorer.exe promo-440x280.html
```

#### 步骤 2：在 Chrome 中打开这两个文件

- 双击打开，或拖到 Chrome 浏览器中

#### 步骤 3：截图（两种方法）

**方法 A：使用 Chrome DevTools**
1. 打开文件后，按 `F12` 打开开发者工具
2. 按 `Ctrl+Shift+P`（Windows）或 `Cmd+Shift+P`（Mac）
3. 输入 "screenshot"
4. 选择 **"Capture screenshot"** 或 **"Capture full size screenshot"**
5. 图片会自动下载

**方法 B：使用 Windows 截图工具**
1. 按 `Win + Shift + S`
2. 选择矩形截图
3. 截取整个浏览器窗口内容
4. 粘贴到画图工具（Win + R → mspaint）
5. 另存为 PNG

---

### 方法 2：直接使用文件管理器

```bash
# 在 Windows 中打开 docs 文件夹
cd /home/hezihua/workspace/prompt_manager
explorer.exe docs
```

然后双击 HTML 文件在 Chrome 中打开。

---

## 📋 素材清单

### ✅ 必需素材（最低要求）

1. **商店图标** (128x128 PNG)
   - ✅ 已在 CloudConvert 转换中
   - 文件名建议: `store-icon-128.png`

2. **屏幕截图** (1280x800 PNG，至少 1 张)
   - 📄 使用 `screenshot-1280x800.html` 截图
   - 文件名建议: `screenshot-1.png`

3. **小型宣传图块** (440x280 PNG)
   - 📄 使用 `promo-440x280.html` 截图
   - 文件名建议: `promo-small.png`

### 📝 文本信息（复制粘贴）

**说明** - 已准备好，在 `docs/CHROME_STORE_PUBLISH.md` 第 3.2 节

**类别**: 生产工具 / 效率

**语言**: 中文（简体）

---

## 🎯 快速操作流程

### 1. 打开 HTML 模板文件

```bash
cd /home/hezihua/workspace/prompt_manager/docs
explorer.exe .
```

### 2. 双击打开：
- `screenshot-1280x800.html` - 在 Chrome 中打开
- `promo-440x280.html` - 在 Chrome 中打开

### 3. 截图保存

使用 Chrome DevTools 截图（F12 → Ctrl+Shift+P → "screenshot"）

### 4. 上传到 Chrome Web Store

将生成的图片上传到对应位置：
- 商店图标 → 上传 `store-icon-128.png`
- 屏幕截图 → 上传 `screenshot-1.png`
- 小型宣传图块 → 上传 `promo-small.png`

---

## 💡 提示

### 图片格式要求

- **格式**: PNG 或 JPEG
- **色彩**: 24 位（不要使用 alpha 透明通道）
- **文件大小**: 每张图片不超过 16MB

### 如果 HTML 文件无法截图

可以：
1. 使用 Windows 画图工具创建纯色背景 + 文字
2. 使用 Canva 在线设计工具（https://www.canva.com/）
3. 使用 Figma 设计工具（https://www.figma.com/）

### 临时方案

如果时间紧迫，可以：
1. 先只上传 **商店图标** 和 **1 张屏幕截图**
2. 保存为草稿
3. 之后再补充小型宣传图块

---

## 🆘 需要帮助？

如果遇到问题：
1. 查看 `docs/CHROME_STORE_PUBLISH.md` 完整指南
2. 参考 Chrome 官方文档：https://developer.chrome.com/docs/webstore/images/

---

**创建时间**: 2026-02-15
**文件位置**: `docs/ASSET_CREATION_GUIDE.md`
