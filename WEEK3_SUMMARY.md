# Week 3: 版本控制功能 (v0.3.0)

## 🎯 本周目标

实现完整的版本控制系统，包括版本快照、时间轴视图、版本对比和回滚功能，让用户可以追踪 Prompt 的演化历史。

## ✅ 已完成功能

### 1. 版本快照系统

#### 数据模型扩展
- **PromptSnapshot 接口增强**
  - 版本号自动递增
  - 完整的快照数据（包括所有 fragments、params、tags）
  - 支持 Midjourney 和 Stable Diffusion 双格式字符串
  - 图片关联（Base64 或 URL）
  - 用户评价系统（评分、备注）

#### 核心功能
- **VersionManager 工具类** (`src/utils/version-manager.ts`)
  - `createSnapshot`: 创建版本快照
  - `getProjectSnapshots`: 获取项目的所有快照
  - `deleteSnapshot`: 删除快照
  - `restoreFromSnapshot`: 从快照恢复（自动备份当前状态）
  - `compareSnapshots`: 对比两个快照的差异
  - `updateSnapshotRating`: 更新快照评分
  - `attachImageToSnapshot`: 关联图片到快照

### 2. 时间轴视图组件

- **TimelineView 组件** (`src/components/TimelineView.tsx`)
  - 美观的时间线布局
  - 显示所有版本快照（按时间倒序）
  - 版本标记（当前版本高亮）
  - 图片预览
  - 标签预览
  - 快照备注显示
  - 评分系统（1-5星）
  - 操作按钮：
    - 评分
    - 选择对比
    - 恢复版本
    - 删除快照

### 3. 图片上传功能

- **ImageUpload 组件** (`src/components/ImageUpload.tsx`)
  - 拖拽上传区域
  - 文件类型验证（仅图片）
  - 文件大小限制（最大 5MB）
  - Base64 编码存储
  - 预览功能
  - 更换/移除图片

### 4. 版本对比功能

- **CompareView 组件** (`src/components/CompareView.tsx`)
  - 双栏对比视图
  - 版本信息展示
  - 详细差异列表：
    - 标题变化
    - 描述变化
    - 正面标签变化（新增、移除、权重调整）
    - 负面标签变化（新增、移除）
    - 业务标签变化
  - 图片对比
  - 美观的颜色标记（绿色=新增，红色=移除，蓝色=修改）

### 5. 编辑器集成

- **PromptEditor 增强**
  - 保存时自动创建版本快照
  - 图片上传区域（编辑模式）
  - 快照备注输入
  - 与 VersionManager 集成

### 6. 主界面集成

- **SidePanel 增强**
  - 新增"版本历史"按钮（PromptCard 上）
  - 版本历史模态框
  - 版本对比模态框
  - 版本恢复功能
  - 完整的状态管理

- **PromptCard 增强**
  - 新增"历史"图标按钮
  - 点击查看该 Prompt 的版本历史

## 📁 新增文件

```
src/
├── utils/
│   └── version-manager.ts        # 版本管理工具类
├── components/
│   ├── TimelineView.tsx          # 时间轴视图组件
│   ├── ImageUpload.tsx           # 图片上传组件
│   └── CompareView.tsx           # 版本对比组件
```

## 🔄 修改文件

```
src/
├── types/
│   └── prompt.ts                 # 扩展 PromptSnapshot 接口
├── components/
│   ├── PromptEditor.tsx          # 集成版本快照功能
│   └── PromptCard.tsx            # 添加历史按钮
├── sidepanel/
│   └── SidePanel.tsx             # 集成版本历史和对比功能
public/
└── manifest.json                 # 版本号更新为 0.3.0
```

## 🎨 用户体验优化

### 视觉设计
- **时间线**：清晰的垂直时间线，易于追踪演化过程
- **版本标记**：当前版本用绿色标签高亮
- **颜色编码**：
  - 绿色：新增内容
  - 红色：移除内容
  - 蓝色：修改内容
  - 黄色：备注/提示

### 交互优化
- **智能对比**：点击两个版本即可快速对比
- **安全恢复**：恢复前自动备份当前状态
- **评分系统**：5星评价，快速记录版本质量
- **图片预览**：时间线上直接展示关联图片

### 性能优化
- **按需加载**：仅在打开历史时加载快照数据
- **Base64 存储**：图片直接存储，无需外部服务
- **快速切换**：模态框形式，不影响主界面

## 🔧 技术实现

### 版本号管理
```typescript
// 自动递增版本号
const existingSnapshots = await storage.getSnapshots(project.id);
const version = existingSnapshots.length + 1;
```

### 快照创建
```typescript
// 保存时自动创建快照
await VersionManager.createSnapshot(
  project,
  snapshotImage,      // 可选图片
  undefined,          // 可选评分
  snapshotNotes       // 可选备注
);
```

### 版本恢复
```typescript
// 恢复前自动备份
const currentProject = data.projects[projectIndex];
await this.createSnapshot(currentProject, undefined, undefined, '恢复前的自动备份');

// 恢复快照数据
data.projects[projectIndex] = {
  ...currentProject,
  ...snapshot.snapshot,
  updatedAt: Date.now(),
};
```

### 版本对比
```typescript
// 智能对比算法
const diff = VersionManager.compareSnapshots(snapshot1, snapshot2);
// 返回详细的新增、移除、修改列表
```

## 📊 数据结构

### PromptSnapshot (扩展后)
```typescript
interface PromptSnapshot {
  id: string;
  projectId: string;
  version: number;
  snapshot: {
    title: string;
    description?: string;
    positive: PromptFragment[];
    negative: PromptFragment[];
    params: AIParameter[];
    tags: string[];
  };
  fullString: {
    midjourney: string;
    stableDiffusion: string;
  };
  imageUrl?: string;
  imageFile?: string;
  metrics?: {
    rating?: number;
    modelName: string;
    generationTime?: number;
    notes?: string;
  };
  createdAt: number;
}
```

## 🎯 使用场景

### 1. Prompt 迭代优化
- 创建初始版本
- 不断调整参数和标签
- 对比不同版本的效果
- 恢复到最佳版本

### 2. A/B 测试
- 创建两个不同风格的版本
- 生成图片并上传
- 评分对比
- 选择最佳方案

### 3. 学习记录
- 记录每次修改的思路（备注）
- 查看演化时间线
- 回顾优化过程
- 积累经验

## 🚀 下一步计划 (Week 4)

### 高级功能
- [ ] 数据导出（JSON/CSV）
- [ ] 数据导入
- [ ] 批量操作
- [ ] 暗黑模式
- [ ] 设置面板
- [ ] 快捷键自定义
- [ ] 性能优化
- [ ] 错误日志

## 📝 测试建议

### 基础测试
1. 创建一个新 Prompt
2. 多次编辑并保存（每次保存会创建快照）
3. 点击"历史"按钮查看时间线
4. 给不同版本评分
5. 选择两个版本进行对比
6. 尝试恢复到旧版本

### 高级测试
1. 上传图片到快照
2. 添加备注
3. 删除某些快照
4. 对比有图片的版本
5. 恢复后验证数据完整性

### 边界测试
1. 测试空项目（无快照）
2. 测试大量快照（>20个）
3. 测试大图片（接近5MB）
4. 测试快速连续保存

## 🎉 Week 3 总结

本周成功实现了完整的版本控制系统，为 Prompt 管理器增加了强大的历史追踪和版本管理能力。用户现在可以：

- ✅ 自动记录每次修改
- ✅ 可视化版本演化过程
- ✅ 快速对比不同版本
- ✅ 安全地恢复到旧版本
- ✅ 关联生成的图片
- ✅ 评价和备注版本

这为 AI 绘图艺术家提供了专业级的 Prompt 管理和优化工具！🎨
