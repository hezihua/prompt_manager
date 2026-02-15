import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, Star, Clock } from 'lucide-react';
import type { PromptProject, PromptSnapshot } from '@/types/prompt';
import { storage } from '@/utils/storage';
import { VersionManager } from '@/utils/version-manager';
import { PromptCard } from '@/components/PromptCard';
import { PromptEditor } from '@/components/PromptEditor';
import { TimelineView } from '@/components/TimelineView';
import { CompareView } from '@/components/CompareView';

type SortBy = 'recent' | 'starred' | 'title';

export const SidePanel: React.FC = () => {
  const [projects, setProjects] = useState<PromptProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<PromptProject[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | undefined>();
  const [showTimeline, setShowTimeline] = useState(false);
  const [timelineProjectId, setTimelineProjectId] = useState<string | undefined>();
  const [compareSnapshots, setCompareSnapshots] = useState<{
    snapshot1: PromptSnapshot;
    snapshot2: PromptSnapshot;
  } | null>(null);

  // 加载项目列表
  const loadProjects = async () => {
    try {
      const data = await storage.getProjects();
      setProjects(data);
      setFilteredProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // 搜索和过滤
  useEffect(() => {
    let result = [...projects];

    // 搜索
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          p.content.positive.some((f) =>
            f.text.toLowerCase().includes(query) ||
            f.translation?.toLowerCase().includes(query)
          )
      );
    }

    // 排序
    if (sortBy === 'recent') {
      result.sort((a, b) => b.updatedAt - a.updatedAt);
    } else if (sortBy === 'starred') {
      result.sort((a, b) => {
        if (a.starred === b.starred) return b.updatedAt - a.updatedAt;
        return a.starred ? -1 : 1;
      });
    } else if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
    }

    setFilteredProjects(result);
  }, [projects, searchQuery, sortBy]);

  // 删除项目
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个 Prompt 吗？')) return;

    try {
      await storage.deleteProject(id);
      await loadProjects();
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('删除失败，请重试');
    }
  };

  // 切换收藏状态
  const handleToggleStar = async (id: string) => {
    try {
      const project = projects.find((p) => p.id === id);
      if (!project) return;

      await storage.updateProject(id, { starred: !project.starred });
      await loadProjects();
    } catch (error) {
      console.error('Failed to toggle star:', error);
    }
  };

  // 编辑项目
  const handleEdit = (project: PromptProject) => {
    setEditingProjectId(project.id);
    setShowEditor(true);
  };

  // 新建项目
  const handleCreate = () => {
    setEditingProjectId(undefined);
    setShowEditor(true);
  };

  // 关闭编辑器
  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingProjectId(undefined);
  };

  // 保存后刷新
  const handleSave = async () => {
    await loadProjects();
  };

  // 查看版本历史
  const handleViewHistory = (project: PromptProject) => {
    setTimelineProjectId(project.id);
    setShowTimeline(true);
  };

  // 恢复版本
  const handleRestore = async (snapshotId: string) => {
    if (!timelineProjectId) return;

    if (!confirm('确定要恢复到此版本吗？当前状态会自动保存为备份。')) return;

    try {
      await VersionManager.restoreFromSnapshot(timelineProjectId, snapshotId);
      await loadProjects();
      setShowTimeline(false);
      alert('恢复成功！');
    } catch (error) {
      console.error('Failed to restore snapshot:', error);
      alert('恢复失败，请重试');
    }
  };

  // 对比版本
  const handleCompare = (snapshot1: PromptSnapshot, snapshot2: PromptSnapshot) => {
    setCompareSnapshots({ snapshot1, snapshot2 });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Prompt 管理器</h1>
          <button
            className="btn-primary flex items-center gap-2"
            onClick={handleCreate}
          >
            <Plus size={20} />
            新建
          </button>
        </div>

        {/* 搜索栏 */}
        <div className="relative mb-3">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="搜索 Prompt..."
            className="input pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* 排序选项 */}
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('recent')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              sortBy === 'recent'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Clock size={16} />
            最近
          </button>
          <button
            onClick={() => setSortBy('starred')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              sortBy === 'starred'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Star size={16} />
            收藏
          </button>
          <button
            onClick={() => setSortBy('title')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              sortBy === 'title'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Filter size={16} />
            标题
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 p-4 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">加载中...</div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p className="text-lg mb-2">
              {searchQuery ? '没有找到匹配的 Prompt' : '还没有任何 Prompt'}
            </p>
            <p className="text-sm">
              {searchQuery
                ? '尝试使用其他关键词搜索'
                : '选中文本后右键点击「保存为 Prompt」开始使用'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <PromptCard
                key={project.id}
                project={project}
                onDelete={handleDelete}
                onToggleStar={handleToggleStar}
                onEdit={handleEdit}
                onViewHistory={handleViewHistory}
              />
            ))}
          </div>
        )}
      </div>

      {/* 底部统计 */}
      <div className="bg-white border-t border-gray-200 p-3 text-center text-sm text-gray-600">
        共 {projects.length} 个 Prompt
        {projects.filter((p) => p.starred).length > 0 &&
          ` · ${projects.filter((p) => p.starred).length} 个收藏`}
      </div>

      {/* 编辑器模态框 */}
      {showEditor && (
        <PromptEditor
          projectId={editingProjectId}
          onClose={handleCloseEditor}
          onSave={handleSave}
        />
      )}

      {/* 版本历史模态框 */}
      {showTimeline && timelineProjectId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* 头部 */}
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">版本历史</h2>
              <button
                onClick={() => setShowTimeline(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* 内容 */}
            <div className="flex-1 overflow-y-auto p-6">
              <TimelineView
                projectId={timelineProjectId}
                onRestore={handleRestore}
                onCompare={handleCompare}
              />
            </div>
          </div>
        </div>
      )}

      {/* 版本对比模态框 */}
      {compareSnapshots && (
        <CompareView
          snapshot1={compareSnapshots.snapshot1}
          snapshot2={compareSnapshots.snapshot2}
          onClose={() => setCompareSnapshots(null)}
        />
      )}
    </div>
  );
};
