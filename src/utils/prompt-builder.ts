import type { PromptFragment, AIParameter, PromptProject } from '@/types/prompt';

/**
 * Prompt 构建器 - 将碎片转换为不同模型的字符串
 */
export class PromptBuilder {
  /**
   * 构建 Midjourney 格式的 Prompt
   */
  static buildMidjourney(project: PromptProject): string {
    const parts: string[] = [];

    // 构建正面 Prompt
    const positivePrompt = this.fragmentsToString(project.content.positive, 'midjourney');
    if (positivePrompt) {
      parts.push(positivePrompt);
    }

    // 添加参数
    const params = this.paramsToString(project.content.params);
    if (params) {
      parts.push(params);
    }

    return parts.join(' ');
  }

  /**
   * 构建 Stable Diffusion 格式的 Prompt
   */
  static buildStableDiffusion(project: PromptProject): string {
    const parts: string[] = [];

    // 正面 Prompt
    const positivePrompt = this.fragmentsToString(project.content.positive, 'stable-diffusion');
    if (positivePrompt) {
      parts.push(positivePrompt);
    }

    // 负面 Prompt
    const negativePrompt = this.fragmentsToString(project.content.negative, 'stable-diffusion');
    if (negativePrompt) {
      parts.push(`Negative prompt: ${negativePrompt}`);
    }

    // 参数
    const params = this.paramsToSDFormat(project.content.params);
    if (params) {
      parts.push(params);
    }

    return parts.join('\n');
  }

  /**
   * 将碎片数组转换为字符串
   */
  private static fragmentsToString(
    fragments: PromptFragment[],
    format: 'midjourney' | 'stable-diffusion'
  ): string {
    if (!fragments || fragments.length === 0) return '';

    return fragments
      .map(fragment => {
        const text = fragment.text;
        const weight = fragment.weight;

        // 如果权重为 1.0，直接返回文本
        if (Math.abs(weight - 1.0) < 0.01) {
          return text;
        }

        // 根据不同格式处理权重
        if (format === 'midjourney') {
          // Midjourney: (text::weight)
          return `(${text}::${weight.toFixed(1)})`;
        } else {
          // Stable Diffusion: (text:weight)
          return `(${text}:${weight.toFixed(1)})`;
        }
      })
      .join(', ');
  }

  /**
   * 将参数数组转换为 Midjourney 字符串
   */
  private static paramsToString(params: AIParameter[]): string {
    if (!params || params.length === 0) return '';

    return params
      .map(param => `${param.key} ${param.value}`)
      .join(' ');
  }

  /**
   * 将参数数组转换为 Stable Diffusion 格式
   */
  private static paramsToSDFormat(params: AIParameter[]): string {
    if (!params || params.length === 0) return '';

    return params
      .map(param => {
        // SD 格式: Steps: 20, Sampler: DPM++ 2M, etc.
        return `${param.label}: ${param.value}`;
      })
      .join(', ');
  }
}

/**
 * 生成唯一 ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 复制文本到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    
    // 降级方案
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch (fallbackError) {
      console.error('Fallback copy failed:', fallbackError);
      return false;
    }
  }
}

/**
 * 格式化日期
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  // 小于 1 分钟
  if (diff < 60000) {
    return '刚刚';
  }

  // 小于 1 小时
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)} 分钟前`;
  }

  // 小于 24 小时
  if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)} 小时前`;
  }

  // 小于 7 天
  if (diff < 604800000) {
    return `${Math.floor(diff / 86400000)} 天前`;
  }

  // 返回具体日期
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}
