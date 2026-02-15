import React, { useState } from 'react';
import { X, Download, Upload, Settings as SettingsIcon, Moon, Sun, Zap, Key } from 'lucide-react';
import type { AppSettings } from '@/types/prompt';
import { storage } from '@/utils/storage';
import { DataManager } from '@/utils/data-manager';
import { DEFAULT_SETTINGS } from '@/types/prompt';

interface SettingsPanelProps {
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'data' | 'advanced'>('general');
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('merge');

  // 加载设置
  React.useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await storage.getData();
      setSettings(data.settings);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const data = await storage.getData();
      data.settings = settings;
      await storage.setData(data);
      
      // 应用主题
      applyTheme(settings.theme);
      
      alert('设置已保存！');
      onClose();
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const applyTheme = (theme: AppSettings['theme']) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // auto: 跟随系统
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  // 导出数据
  const handleExportJSON = async () => {
    try {
      await DataManager.exportAll();
      alert('导出成功！');
    } catch (error) {
      console.error('Export error:', error);
      alert('导出失败，请重试');
    }
  };

  const handleExportProjectsCSV = async () => {
    try {
      await DataManager.exportProjectsCSV();
      alert('导出成功！');
    } catch (error) {
      console.error('Export error:', error);
      alert('导出失败，请重试');
    }
  };

  const handleExportSnapshotsCSV = async () => {
    try {
      await DataManager.exportSnapshotsCSV();
      alert('导出成功！');
    } catch (error) {
      console.error('Export error:', error);
      alert('导出失败，请重试');
    }
  };

  // 导入数据
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const content = await DataManager.readFile(file);
      
      let result;
      if (importMode === 'replace') {
        result = await DataManager.importFromJSON(content);
      } else {
        result = await DataManager.mergeImport(content);
      }

      if (result.success) {
        if (result.stats) {
          if (importMode === 'replace') {
            alert(`导入成功！\n项目: ${result.stats.projects}\n快照: ${result.stats.snapshots}`);
          } else {
            alert(
              `合并成功！\n新增项目: ${result.stats.projectsAdded}\n新增快照: ${result.stats.snapshotsAdded}\n跳过项目: ${result.stats.projectsSkipped}\n跳过快照: ${result.stats.snapshotsSkipped}`
            );
          }
        } else {
          alert(result.message);
        }
        
        // 刷新页面
        window.location.reload();
      } else {
        alert(`导入失败：${result.message}`);
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('导入失败，请检查文件格式');
    } finally {
      setLoading(false);
      event.target.value = ''; // 重置文件输入
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SettingsIcon size={24} className="text-gray-700 dark:text-gray-300" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">设置</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* 标签页 */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 px-6">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'general'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            常规设置
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'data'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            数据管理
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'advanced'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            高级
          </button>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* 常规设置 */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* 默认模型 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  默认 AI 模型
                </label>
                <select
                  value={settings.defaultModel}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      defaultModel: e.target.value as AppSettings['defaultModel'],
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="midjourney">Midjourney</option>
                  <option value="stable-diffusion">Stable Diffusion</option>
                  <option value="dalle">DALL-E</option>
                </select>
              </div>

              {/* 主题 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Moon size={16} />
                  主题模式
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['light', 'dark', 'auto'] as const).map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setSettings({ ...settings, theme })}
                      className={`p-3 border-2 rounded-lg transition-all ${
                        settings.theme === theme
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        {theme === 'light' && <Sun size={20} />}
                        {theme === 'dark' && <Moon size={20} />}
                        {theme === 'auto' && <Zap size={20} />}
                        <span className="text-sm font-medium dark:text-gray-200">
                          {theme === 'light' && '浅色'}
                          {theme === 'dark' && '深色'}
                          {theme === 'auto' && '自动'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 自动保存 */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    自动保存
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    编辑时自动保存更改
                  </p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, autoSave: !settings.autoSave })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.autoSave ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.autoSave ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* 显示教程 */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    显示新手教程
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    首次使用时显示引导
                  </p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, showTutorial: !settings.showTutorial })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.showTutorial ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.showTutorial ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* 数据管理 */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              {/* 导出数据 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <Download size={20} />
                  导出数据
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={handleExportJSON}
                    className="w-full px-4 py-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg transition-colors text-left"
                  >
                    <div className="font-medium text-gray-800 dark:text-gray-100">导出所有数据 (JSON)</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      包含所有项目、快照和设置，可完整恢复
                    </div>
                  </button>

                  <button
                    onClick={handleExportProjectsCSV}
                    className="w-full px-4 py-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg transition-colors text-left"
                  >
                    <div className="font-medium text-gray-800 dark:text-gray-100">导出项目列表 (CSV)</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      表格格式，可用 Excel 打开
                    </div>
                  </button>

                  <button
                    onClick={handleExportSnapshotsCSV}
                    className="w-full px-4 py-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 border border-purple-200 dark:border-purple-700 rounded-lg transition-colors text-left"
                  >
                    <div className="font-medium text-gray-800 dark:text-gray-100">导出版本快照 (CSV)</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      版本历史数据
                    </div>
                  </button>
                </div>
              </div>

              {/* 导入数据 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <Upload size={20} />
                  导入数据
                </h3>
                
                {/* 导入模式选择 */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    导入模式
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setImportMode('merge')}
                      className={`p-3 border-2 rounded-lg transition-all ${
                        importMode === 'merge'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-medium text-gray-800 dark:text-gray-100">合并</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        保留现有数据，仅添加新数据
                      </div>
                    </button>
                    <button
                      onClick={() => setImportMode('replace')}
                      className={`p-3 border-2 rounded-lg transition-all ${
                        importMode === 'replace'
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-medium text-gray-800 dark:text-gray-100">替换</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        清空现有数据，完全替换
                      </div>
                    </button>
                  </div>
                </div>

                <label className="block w-full px-4 py-3 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    disabled={loading}
                    className="hidden"
                  />
                  <div className="font-medium text-gray-800 dark:text-gray-100">
                    {loading ? '导入中...' : '选择 JSON 文件导入'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    仅支持通过"导出所有数据"生成的 JSON 文件
                  </div>
                </label>

                {importMode === 'replace' && (
                  <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                    <p className="text-sm text-red-800 dark:text-red-200">
                      ⚠️ 警告：替换模式会清空所有现有数据！建议先导出备份。
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 高级设置 */}
          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <Key size={20} />
                  快捷键
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-sm text-gray-700 dark:text-gray-300">打开/关闭侧边栏</span>
                    <kbd className="px-2 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-sm font-mono">
                      Ctrl+Shift+P
                    </kbd>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-sm text-gray-700 dark:text-gray-300">保存选中文本为 Prompt</span>
                    <kbd className="px-2 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-sm font-mono">
                      右键菜单
                    </kbd>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                  关于
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    <strong className="text-gray-800 dark:text-gray-200">版本:</strong> 0.4.0
                  </p>
                  <p>
                    <strong className="text-gray-800 dark:text-gray-200">作者:</strong> AI Prompt Manager Team
                  </p>
                  <p>
                    <strong className="text-gray-800 dark:text-gray-200">许可:</strong> MIT License
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 底部 */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '保存中...' : '保存设置'}
          </button>
        </div>
      </div>
    </div>
  );
};
