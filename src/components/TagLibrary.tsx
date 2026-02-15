import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import type { PromptFragment, FragmentType } from '@/types/prompt';

interface TagLibraryProps {
  onSelect: (fragment: Omit<PromptFragment, 'id'>) => void;
}

// 预设标签库
const PRESET_TAGS: Array<Omit<PromptFragment, 'id'>> = [
  // 技法类
  { text: 'masterpiece', translation: '杰作', type: 'technique', weight: 1.2, isLocked: false },
  { text: 'best quality', translation: '最佳质量', type: 'technique', weight: 1.2, isLocked: false },
  { text: 'high quality', translation: '高质量', type: 'technique', weight: 1.1, isLocked: false },
  { text: 'ultra detailed', translation: '超精细', type: 'technique', weight: 1.1, isLocked: false },
  { text: '8k', translation: '8K分辨率', type: 'technique', weight: 1.0, isLocked: false },
  { text: 'photorealistic', translation: '照片级真实', type: 'technique', weight: 1.2, isLocked: false },
  
  // 主体类
  { text: '1girl', translation: '一个女孩', type: 'subject', weight: 1.0, isLocked: false },
  { text: '1boy', translation: '一个男孩', type: 'subject', weight: 1.0, isLocked: false },
  { text: 'solo', translation: '单人', type: 'subject', weight: 1.0, isLocked: false },
  { text: 'portrait', translation: '肖像', type: 'subject', weight: 1.0, isLocked: false },
  { text: 'full body', translation: '全身', type: 'subject', weight: 1.0, isLocked: false },
  { text: 'character', translation: '角色', type: 'subject', weight: 1.0, isLocked: false },
  
  // 风格类
  { text: 'anime', translation: '动漫', type: 'style', weight: 1.2, isLocked: false },
  { text: 'cyberpunk', translation: '赛博朋克', type: 'style', weight: 1.3, isLocked: false },
  { text: 'fantasy', translation: '奇幻', type: 'style', weight: 1.2, isLocked: false },
  { text: 'realistic', translation: '写实', type: 'style', weight: 1.2, isLocked: false },
  { text: 'oil painting', translation: '油画', type: 'style', weight: 1.2, isLocked: false },
  { text: 'watercolor', translation: '水彩', type: 'style', weight: 1.2, isLocked: false },
  { text: 'sketch', translation: '素描', type: 'style', weight: 1.1, isLocked: false },
  { text: 'studio ghibli', translation: '吉卜力风格', type: 'style', weight: 1.3, isLocked: false },
  
  // 光效类
  { text: 'cinematic lighting', translation: '电影级光效', type: 'lighting', weight: 1.2, isLocked: false },
  { text: 'neon lights', translation: '霓虹灯', type: 'lighting', weight: 1.2, isLocked: false },
  { text: 'volumetric lighting', translation: '体积光', type: 'lighting', weight: 1.2, isLocked: false },
  { text: 'rim lighting', translation: '轮廓光', type: 'lighting', weight: 1.1, isLocked: false },
  { text: 'god rays', translation: '上帝之光', type: 'lighting', weight: 1.2, isLocked: false },
  { text: 'sunset', translation: '日落', type: 'lighting', weight: 1.0, isLocked: false },
  { text: 'golden hour', translation: '黄金时刻', type: 'lighting', weight: 1.2, isLocked: false },
  
  // 构图类
  { text: 'close-up', translation: '特写', type: 'composition', weight: 1.0, isLocked: false },
  { text: 'wide angle', translation: '广角', type: 'composition', weight: 1.0, isLocked: false },
  { text: 'from above', translation: '俯视', type: 'composition', weight: 1.0, isLocked: false },
  { text: 'from below', translation: '仰视', type: 'composition', weight: 1.0, isLocked: false },
  { text: 'dynamic angle', translation: '动态角度', type: 'composition', weight: 1.1, isLocked: false },
  { text: 'centered', translation: '居中构图', type: 'composition', weight: 1.0, isLocked: false },
];

const TYPE_COLORS: Record<FragmentType, string> = {
  subject: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
  style: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
  lighting: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
  composition: 'bg-green-100 text-green-700 hover:bg-green-200',
  technique: 'bg-pink-100 text-pink-700 hover:bg-pink-200',
  custom: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
};

const TYPE_LABELS: Record<FragmentType, string> = {
  subject: '主体',
  style: '风格',
  lighting: '光效',
  composition: '构图',
  technique: '技法',
  custom: '自定义',
};

export const TagLibrary: React.FC<TagLibraryProps> = ({ onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<FragmentType | 'all'>('all');

  const filteredTags = PRESET_TAGS.filter((tag) => {
    const matchesSearch =
      searchQuery === '' ||
      tag.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.translation?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'all' || tag.type === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">标签库</h3>
        
        {/* 搜索框 */}
        <div className="relative mb-3">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="搜索标签..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* 类型筛选 */}
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              selectedType === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            全部
          </button>
          {Object.entries(TYPE_LABELS).map(([type, label]) => (
            <button
              key={type}
              onClick={() => setSelectedType(type as FragmentType)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedType === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 标签列表 */}
      <div className="max-h-96 overflow-y-auto space-y-2">
        {filteredTags.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            没有找到匹配的标签
          </div>
        ) : (
          filteredTags.map((tag, index) => (
            <button
              key={`${tag.text}-${index}`}
              onClick={() => onSelect(tag)}
              className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                TYPE_COLORS[tag.type]
              }`}
            >
              <div className="flex-1 text-left">
                <div className="font-mono text-sm">{tag.text}</div>
                {tag.translation && (
                  <div className="text-xs opacity-75">{tag.translation}</div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">{tag.weight.toFixed(1)}</span>
                <Plus size={16} />
              </div>
            </button>
          ))
        )}
      </div>

      <div className="text-xs text-gray-500 text-center pt-2 border-t">
        共 {PRESET_TAGS.length} 个预设标签 · 显示 {filteredTags.length} 个
      </div>
    </div>
  );
};
