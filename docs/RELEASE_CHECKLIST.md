# 发布检查清单

在发布到 GitHub 和 Chrome Web Store 之前，请确认以下所有项目。

## ✅ 代码质量

- [x] 所有功能正常工作
- [x] 无 TypeScript 错误
- [x] 无 Console 错误
- [x] 无 lint 错误
- [x] 构建成功

## ✅ 文档完整性

- [x] README.md 完整且准确
- [x] QUICKSTART.md 清晰易懂
- [x] INSTALL.md 步骤详细
- [x] DEVELOPMENT.md 开发指南完善
- [x] CHANGELOG.md 更新日志准确
- [x] LICENSE 文件存在
- [x] CONTRIBUTING.md 贡献指南清晰
- [x] MARKETING.md 营销素材准备

## ✅ GitHub 准备

- [x] .gitignore 正确配置
- [x] LICENSE 选择合适
- [x] README.md 有吸引力
- [x] Issue 模板创建
- [x] PR 模板创建
- [ ] GitHub Actions CI/CD（可选）
- [ ] 代码已推送到 GitHub
- [ ] Release notes 准备好

## ✅ 扩展资源

- [x] manifest.json 信息完整
- [x] 图标文件存在（16, 48, 128）
- [x] 权限说明清晰
- [x] 版本号正确

## ✅ Chrome Web Store 准备

### 必需素材
- [ ] 商店图标 128x128
- [ ] 小宣传图 440x280
- [ ] 截图 1280x800 或 640x400（至少 1张，最多 5 张）
- [ ] 宣传图（可选）920x680
- [ ] 宣传图（可选）1400x560

### 商店信息
- [ ] 简短描述（< 132 字符）
- [ ] 详细描述（完整功能说明）
- [ ] 分类选择
- [ ] 语言设置
- [ ] 隐私政策（如收集数据）

### 发布设置
- [ ] 定价和分发设置
- [ ] 选择发布地区
- [ ] 年龄分级

## ✅ 测试

### 功能测试
- [x] 右键菜单保存
- [x] 侧边栏显示
- [x] Popup 显示
- [x] 复制功能
- [x] 搜索功能
- [x] 收藏功能
- [x] 删除功能
- [x] 排序功能

### 兼容性测试
- [ ] Chrome 最新版本
- [ ] Chrome Beta
- [ ] Edge 浏览器
- [ ] Brave 浏览器
- [ ] Windows 11
- [ ] macOS
- [ ] Linux

### 性能测试
- [ ] 大量 Prompt（100+）性能
- [ ] 搜索响应时间
- [ ] 内存占用
- [ ] CPU 占用

## ✅ 安全性

- [ ] 无敏感信息硬编码
- [ ] 权限最小化
- [ ] 输入验证
- [ ] XSS 防护
- [ ] 安全代码审查

## ✅ 法律合规

- [ ] 开源协议正确
- [ ] 第三方库协议检查
- [ ] 隐私政策（如需要）
- [ ] 服务条款（如需要）
- [ ] GDPR 合规（如面向欧盟）

## ✅ 营销准备

- [ ] 演示视频录制
- [ ] 宣传图制作
- [ ] Social media 文案准备
- [ ] Product Hunt 页面准备
- [ ] 技术博客文章准备
- [ ] Reddit/Twitter 发布计划

## ✅ 监控和反馈

- [ ] GitHub Issues 开启
- [ ] 邮件反馈渠道
- [ ] 社交媒体账号
- [ ] 分析工具（可选）
- [ ] 崩溃报告（可选）

## ✅ 发布后

- [ ] 监控 Issues 和评论
- [ ] 快速响应问题
- [ ] 收集用户反馈
- [ ] 规划下一版本
- [ ] 感谢贡献者

---

## 🚀 发布步骤

### 1. GitHub 发布

```bash
# 1. 确保所有改动已提交
git status

# 2. 创建 tag
git tag -a v0.1.0 -m "Release v0.1.0 - MVP"

# 3. 推送到 GitHub
git push origin main
git push origin v0.1.0

# 4. 在 GitHub 创建 Release
# - 选择 tag: v0.1.0
# - 填写 Release notes
# - 上传 dist.zip（可选）
```

### 2. Chrome Web Store 发布

1. 登录 [Chrome Web Store 开发者控制台](https://chrome.google.com/webstore/devcenter)
2. 点击「新增项目」
3. 上传打包好的 zip 文件
4. 填写商店信息
5. 上传截图和宣传图
6. 提交审核
7. 等待审核通过（通常 1-3 天）

### 3. 宣传推广

- [ ] Product Hunt 发布
- [ ] Reddit 发帖
- [ ] Twitter/X 发推
- [ ] Dev.to 文章
- [ ] Hacker News
- [ ] 相关社区分享

---

## 📝 版本号规则

遵循语义化版本 (Semantic Versioning):

- **MAJOR**: 不兼容的 API 修改
- **MINOR**: 向下兼容的功能性新增
- **PATCH**: 向下兼容的问题修正

示例：
- `0.1.0` → `0.1.1` (Bug 修复)
- `0.1.1` → `0.2.0` (新功能)
- `0.9.0` → `1.0.0` (重大更新)

---

**完成所有检查项后，就可以发布了！** 🎉
