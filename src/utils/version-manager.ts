import { storage } from './storage';
import { PromptBuilder, generateId } from './prompt-builder';
import type { PromptProject, PromptSnapshot } from '@/types/prompt';

/**
 * 版本控制管理器
 */
export class VersionManager {
  /**
   * 创建快照
   */
  static async createSnapshot(
    project: PromptProject,
    imageUrl?: string,
    rating?: number,
    notes?: string
  ): Promise<PromptSnapshot> {
    // 获取该项目的现有快照
    const existingSnapshots = await storage.getSnapshots(project.id);
    const version = existingSnapshots.length + 1;

    // 创建快照
    const snapshot: PromptSnapshot = {
      id: generateId(),
      projectId: project.id,
      version,
      snapshot: {
        title: project.title,
        description: project.description,
        positive: [...project.content.positive],
        negative: [...project.content.negative],
        params: [...project.content.params],
        tags: [...project.tags],
      },
      fullString: {
        midjourney: PromptBuilder.buildMidjourney(project),
        stableDiffusion: PromptBuilder.buildStableDiffusion(project),
      },
      imageUrl,
      metrics: {
        rating,
        modelName: 'midjourney', // 默认
        notes,
      },
      createdAt: Date.now(),
    };

    await storage.addSnapshot(snapshot);
    return snapshot;
  }

  /**
   * 获取项目的所有快照（按时间倒序）
   */
  static async getProjectSnapshots(projectId: string): Promise<PromptSnapshot[]> {
    const snapshots = await storage.getSnapshots(projectId);
    return snapshots.sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * 删除快照
   */
  static async deleteSnapshot(snapshotId: string): Promise<void> {
    const data = await storage.getData();
    data.snapshots = data.snapshots.filter((s) => s.id !== snapshotId);
    await storage.setData(data);
  }

  /**
   * 从快照恢复
   */
  static async restoreFromSnapshot(
    projectId: string,
    snapshotId: string
  ): Promise<void> {
    const data = await storage.getData();
    const snapshot = data.snapshots.find((s) => s.id === snapshotId);
    
    if (!snapshot) {
      throw new Error('Snapshot not found');
    }

    const projectIndex = data.projects.findIndex((p) => p.id === projectId);
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }

    // 在恢复前先创建当前状态的快照
    const currentProject = data.projects[projectIndex];
    await this.createSnapshot(currentProject, undefined, undefined, '恢复前的自动备份');

    // 恢复到快照状态
    data.projects[projectIndex] = {
      ...currentProject,
      title: snapshot.snapshot.title,
      description: snapshot.snapshot.description,
      content: {
        positive: snapshot.snapshot.positive,
        negative: snapshot.snapshot.negative,
        params: snapshot.snapshot.params,
      },
      tags: snapshot.snapshot.tags,
      updatedAt: Date.now(),
    };

    await storage.setData(data);
  }

  /**
   * 比较两个快照的差异
   */
  static compareSnapshots(
    snapshot1: PromptSnapshot,
    snapshot2: PromptSnapshot
  ): {
    titleChanged: boolean;
    descriptionChanged: boolean;
    positiveAdded: string[];
    positiveRemoved: string[];
    positiveModified: string[];
    negativeAdded: string[];
    negativeRemoved: string[];
    tagsAdded: string[];
    tagsRemoved: string[];
  } {
    const diff = {
      titleChanged: snapshot1.snapshot.title !== snapshot2.snapshot.title,
      descriptionChanged: snapshot1.snapshot.description !== snapshot2.snapshot.description,
      positiveAdded: [] as string[],
      positiveRemoved: [] as string[],
      positiveModified: [] as string[],
      negativeAdded: [] as string[],
      negativeRemoved: [] as string[],
      tagsAdded: [] as string[],
      tagsRemoved: [] as string[],
    };

    // 比较正面标签
    const pos1Texts = snapshot1.snapshot.positive.map((f) => f.text);
    const pos2Texts = snapshot2.snapshot.positive.map((f) => f.text);

    diff.positiveAdded = pos2Texts.filter((t) => !pos1Texts.includes(t));
    diff.positiveRemoved = pos1Texts.filter((t) => !pos2Texts.includes(t));

    // 比较权重变化
    snapshot1.snapshot.positive.forEach((f1) => {
      const f2 = snapshot2.snapshot.positive.find((f) => f.text === f1.text);
      if (f2 && f2.weight !== f1.weight) {
        diff.positiveModified.push(`${f1.text} (${f1.weight} → ${f2.weight})`);
      }
    });

    // 比较负面标签
    const neg1Texts = snapshot1.snapshot.negative.map((f) => f.text);
    const neg2Texts = snapshot2.snapshot.negative.map((f) => f.text);

    diff.negativeAdded = neg2Texts.filter((t) => !neg1Texts.includes(t));
    diff.negativeRemoved = neg1Texts.filter((t) => !neg2Texts.includes(t));

    // 比较业务标签
    diff.tagsAdded = snapshot2.snapshot.tags.filter((t) => !snapshot1.snapshot.tags.includes(t));
    diff.tagsRemoved = snapshot1.snapshot.tags.filter((t) => !snapshot2.snapshot.tags.includes(t));

    return diff;
  }

  /**
   * 更新快照评分
   */
  static async updateSnapshotRating(
    snapshotId: string,
    rating: number,
    notes?: string
  ): Promise<void> {
    const data = await storage.getData();
    const snapshot = data.snapshots.find((s) => s.id === snapshotId);
    
    if (!snapshot) {
      throw new Error('Snapshot not found');
    }

    snapshot.metrics = {
      ...snapshot.metrics,
      rating,
      notes: notes || snapshot.metrics?.notes,
      modelName: snapshot.metrics?.modelName || 'midjourney',
    };

    await storage.setData(data);
  }

  /**
   * 关联图片到快照
   */
  static async attachImageToSnapshot(
    snapshotId: string,
    imageUrl: string
  ): Promise<void> {
    const data = await storage.getData();
    const snapshot = data.snapshots.find((s) => s.id === snapshotId);
    
    if (!snapshot) {
      throw new Error('Snapshot not found');
    }

    snapshot.imageUrl = imageUrl;
    await storage.setData(data);
  }
}
