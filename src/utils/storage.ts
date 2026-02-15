import type { PromptProject, PromptSnapshot, StorageData, AppSettings } from '@/types/prompt';
import { DEFAULT_SETTINGS } from '@/types/prompt';

/**
 * Chrome Storage API 封装工具
 */
class StorageManager {
  private readonly STORAGE_KEY = 'prompt_manager_data';

  /**
   * 获取所有数据
   */
  async getData(): Promise<StorageData> {
    try {
      const result = await chrome.storage.local.get(this.STORAGE_KEY);
      const data = result[this.STORAGE_KEY];
      
      if (!data) {
        return this.getDefaultData();
      }
      
      return data as StorageData;
    } catch (error) {
      console.error('Failed to get data from storage:', error);
      return this.getDefaultData();
    }
  }

  /**
   * 保存所有数据
   */
  async setData(data: StorageData): Promise<void> {
    try {
      await chrome.storage.local.set({ [this.STORAGE_KEY]: data });
    } catch (error) {
      console.error('Failed to save data to storage:', error);
      throw error;
    }
  }

  /**
   * 获取所有项目
   */
  async getProjects(): Promise<PromptProject[]> {
    const data = await this.getData();
    return data.projects || [];
  }

  /**
   * 添加新项目
   */
  async addProject(project: PromptProject): Promise<void> {
    const data = await this.getData();
    data.projects.push(project);
    await this.setData(data);
  }

  /**
   * 更新项目
   */
  async updateProject(projectId: string, updates: Partial<PromptProject>): Promise<void> {
    const data = await this.getData();
    const index = data.projects.findIndex(p => p.id === projectId);
    
    if (index === -1) {
      throw new Error(`Project with id ${projectId} not found`);
    }
    
    data.projects[index] = {
      ...data.projects[index],
      ...updates,
      updatedAt: Date.now(),
    };
    
    await this.setData(data);
  }

  /**
   * 删除项目
   */
  async deleteProject(projectId: string): Promise<void> {
    const data = await this.getData();
    data.projects = data.projects.filter(p => p.id !== projectId);
    // 同时删除相关快照
    data.snapshots = data.snapshots.filter(s => s.projectId !== projectId);
    await this.setData(data);
  }

  /**
   * 获取项目的快照列表
   */
  async getSnapshots(projectId: string): Promise<PromptSnapshot[]> {
    const data = await this.getData();
    return data.snapshots.filter(s => s.projectId === projectId);
  }

  /**
   * 添加快照
   */
  async addSnapshot(snapshot: PromptSnapshot): Promise<void> {
    const data = await this.getData();
    data.snapshots.push(snapshot);
    await this.setData(data);
  }

  /**
   * 获取设置
   */
  async getSettings(): Promise<AppSettings> {
    const data = await this.getData();
    return data.settings || DEFAULT_SETTINGS;
  }

  /**
   * 更新设置
   */
  async updateSettings(updates: Partial<AppSettings>): Promise<void> {
    const data = await this.getData();
    data.settings = {
      ...data.settings,
      ...updates,
    };
    await this.setData(data);
  }

  /**
   * 导出数据（JSON）
   */
  async exportData(): Promise<string> {
    const data = await this.getData();
    return JSON.stringify(data, null, 2);
  }

  /**
   * 导入数据
   */
  async importData(jsonString: string): Promise<void> {
    try {
      const data = JSON.parse(jsonString) as StorageData;
      await this.setData(data);
    } catch (error) {
      console.error('Failed to import data:', error);
      throw new Error('Invalid JSON data');
    }
  }

  /**
   * 清空所有数据
   */
  async clearAll(): Promise<void> {
    await chrome.storage.local.remove(this.STORAGE_KEY);
  }

  /**
   * 获取默认数据
   */
  private getDefaultData(): StorageData {
    return {
      projects: [],
      snapshots: [],
      settings: DEFAULT_SETTINGS,
    };
  }
}

// 导出单例
export const storage = new StorageManager();
