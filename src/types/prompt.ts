/**
 * Prompt 碎片类型
 */
export type FragmentType = 
  | 'subject'      // 主体
  | 'style'        // 风格
  | 'lighting'     // 光效
  | 'composition'  // 构图
  | 'technique'    // 技法
  | 'custom';      // 自定义

/**
 * Prompt 碎片（标签）
 */
export interface PromptFragment {
  id: string;
  text: string;           // 英文指令，如 "cyberpunk"
  translation?: string;   // 中文翻译，如 "赛博朋克"
  type: FragmentType;
  weight: number;         // 权重，默认 1.0
  isLocked: boolean;      // 锁定后，在"随机演化"功能中不会被替换
}

/**
 * AI 参数
 */
export interface AIParameter {
  key: string;            // 如 "--ar", "--v", "steps"
  value: string | number;
  label: string;          // UI 显示名称，如 "Aspect Ratio"
}

/**
 * Prompt 项目（核心实体）
 */
export interface PromptProject {
  id: string;
  title: string;          // 项目名称
  description?: string;
  coverUrl?: string;      // 该 Prompt 生成的代表作封面
  createdAt: number;
  updatedAt: number;
  
  // 核心指令数据
  content: {
    positive: PromptFragment[];  // 正面提示词块
    negative: PromptFragment[];  // 负面提示词块（针对 SD）
    params: AIParameter[];       // 比例、模型、种子等参数
  };

  tags: string[];         // 关联的业务标签
  starred: boolean;       // 收藏状态
}

/**
 * Prompt 快照（版本控制）
 */
export interface PromptSnapshot {
  id: string;
  projectId: string;      // 关联的主项目 ID
  version: number;        // 版本号（从 1 开始）
  
  // 快照数据（完整的 Prompt 状态）
  snapshot: {
    title: string;
    description?: string;
    positive: PromptFragment[];
    negative: PromptFragment[];
    params: AIParameter[];
    tags: string[];
  };
  
  // 生成的完整字符串
  fullString: {
    midjourney: string;
    stableDiffusion: string;
  };
  
  // 关联图片
  imageUrl?: string;      // 生成的结果图预览
  imageFile?: string;     // Base64 或本地存储的图片
  
  // 用户评价
  metrics?: {
    rating?: number;      // 用户打分 (1-5)
    modelName: string;    // 使用的模型名称
    generationTime?: number; // 生成耗时
    notes?: string;       // 用户备注
  };
  
  createdAt: number;
}

/**
 * 存储结构
 */
export interface StorageData {
  projects: PromptProject[];
  snapshots: PromptSnapshot[];
  settings: AppSettings;
}

/**
 * 应用设置
 */
export interface AppSettings {
  defaultModel: 'midjourney' | 'stable-diffusion' | 'dalle';
  theme: 'light' | 'dark' | 'auto';
  autoSave: boolean;
  showTutorial: boolean;
}

/**
 * 默认设置
 */
export const DEFAULT_SETTINGS: AppSettings = {
  defaultModel: 'midjourney',
  theme: 'auto',
  autoSave: true,
  showTutorial: true,
};
