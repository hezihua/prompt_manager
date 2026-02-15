import React, { useState } from 'react';
import { Plus, X, Sliders } from 'lucide-react';
import type { AIParameter } from '@/types/prompt';
import { generateId } from '@/utils/prompt-builder';

interface ParameterEditorProps {
  parameters: AIParameter[];
  onChange: (parameters: AIParameter[]) => void;
  modelType: 'midjourney' | 'stable-diffusion' | 'dalle';
}

// 预设参数模板
const PARAMETER_PRESETS = {
  midjourney: [
    { key: '--ar', label: '宽高比 (Aspect Ratio)', type: 'select', options: ['1:1', '16:9', '9:16', '4:3', '3:2', '2:3'] },
    { key: '--v', label: '版本 (Version)', type: 'select', options: ['5.2', '5.1', '5', '4', '3'] },
    { key: '--s', label: '风格化程度 (Stylize)', type: 'number', min: 0, max: 1000, default: 100 },
    { key: '--c', label: '混乱度 (Chaos)', type: 'number', min: 0, max: 100, default: 0 },
    { key: '--q', label: '质量 (Quality)', type: 'select', options: ['0.25', '0.5', '1', '2'] },
    { key: '--seed', label: '随机种子 (Seed)', type: 'number', min: 0, max: 4294967295 },
    { key: '--no', label: '排除内容 (No)', type: 'text' },
  ],
  'stable-diffusion': [
    { key: 'steps', label: '采样步数 (Steps)', type: 'number', min: 1, max: 150, default: 50 },
    { key: 'cfg_scale', label: '提示词相关性 (CFG Scale)', type: 'number', min: 1, max: 30, default: 7 },
    { key: 'width', label: '宽度 (Width)', type: 'select', options: ['512', '768', '1024'] },
    { key: 'height', label: '高度 (Height)', type: 'select', options: ['512', '768', '1024'] },
    { key: 'sampler', label: '采样器 (Sampler)', type: 'select', options: ['Euler', 'Euler a', 'DPM++ 2M', 'DDIM'] },
    { key: 'seed', label: '随机种子 (Seed)', type: 'number', min: -1, max: 4294967295, default: -1 },
    { key: 'batch_size', label: '批量大小 (Batch Size)', type: 'number', min: 1, max: 8, default: 1 },
  ],
  dalle: [
    { key: 'size', label: '尺寸 (Size)', type: 'select', options: ['256x256', '512x512', '1024x1024'] },
    { key: 'n', label: '生成数量 (Number)', type: 'number', min: 1, max: 10, default: 1 },
    { key: 'quality', label: '质量 (Quality)', type: 'select', options: ['standard', 'hd'] },
    { key: 'style', label: '风格 (Style)', type: 'select', options: ['vivid', 'natural'] },
  ],
};

export const ParameterEditor: React.FC<ParameterEditorProps> = ({
  parameters,
  onChange,
  modelType,
}) => {
  const [showPresets, setShowPresets] = useState(false);

  const presets = PARAMETER_PRESETS[modelType];

  const handleAdd = (preset?: typeof presets[0]) => {
    const newParam: AIParameter = {
      key: preset?.key || '',
      value: preset?.default || '',
      label: preset?.label || '',
    };
    onChange([...parameters, newParam]);
    setShowPresets(false);
  };

  const handleUpdate = (index: number, field: keyof AIParameter, value: string | number) => {
    const updated = [...parameters];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    onChange(parameters.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Sliders size={18} />
          AI 参数
        </h3>
        <button
          onClick={() => setShowPresets(!showPresets)}
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          + 添加参数
        </button>
      </div>

      {/* 预设参数列表 */}
      {showPresets && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            选择预设参数（{modelType}）
          </div>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((preset, index) => (
              <button
                key={index}
                onClick={() => handleAdd(preset)}
                className="text-left px-3 py-2 bg-white dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-800 rounded border border-gray-200 dark:border-gray-600 text-sm transition-colors"
              >
                <div className="font-medium text-gray-800 dark:text-gray-200">{preset.key}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{preset.label}</div>
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowPresets(false)}
            className="mt-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            取消
          </button>
        </div>
      )}

      {/* 参数列表 */}
      {parameters.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
          暂无参数，点击"添加参数"开始
        </div>
      ) : (
        <div className="space-y-3">
          {parameters.map((param, index) => {
            const preset = presets.find((p) => p.key === param.key);
            
            return (
              <div
                key={index}
                className="flex gap-2 items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex-1 space-y-2">
                  {/* Key */}
                  <input
                    type="text"
                    value={param.key}
                    onChange={(e) => handleUpdate(index, 'key', e.target.value)}
                    placeholder="参数名（如 --ar）"
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />

                  {/* Value */}
                  {preset?.type === 'select' ? (
                    <select
                      value={param.value}
                      onChange={(e) => handleUpdate(index, 'value', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">选择值</option>
                      {preset.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : preset?.type === 'number' ? (
                    <input
                      type="number"
                      value={param.value}
                      onChange={(e) => handleUpdate(index, 'value', e.target.value)}
                      min={preset.min}
                      max={preset.max}
                      placeholder={`值（${preset.min}-${preset.max}）`}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  ) : (
                    <input
                      type="text"
                      value={param.value}
                      onChange={(e) => handleUpdate(index, 'value', e.target.value)}
                      placeholder="参数值"
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  )}

                  {/* Label */}
                  <input
                    type="text"
                    value={param.label}
                    onChange={(e) => handleUpdate(index, 'label', e.target.value)}
                    placeholder="显示名称（可选）"
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <button
                  onClick={() => handleRemove(index)}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                  title="删除"
                >
                  <X size={18} className="text-red-600 dark:text-red-400" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* 参数说明 */}
      {parameters.length > 0 && (
        <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
          <strong>提示：</strong>参数将附加到生成的 Prompt 字符串末尾
        </div>
      )}
    </div>
  );
};
