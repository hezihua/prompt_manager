import React from 'react';
import { Copy, Star, Trash2, Edit, Tag } from 'lucide-react';
import type { PromptProject } from '@/types/prompt';
import { formatDate, copyToClipboard } from '@/utils/prompt-builder';
import { PromptBuilder } from '@/utils/prompt-builder';

interface PromptCardProps {
  project: PromptProject;
  onDelete: (id: string) => void;
  onToggleStar: (id: string) => void;
  onEdit: (project: PromptProject) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  project,
  onDelete,
  onToggleStar,
  onEdit,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    // 默认使用 Midjourney 格式
    const promptText = PromptBuilder.buildMidjourney(project);
    const success = await copyToClipboard(promptText);
    
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getFragmentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      subject: 'bg-blue-100 text-blue-700',
      style: 'bg-purple-100 text-purple-700',
      lighting: 'bg-yellow-100 text-yellow-700',
      composition: 'bg-green-100 text-green-700',
      technique: 'bg-pink-100 text-pink-700',
      custom: 'bg-gray-100 text-gray-700',
    };
    return colors[type] || colors.custom;
  };

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      {/* 头部 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {project.title}
          </h3>
          {project.description && (
            <p className="text-sm text-gray-600">{project.description}</p>
          )}
        </div>
        <button
          onClick={() => onToggleStar(project.id)}
          className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors"
          title={project.starred ? '取消收藏' : '收藏'}
        >
          <Star
            size={20}
            className={project.starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}
          />
        </button>
      </div>

      {/* 标签云 */}
      {project.content.positive.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {project.content.positive.slice(0, 5).map((fragment) => (
            <span
              key={fragment.id}
              className={`px-2 py-1 rounded-md text-xs font-medium ${getFragmentTypeColor(fragment.type)}`}
              title={fragment.translation || fragment.text}
            >
              {fragment.text}
              {fragment.weight !== 1.0 && (
                <span className="ml-1 opacity-70">{fragment.weight.toFixed(1)}</span>
              )}
            </span>
          ))}
          {project.content.positive.length > 5 && (
            <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
              +{project.content.positive.length - 5}
            </span>
          )}
        </div>
      )}

      {/* 业务标签 */}
      {project.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-1 px-2 py-1 bg-gray-50 text-gray-700 rounded text-xs"
            >
              <Tag size={12} />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 底部操作栏 */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <span className="text-xs text-gray-500">
          {formatDate(project.updatedAt)}
        </span>
        
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(project)}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="编辑"
          >
            <Edit size={16} className="text-gray-600" />
          </button>
          <button
            onClick={handleCopy}
            className={`p-2 rounded transition-colors ${
              copied ? 'bg-green-100' : 'hover:bg-gray-100'
            }`}
            title="复制"
          >
            <Copy
              size={16}
              className={copied ? 'text-green-600' : 'text-gray-600'}
            />
          </button>
          <button
            onClick={() => onDelete(project.id)}
            className="p-2 hover:bg-red-50 rounded transition-colors"
            title="删除"
          >
            <Trash2 size={16} className="text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
};
