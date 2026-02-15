import React, { useEffect, useState } from 'react';
import { Sparkles, BookOpen, Settings, ExternalLink } from 'lucide-react';
import { storage } from '@/utils/storage';

export const Popup: React.FC = () => {
  const [projectCount, setProjectCount] = useState(0);
  const [starredCount, setStarredCount] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const projects = await storage.getProjects();
    setProjectCount(projects.length);
    setStarredCount(projects.filter((p) => p.starred).length);
  };

  const openSidePanel = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.sidePanel.open({ tabId: tabs[0].id });
        window.close();
      }
    });
  };

  return (
    <div className="w-80 bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      {/* 头部 */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <Sparkles className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Prompt 管理器</h1>
          <p className="text-sm text-gray-600">你的 AI 创作助手</p>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {projectCount}
          </div>
          <div className="text-xs text-gray-600">总 Prompt 数</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {starredCount}
          </div>
          <div className="text-xs text-gray-600">收藏数</div>
        </div>
      </div>

      {/* 快速操作 */}
      <div className="space-y-2 mb-6">
        <button
          onClick={openSidePanel}
          className="w-full flex items-center gap-3 p-3 bg-white hover:bg-gray-50 
                     rounded-lg transition-colors text-left shadow-sm"
        >
          <BookOpen size={20} className="text-blue-600" />
          <div className="flex-1">
            <div className="font-medium text-gray-800">打开管理器</div>
            <div className="text-xs text-gray-500">查看和管理所有 Prompt</div>
          </div>
          <ExternalLink size={16} className="text-gray-400" />
        </button>

        <button
          onClick={() => alert('设置功能将在下一版本中实现')}
          className="w-full flex items-center gap-3 p-3 bg-white hover:bg-gray-50 
                     rounded-lg transition-colors text-left shadow-sm"
        >
          <Settings size={20} className="text-gray-600" />
          <div className="flex-1">
            <div className="font-medium text-gray-800">设置</div>
            <div className="text-xs text-gray-500">自定义你的偏好</div>
          </div>
        </button>
      </div>

      {/* 提示 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800 leading-relaxed">
          💡 <strong>快捷键：</strong> Ctrl+Shift+P (Mac: Cmd+Shift+P) 快速打开
        </p>
        <p className="text-xs text-blue-800 mt-2 leading-relaxed">
          📝 选中文本后右键点击「保存为 Prompt」即可保存
        </p>
      </div>

      {/* 底部版本 */}
      <div className="mt-4 text-center text-xs text-gray-500">
        v0.1.0 Beta
      </div>
    </div>
  );
};
