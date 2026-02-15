import React, { useState, useEffect } from 'react';
import { Clock, Star, Trash2, RotateCcw, GitCompare } from 'lucide-react';
import type { PromptSnapshot } from '@/types/prompt';
import { VersionManager } from '@/utils/version-manager';
import { formatDate } from '@/utils/prompt-builder';

interface TimelineViewProps {
  projectId: string;
  onRestore: (snapshotId: string) => void;
  onCompare: (snapshot1: PromptSnapshot, snapshot2: PromptSnapshot) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  projectId,
  onRestore,
  onCompare,
}) => {
  const [snapshots, setSnapshots] = useState<PromptSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForCompare, setSelectedForCompare] = useState<PromptSnapshot | null>(null);

  useEffect(() => {
    loadSnapshots();
  }, [projectId]);

  const loadSnapshots = async () => {
    setLoading(true);
    try {
      const data = await VersionManager.getProjectSnapshots(projectId);
      setSnapshots(data);
    } catch (error) {
      console.error('Failed to load snapshots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (snapshotId: string) => {
    if (!confirm('确定要删除这个版本快照吗？')) return;

    try {
      await VersionManager.deleteSnapshot(snapshotId);
      await loadSnapshots();
    } catch (error) {
      console.error('Failed to delete snapshot:', error);
      alert('删除失败，请重试');
    }
  };

  const handleRating = async (snapshotId: string, rating: number) => {
    try {
      await VersionManager.updateSnapshotRating(snapshotId, rating);
      await loadSnapshots();
    } catch (error) {
      console.error('Failed to update rating:', error);
    }
  };

  const handleCompareSelect = (snapshot: PromptSnapshot) => {
    if (!selectedForCompare) {
      setSelectedForCompare(snapshot);
    } else {
      onCompare(selectedForCompare, snapshot);
      setSelectedForCompare(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (snapshots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Clock size={48} className="mb-4 opacity-50" />
        <p className="text-lg mb-2">还没有版本快照</p>
        <p className="text-sm">保存 Prompt 时会自动创建快照</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 提示信息 */}
      {selectedForCompare && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
          <div className="text-sm text-blue-800">
            已选择版本 {selectedForCompare.version}，请再选择一个版本进行对比
          </div>
          <button
            onClick={() => setSelectedForCompare(null)}
            className="text-blue-600 hover:text-blue-800 text-sm underline"
          >
            取消
          </button>
        </div>
      )}

      {/* 时间轴 */}
      <div className="relative">
        {/* 时间线 */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

        {/* 快照列表 */}
        <div className="space-y-6">
          {snapshots.map((snapshot, index) => (
            <div
              key={snapshot.id}
              className={`relative pl-16 ${
                selectedForCompare?.id === snapshot.id ? 'ring-2 ring-blue-500 rounded-lg p-2' : ''
              }`}
            >
              {/* 时间点 */}
              <div className="absolute left-6 top-2 w-5 h-5 bg-blue-500 rounded-full border-4 border-white shadow" />

              {/* 版本标签 */}
              {index === 0 && (
                <div className="absolute left-0 top-0 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                  当前
                </div>
              )}

              {/* 快照卡片 */}
              <div className="card hover:shadow-lg transition-shadow">
                {/* 头部 */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {snapshot.snapshot.title}
                      </h4>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                        v{snapshot.version}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {formatDate(snapshot.createdAt)}
                    </p>
                  </div>

                  {/* 评分 */}
                  {snapshot.metrics?.rating !== undefined && (
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={
                            star <= snapshot.metrics!.rating!
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* 图片预览 */}
                {snapshot.imageUrl && (
                  <div className="mb-3">
                    <img
                      src={snapshot.imageUrl}
                      alt="生成结果"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* 描述 */}
                {snapshot.snapshot.description && (
                  <p className="text-sm text-gray-600 mb-3">
                    {snapshot.snapshot.description}
                  </p>
                )}

                {/* 标签预览 */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {snapshot.snapshot.positive.slice(0, 5).map((fragment) => (
                    <span
                      key={fragment.id}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-mono"
                    >
                      {fragment.text}
                      {fragment.weight !== 1.0 && (
                        <span className="ml-1 opacity-70">{fragment.weight.toFixed(1)}</span>
                      )}
                    </span>
                  ))}
                  {snapshot.snapshot.positive.length > 5 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      +{snapshot.snapshot.positive.length - 5}
                    </span>
                  )}
                </div>

                {/* 备注 */}
                {snapshot.metrics?.notes && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 mb-3">
                    <p className="text-sm text-yellow-800">{snapshot.metrics.notes}</p>
                  </div>
                )}

                {/* 操作按钮 */}
                <div className="flex items-center gap-2 pt-3 border-t">
                  {/* 评分 */}
                  <div className="flex-1 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRating(snapshot.id, star)}
                        className="hover:scale-110 transition-transform"
                        title={`${star} 星`}
                      >
                        <Star
                          size={18}
                          className={
                            snapshot.metrics?.rating && star <= snapshot.metrics.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 hover:text-yellow-400'
                          }
                        />
                      </button>
                    ))}
                  </div>

                  {/* 对比 */}
                  <button
                    onClick={() => handleCompareSelect(snapshot)}
                    className={`p-2 rounded transition-colors ${
                      selectedForCompare?.id === snapshot.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                    title="对比版本"
                  >
                    <GitCompare size={18} />
                  </button>

                  {/* 恢复 */}
                  {index !== 0 && (
                    <button
                      onClick={() => onRestore(snapshot.id)}
                      className="p-2 hover:bg-green-50 rounded transition-colors"
                      title="恢复到此版本"
                    >
                      <RotateCcw size={18} className="text-green-600" />
                    </button>
                  )}

                  {/* 删除 */}
                  <button
                    onClick={() => handleDelete(snapshot.id)}
                    className="p-2 hover:bg-red-50 rounded transition-colors"
                    title="删除"
                  >
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 统计 */}
      <div className="text-center text-sm text-gray-500 pt-4 border-t">
        共 {snapshots.length} 个版本
      </div>
    </div>
  );
};
