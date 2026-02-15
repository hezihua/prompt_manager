# 🚀 快速发布指南

## 方法 1：使用打包脚本（推荐）

```bash
cd /home/hezihua/workspace/prompt_manager

# 运行打包脚本
./scripts/package-for-store.sh
```

这个脚本会自动：
1. 清理旧构建
2. 重新构建项目
3. 创建 ZIP 包
4. 显示下一步提示

## 方法 2：手动打包

### 在 WSL 中

```bash
cd /home/hezihua/workspace/prompt_manager

# 1. 构建
pnpm run build

# 2. 安装 zip（如果没有）
sudo apt install zip

# 3. 打包
cd dist
zip -r ../prompt-manager-v0.5.0.zip .
cd ..
```

### 在 Windows 中

1. **打开 Windows 文件管理器**
   
   在 WSL 中运行：
   ```bash
   cd /home/hezihua/workspace/prompt_manager
   explorer.exe .
   ```

2. **找到 `dist` 文件夹**

3. **创建 ZIP 包**
   - 右键点击 `dist` 文件夹
   - 选择"发送到" → "压缩(zipped)文件夹"
   - 或使用 7-Zip、WinRAR 等工具
   - 重命名为 `prompt-manager-v0.5.0.zip`

4. **重要**: 打包 `dist` 文件夹的**内容**，不是文件夹本身
   - 正确：ZIP 根目录包含 `manifest.json`, `assets/`, `background/` 等
   - 错误：ZIP 根目录包含 `dist/` 文件夹

## 方法 3：在线打包（WSL 用户推荐）

如果在 WSL 中无法安装 zip：

1. **复制 dist 文件夹到 Windows**
   ```bash
   # 在 WSL 中执行
   cp -r /home/hezihua/workspace/prompt_manager/dist /mnt/c/Users/$USER/Desktop/prompt-manager-dist
   ```

2. **在 Windows 中打包**
   - 打开桌面的 `prompt-manager-dist` 文件夹
   - 全选所有文件（Ctrl+A）
   - 右键 → 发送到 → 压缩文件夹
   - 重命名为 `prompt-manager-v0.5.0.zip`

---

## 📤 上传到 Chrome Web Store

### 1. 访问开发者控制台
```
https://chrome.google.com/webstore/devconsole
```

### 2. 登录 Google 账号

### 3. 首次使用需要支付注册费
- **费用**: $5 USD（一次性，终身有效）
- **支付方式**: 信用卡

### 4. 创建新项目
1. 点击"新增项"
2. 上传 `prompt-manager-v0.5.0.zip`
3. 等待上传完成

### 5. 填写信息
详细步骤查看：`docs/CHROME_STORE_PUBLISH.md`

### 6. 提交审核
- 审核时间：3-7 个工作日
- 通过后即可在商店中搜索到

---

## 🎨 准备宣传素材

### 必需素材

1. **应用图标** (128x128 PNG)
2. **宣传瓦片** (440x280 PNG)
3. **截图** (至少 1 张，推荐 3-5 张)

### 快速创建

**截图方法**:
```
1. 安装扩展到 Chrome
2. 打开各个界面
3. 使用截图工具截取（推荐尺寸 1280x800）
4. 可选：使用 Figma/Canva 添加注释
```

**图标转换**:
```
如果只有 SVG，可以用在线工具转 PNG：
- https://svgtopng.com/
- https://cloudconvert.com/svg-to-png
```

---

## 📋 快速检查清单

发布前确认：

- [ ] 代码构建成功（`pnpm run build`）
- [ ] 创建了 ZIP 包
- [ ] ZIP 包结构正确（根目录有 manifest.json）
- [ ] 注册了 Chrome Web Store 开发者账号
- [ ] 准备了应用图标
- [ ] 准备了截图（至少 1 张）
- [ ] 撰写了应用描述
- [ ] 准备了隐私政策（如需要）

---

## 🆘 需要帮助？

- 📖 详细发布指南：`docs/CHROME_STORE_PUBLISH.md`
- 🔍 官方文档：https://developer.chrome.com/docs/webstore/
- 💬 GitHub Issues：提交问题

---

**预计时间**: 首次发布约 1-2 小时（不含审核等待时间）

**祝发布顺利！** 🎉
