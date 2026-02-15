import React from 'react';
import { X, ArrowRight, Plus, Minus, TrendingUp } from 'lucide-react';
import type { PromptSnapshot } from '@/types/prompt';
import { VersionManager } from '@/utils/version-manager';
import { formatDate } from '@/utils/prompt-builder';

interface CompareViewProps {
  snapshot1: PromptSnapshot;
  snapshot2: PromptSnapshot;
  onClose: () => void;
}

export const CompareView: React.FC<CompareViewProps> = ({
  snapshot1,
  snapshot2,
  onClose,
}) => {
  const diff = VersionManager.compareSnapshots(snapshot1, snapshot2);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">版本对比</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* 版本信息 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800">
                  版本 {snapshot1.version}
                </h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                  旧版本
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {snapshot1.snapshot.title}
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(snapshot1.createdAt)}
              </p>
              {snapshot1.imageUrl && (
                <img
                  src={snapshot1.imageUrl}
                  alt="版本 1"
                  className="mt-3 w-full h-32 object-cover rounded"
                />
              )}
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800">
                  版本 {snapshot2.version}
                </h3>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                  新版本
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {snapshot2.snapshot.title}
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(snapshot2.createdAt)}
              </p>
              {snapshot2.imageUrl && (
                <img
                  src={snapshot2.imageUrl}
                  alt="版本 2"
                  className="mt-3 w-full h-32 object-cover rounded"
                />
              )}
            </div>
          </div>

          {/* 差异列表 */}
          <div className="space-y-4">
            {/* 标题变化 */}
            {diff.titleChanged && (
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <TrendingUp size={18} />
                  标题变化
                </h4>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-red-50 border border-red-200 rounded p-3">
                    <p className="text-sm text-red-800">
                      {snapshot1.snapshot.title}
                    </p>
                  </div>
                  <ArrowRight className="text-gray-400" />
                  <div className="flex-1 bg-green-50 border border-green-200 rounded p-3">
                    <p className="text-sm text-green-800">
                      {snapshot2.snapshot.title}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 描述变化 */}
            {diff.descriptionChanged && (
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <TrendingUp size={18} />
                  描述变化
                </h4>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-red-50 border border-red-200 rounded p-3">
                    <p className="text-sm text-red-800">
                      {snapshot1.snapshot.description || '(无)'}
                    </p>
                  </div>
                  <ArrowRight className="text-gray-400" />
                  <div className="flex-1 bg-green-50 border border-green-200 rounded p-3">
                    <p className="text-sm text-green-800">
                      {snapshot2.snapshot.description || '(无)'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 正面标签变化 */}
            {(diff.positiveAdded.length > 0 ||
              diff.positiveRemoved.length > 0 ||
              diff.positiveModified.length > 0) && (
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">
                  正面标签变化
                </h4>
                <div className="space-y-3">
                  {/* 新增 */}
                  {diff.positiveAdded.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Plus size={16} className="text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          新增 ({diff.positiveAdded.length})
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 pl-6">
                        {diff.positiveAdded.map((text, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-green-50 border border-green-200 text-green-800 rounded text-sm font-mono"
                          >
                            {text}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 移除 */}
                  {diff.positiveRemoved.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Minus size={16} className="text-red-600" />
                        <span className="text-sm font-medium text-red-800">
                          移除 ({diff.positiveRemoved.length})
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 pl-6">
                        {diff.positiveRemoved.map((text, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-red-50 border border-red-200 text-red-800 rounded text-sm font-mono line-through"
                          >
                            {text}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 修改（权重） */}
                  {diff.positiveModified.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp size={16} className="text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          权重调整 ({diff.positiveModified.length})
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 pl-6">
                        {diff.positiveModified.map((text, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-blue-50 border border-blue-200 text-blue-800 rounded text-sm font-mono"
                          >
                            {text}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 负面标签变化 */}
            {(diff.negativeAdded.length > 0 || diff.negativeRemoved.length > 0) && (
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">
                  负面标签变化
                </h4>
                <div className="space-y-3">
                  {diff.negativeAdded.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Plus size={16} className="text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          新增 ({diff.negativeAdded.length})
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 pl-6">
                        {diff.negativeAdded.map((text, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-green-50 border border-green-200 text-green-800 rounded text-sm font-mono"
                          >
                            {text}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {diff.negativeRemoved.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Minus size={16} className="text-red-600" />
                        <span className="text-sm font-medium text-red-800">
                          移除 ({diff.negativeRemoved.length})
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 pl-6">
                        {diff.negativeRemoved.map((text, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-red-50 border border-red-200 text-red-800 rounded text-sm font-mono line-through"
                          >
                            {text}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 业务标签变化 */}
            {(diff.tagsAdded.length > 0 || diff.tagsRemoved.length > 0) && (
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">
                  业务标签变化
                </h4>
                <div className="space-y-3">
                  {diff.tagsAdded.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Plus size={16} className="text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          新增
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 pl-6">
                        {diff.tagsAdded.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {diff.tagsRemoved.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Minus size={16} className="text-red-600" />
                        <span className="text-sm font-medium text-red-800">
                          移除
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 pl-6">
                        {diff.tagsRemoved.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm line-through"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 无变化 */}
            {!diff.titleChanged &&
              !diff.descriptionChanged &&
              diff.positiveAdded.length === 0 &&
              diff.positiveRemoved.length === 0 &&
              diff.positiveModified.length === 0 &&
              diff.negativeAdded.length === 0 &&
              diff.negativeRemoved.length === 0 &&
              diff.tagsAdded.length === 0 &&
              diff.tagsRemoved.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">两个版本没有差异</p>
                </div>
              )}
          </div>
        </div>

        {/* 底部 */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
