import React from 'react';
import { X, Plus, GripVertical } from 'lucide-react';
import type { PromptFragment, FragmentType } from '@/types/prompt';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TagEditorProps {
  fragments: PromptFragment[];
  onChange: (fragments: PromptFragment[]) => void;
  type: 'positive' | 'negative';
}

const FRAGMENT_TYPE_COLORS: Record<FragmentType, string> = {
  subject: 'bg-blue-100 text-blue-700 border-blue-300',
  style: 'bg-purple-100 text-purple-700 border-purple-300',
  lighting: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  composition: 'bg-green-100 text-green-700 border-green-300',
  technique: 'bg-pink-100 text-pink-700 border-pink-300',
  custom: 'bg-gray-100 text-gray-700 border-gray-300',
};

const FRAGMENT_TYPE_LABELS: Record<FragmentType, string> = {
  subject: '主体',
  style: '风格',
  lighting: '光效',
  composition: '构图',
  technique: '技法',
  custom: '自定义',
};

interface SortableTagProps {
  fragment: PromptFragment;
  onUpdate: (updates: Partial<PromptFragment>) => void;
  onRemove: () => void;
}

function SortableTag({ fragment, onUpdate, onRemove }: SortableTagProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: fragment.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-3 rounded-lg border-2 ${FRAGMENT_TYPE_COLORS[fragment.type]} ${
        isDragging ? 'shadow-lg' : ''
      }`}
    >
      {/* 拖拽手柄 */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        title="拖拽排序"
      >
        <GripVertical size={20} />
      </button>

      {/* 文本输入 */}
      <div className="flex-1 flex flex-col gap-2">
        <input
          type="text"
          value={fragment.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          className="bg-white/50 px-2 py-1 rounded border border-gray-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="输入标签文本"
        />
        {fragment.translation !== undefined && (
          <input
            type="text"
            value={fragment.translation || ''}
            onChange={(e) => onUpdate({ translation: e.target.value })}
            className="bg-white/50 px-2 py-1 rounded border border-gray-300 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="中文翻译（可选）"
          />
        )}
      </div>

      {/* 类型选择 */}
      <select
        value={fragment.type}
        onChange={(e) => onUpdate({ type: e.target.value as FragmentType })}
        className="px-2 py-1 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {Object.entries(FRAGMENT_TYPE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      {/* 权重滑块 */}
      <div className="flex items-center gap-2">
        <input
          type="range"
          min="0.5"
          max="2.0"
          step="0.1"
          value={fragment.weight}
          onChange={(e) => onUpdate({ weight: parseFloat(e.target.value) })}
          className="w-24"
          title={`权重: ${fragment.weight.toFixed(1)}`}
        />
        <span className="text-sm font-mono w-8 text-center">
          {fragment.weight.toFixed(1)}
        </span>
      </div>

      {/* 删除按钮 */}
      <button
        onClick={onRemove}
        className="p-1 hover:bg-red-100 rounded text-red-600 transition-colors"
        title="删除"
      >
        <X size={20} />
      </button>
    </div>
  );
}

export const TagEditor: React.FC<TagEditorProps> = ({
  fragments,
  onChange,
  type,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fragments.findIndex((f) => f.id === active.id);
      const newIndex = fragments.findIndex((f) => f.id === over.id);
      onChange(arrayMove(fragments, oldIndex, newIndex));
    }
  };

  const handleUpdate = (id: string, updates: Partial<PromptFragment>) => {
    onChange(
      fragments.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const handleRemove = (id: string) => {
    onChange(fragments.filter((f) => f.id !== id));
  };

  const handleAdd = () => {
    const newFragment: PromptFragment = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      text: '',
      type: 'custom',
      weight: 1.0,
      isLocked: false,
    };
    onChange([...fragments, newFragment]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">
          {type === 'positive' ? '正面提示词' : '负面提示词'}
        </h3>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
        >
          <Plus size={16} />
          添加标签
        </button>
      </div>

      {fragments.length === 0 ? (
        <div className="text-center py-8 text-gray-500 text-sm">
          暂无标签，点击上方按钮添加
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fragments.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {fragments.map((fragment) => (
                <SortableTag
                  key={fragment.id}
                  fragment={fragment}
                  onUpdate={(updates) => handleUpdate(fragment.id, updates)}
                  onRemove={() => handleRemove(fragment.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};
