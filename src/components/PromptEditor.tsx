import React, { useState, useEffect } from 'react';
import { X, Save, Eye } from 'lucide-react';
import type { PromptProject, PromptFragment, AIParameter } from '@/types/prompt';
import { storage } from '@/utils/storage';
import { PromptBuilder, generateId } from '@/utils/prompt-builder';
import { TagEditor } from '@/components/TagEditor';
import { TagLibrary } from '@/components/TagLibrary';

interface PromptEditorProps {
  projectId?: string; // 如果提供，则是编辑模式；否则是新建模式
  onClose: () => void;
  onSave: () => void;
}

export const PromptEditor: React.FC<PromptEditorProps> = ({
  projectId,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [positiveFragments, setPositiveFragments] = useState<PromptFragment[]>([]);
  const [negativeFragments, setNegativeFragments] = useState<PromptFragment[]>([]);
  const [parameters, setParameters] = useState<AIParameter[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [showLibrary, setShowLibrary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState<'midjourney' | 'stable-diffusion'>('midjourney');

  // 加载现有项目（编辑模式）
  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const loadProject = async () => {
    if (!projectId) return;

    setLoading(true);
    try {
      const projects = await storage.getProjects();
      const project = projects.find((p) => p.id === projectId);
      
      if (project) {
        setTitle(project.title);
        setDescription(project.description || '');
        setPositiveFragments(project.content.positive);
        setNegativeFragments(project.content.negative);
        setParameters(project.content.params);
        setTags(project.tags);
      }
    } catch (error) {
      console.error('Failed to load project:', error);
      alert('加载失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('请输入标题');
      return;
    }

    if (positiveFragments.length === 0) {
      alert('请至少添加一个正面标签');
      return;
    }

    setLoading(true);
    try {
      const project: PromptProject = {
        id: projectId || generateId(),
        title: title.trim(),
        description: description.trim(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: {
          positive: positiveFragments,
          negative: negativeFragments,
          params: parameters,
        },
        tags,
        starred: false,
      };

      if (projectId) {
        await storage.updateProject(projectId, project);
      } else {
        await storage.addProject(project);
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFromLibrary = (fragment: Omit<PromptFragment, 'id'>) => {
    const newFragment: PromptFragment = {
      ...fragment,
      id: generateId(),
    };
    setPositiveFragments([...positiveFragments, newFragment]);
  };

  // 预览生成的 Prompt
  const getPreview = () => {
    const tempProject: PromptProject = {
      id: 'preview',
      title,
      description,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      content: {
        positive: positiveFragments,
        negative: negativeFragments,
        params: parameters,
      },
      tags,
      starred: false,
    };

    if (previewMode === 'midjourney') {
      return PromptBuilder.buildMidjourney(tempProject);
    } else {
      return PromptBuilder.buildStableDiffusion(tempProject);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {projectId ? '编辑 Prompt' : '新建 Prompt'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">加载中...</div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {/* 左侧：基本信息和编辑器 */}
              <div className="col-span-2 space-y-6">
                {/* 基本信息 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      标题 *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="给这个 Prompt 起个名字..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      描述
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="描述这个 Prompt 的用途..."
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>

                {/* 正面标签编辑器 */}
                <div className="card">
                  <TagEditor
                    fragments={positiveFragments}
                    onChange={setPositiveFragments}
                    type="positive"
                  />
                </div>

                {/* 负面标签编辑器 */}
                <div className="card">
                  <TagEditor
                    fragments={negativeFragments}
                    onChange={setNegativeFragments}
                    type="negative"
                  />
                </div>

                {/* 预览 */}
                <div className="card">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Eye size={18} />
                      预览
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPreviewMode('midjourney')}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          previewMode === 'midjourney'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Midjourney
                      </button>
                      <button
                        onClick={() => setPreviewMode('stable-diffusion')}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          previewMode === 'stable-diffusion'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Stable Diffusion
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap break-words">
                    {getPreview() || '暂无内容'}
                  </div>
                </div>
              </div>

              {/* 右侧：标签库 */}
              <div className="card">
                <TagLibrary onSelect={handleAddFromLibrary} />
              </div>
            </div>
          )}
        </div>

        {/* 底部操作栏 */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            {positiveFragments.length} 个正面标签 · {negativeFragments.length} 个负面标签
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save size={18} />
              {loading ? '保存中...' : '保存'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
