import { storage } from './storage';
import type { StorageData, PromptProject, PromptSnapshot } from '@/types/prompt';

/**
 * 数据导出/导入管理器
 */
export class DataManager {
  /**
   * 导出所有数据为 JSON
   */
  static async exportToJSON(): Promise<string> {
    const data = await storage.getData();
    return JSON.stringify(data, null, 2);
  }

  /**
   * 导出项目为 CSV
   */
  static async exportProjectsToCSV(): Promise<string> {
    const projects = await storage.getProjects();
    
    // CSV 头部
    const headers = [
      'ID',
      'Title',
      'Description',
      'Positive Tags',
      'Negative Tags',
      'Parameters',
      'Business Tags',
      'Starred',
      'Created At',
      'Updated At',
    ];

    // CSV 行
    const rows = projects.map((project) => [
      project.id,
      this.escapeCSV(project.title),
      this.escapeCSV(project.description || ''),
      this.escapeCSV(project.content.positive.map((f) => `${f.text}(${f.weight})`).join('; ')),
      this.escapeCSV(project.content.negative.map((f) => `${f.text}(${f.weight})`).join('; ')),
      this.escapeCSV(project.content.params.map((p) => `${p.key}=${p.value}`).join('; ')),
      this.escapeCSV(project.tags.join('; ')),
      project.starred ? 'Yes' : 'No',
      new Date(project.createdAt).toISOString(),
      new Date(project.updatedAt).toISOString(),
    ]);

    // 组合 CSV
    const csv = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    return csv;
  }

  /**
   * 导出快照为 CSV
   */
  static async exportSnapshotsToCSV(): Promise<string> {
    const data = await storage.getData();
    const snapshots = data.snapshots;

    // CSV 头部
    const headers = [
      'ID',
      'Project ID',
      'Version',
      'Title',
      'Rating',
      'Notes',
      'Created At',
    ];

    // CSV 行
    const rows = snapshots.map((snapshot) => [
      snapshot.id,
      snapshot.projectId,
      snapshot.version.toString(),
      this.escapeCSV(snapshot.snapshot.title),
      snapshot.metrics?.rating?.toString() || '',
      this.escapeCSV(snapshot.metrics?.notes || ''),
      new Date(snapshot.createdAt).toISOString(),
    ]);

    // 组合 CSV
    const csv = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    return csv;
  }

  /**
   * 下载文件
   */
  static downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * 导出所有数据（JSON 格式）
   */
  static async exportAll(): Promise<void> {
    const json = await this.exportToJSON();
    const filename = `prompt-manager-backup-${Date.now()}.json`;
    this.downloadFile(json, filename, 'application/json');
  }

  /**
   * 导出项目（CSV 格式）
   */
  static async exportProjectsCSV(): Promise<void> {
    const csv = await this.exportProjectsToCSV();
    const filename = `prompt-manager-projects-${Date.now()}.csv`;
    this.downloadFile(csv, filename, 'text/csv');
  }

  /**
   * 导出快照（CSV 格式）
   */
  static async exportSnapshotsCSV(): Promise<void> {
    const csv = await this.exportSnapshotsToCSV();
    const filename = `prompt-manager-snapshots-${Date.now()}.csv`;
    this.downloadFile(csv, filename, 'text/csv');
  }

  /**
   * 从 JSON 导入数据
   */
  static async importFromJSON(jsonString: string): Promise<{
    success: boolean;
    message: string;
    stats?: {
      projects: number;
      snapshots: number;
    };
  }> {
    try {
      const data: StorageData = JSON.parse(jsonString);

      // 验证数据结构
      if (!data.projects || !Array.isArray(data.projects)) {
        return {
          success: false,
          message: '无效的数据格式：缺少 projects 字段',
        };
      }

      if (!data.snapshots || !Array.isArray(data.snapshots)) {
        return {
          success: false,
          message: '无效的数据格式：缺少 snapshots 字段',
        };
      }

      // 保存数据
      await storage.setData(data);

      return {
        success: true,
        message: '导入成功！',
        stats: {
          projects: data.projects.length,
          snapshots: data.snapshots.length,
        },
      };
    } catch (error) {
      console.error('Import error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : '导入失败',
      };
    }
  }

  /**
   * 合并导入（不覆盖现有数据）
   */
  static async mergeImport(jsonString: string): Promise<{
    success: boolean;
    message: string;
    stats?: {
      projectsAdded: number;
      snapshotsAdded: number;
      projectsSkipped: number;
      snapshotsSkipped: number;
    };
  }> {
    try {
      const importData: StorageData = JSON.parse(jsonString);
      const currentData = await storage.getData();

      // 统计
      let projectsAdded = 0;
      let projectsSkipped = 0;
      let snapshotsAdded = 0;
      let snapshotsSkipped = 0;

      // 合并项目（根据 ID 去重）
      const existingProjectIds = new Set(currentData.projects.map((p) => p.id));
      for (const project of importData.projects) {
        if (!existingProjectIds.has(project.id)) {
          currentData.projects.push(project);
          projectsAdded++;
        } else {
          projectsSkipped++;
        }
      }

      // 合并快照（根据 ID 去重）
      const existingSnapshotIds = new Set(currentData.snapshots.map((s) => s.id));
      for (const snapshot of importData.snapshots) {
        if (!existingSnapshotIds.has(snapshot.id)) {
          currentData.snapshots.push(snapshot);
          snapshotsAdded++;
        } else {
          snapshotsSkipped++;
        }
      }

      // 保存合并后的数据
      await storage.setData(currentData);

      return {
        success: true,
        message: '合并成功！',
        stats: {
          projectsAdded,
          snapshotsAdded,
          projectsSkipped,
          snapshotsSkipped,
        },
      };
    } catch (error) {
      console.error('Merge import error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : '合并失败',
      };
    }
  }

  /**
   * CSV 字段转义
   */
  private static escapeCSV(value: string): string {
    // 如果包含逗号、引号或换行，需要用引号包裹
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      // 引号需要双写
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  /**
   * 读取文件内容
   */
  static readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
}
