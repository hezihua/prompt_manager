import { storage } from '@/utils/storage';
import { generateId } from '@/utils/prompt-builder';
import type { PromptProject } from '@/types/prompt';

/**
 * 安装时初始化
 */
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('Extension installed:', details.reason);

  // 创建右键菜单
  chrome.contextMenus.create({
    id: 'save-prompt',
    title: '保存为 Prompt',
    contexts: ['selection'],
  });

  chrome.contextMenus.create({
    id: 'open-sidepanel',
    title: '打开 Prompt 管理器',
    contexts: ['all'],
  });

  // 首次安装时，添加示例数据
  if (details.reason === 'install') {
    await initializeWithExamples();
  }
});

/**
 * 右键菜单点击处理
 */
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'save-prompt') {
    const selectedText = info.selectionText?.trim();
    
    if (!selectedText) {
      console.warn('No text selected');
      return;
    }

    // 创建新项目
    const project: PromptProject = {
      id: generateId(),
      title: selectedText.length > 50 
        ? selectedText.substring(0, 50) + '...' 
        : selectedText,
      description: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      content: {
        positive: [
          {
            id: generateId(),
            text: selectedText,
            type: 'custom',
            weight: 1.0,
            isLocked: false,
          },
        ],
        negative: [],
        params: [],
      },
      tags: [],
      starred: false,
    };

    await storage.addProject(project);

    // 显示通知
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon-48.png',
      title: 'Prompt 已保存',
      message: `"${project.title}" 已添加到你的 Prompt 库`,
    });

    console.log('Prompt saved:', project);
  } else if (info.menuItemId === 'open-sidepanel') {
    if (tab?.id) {
      // 打开侧边栏
      chrome.sidePanel.open({ tabId: tab.id });
    }
  }
});

/**
 * 扩展图标点击处理
 */
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id });
  }
});

/**
 * 监听来自其他页面的消息
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message);

  switch (message.type) {
    case 'SAVE_PROMPT':
      handleSavePrompt(message.data)
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true; // 保持消息通道开放

    case 'GET_PROJECTS':
      storage.getProjects()
        .then(projects => sendResponse({ success: true, data: projects }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;

    case 'DELETE_PROJECT':
      storage.deleteProject(message.projectId)
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;

    default:
      console.warn('Unknown message type:', message.type);
  }
});

/**
 * 处理保存 Prompt
 */
async function handleSavePrompt(data: Partial<PromptProject>): Promise<void> {
  const project: PromptProject = {
    id: generateId(),
    title: data.title || '未命名 Prompt',
    description: data.description || '',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    content: data.content || {
      positive: [],
      negative: [],
      params: [],
    },
    tags: data.tags || [],
    starred: false,
  };

  await storage.addProject(project);
}

/**
 * 初始化示例数据
 */
async function initializeWithExamples(): Promise<void> {
  const examples: PromptProject[] = [
    {
      id: generateId(),
      title: '赛博朋克少女',
      description: '高质量赛博朋克风格的人物肖像',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      content: {
        positive: [
          {
            id: generateId(),
            text: 'masterpiece',
            translation: '杰作',
            type: 'technique',
            weight: 1.2,
            isLocked: true,
          },
          {
            id: generateId(),
            text: 'best quality',
            translation: '最佳质量',
            type: 'technique',
            weight: 1.2,
            isLocked: true,
          },
          {
            id: generateId(),
            text: '1girl',
            translation: '一个女孩',
            type: 'subject',
            weight: 1.0,
            isLocked: false,
          },
          {
            id: generateId(),
            text: 'cyberpunk',
            translation: '赛博朋克',
            type: 'style',
            weight: 1.5,
            isLocked: false,
          },
          {
            id: generateId(),
            text: 'neon lights',
            translation: '霓虹灯',
            type: 'lighting',
            weight: 1.3,
            isLocked: false,
          },
        ],
        negative: [
          {
            id: generateId(),
            text: 'lowres',
            translation: '低分辨率',
            type: 'custom',
            weight: 1.0,
            isLocked: false,
          },
          {
            id: generateId(),
            text: 'bad anatomy',
            translation: '解剖错误',
            type: 'custom',
            weight: 1.0,
            isLocked: false,
          },
        ],
        params: [
          {
            key: '--ar',
            value: '16:9',
            label: 'Aspect Ratio',
          },
          {
            key: '--v',
            value: '6',
            label: 'Version',
          },
        ],
      },
      tags: ['人物', '赛博朋克', '高质量'],
      starred: true,
    },
    {
      id: generateId(),
      title: '梦幻森林',
      description: '神秘的魔法森林场景',
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 86400000,
      content: {
        positive: [
          {
            id: generateId(),
            text: 'magical forest',
            translation: '魔法森林',
            type: 'subject',
            weight: 1.0,
            isLocked: false,
          },
          {
            id: generateId(),
            text: 'ethereal lighting',
            translation: '空灵光效',
            type: 'lighting',
            weight: 1.4,
            isLocked: false,
          },
          {
            id: generateId(),
            text: 'fantasy art',
            translation: '奇幻艺术',
            type: 'style',
            weight: 1.2,
            isLocked: false,
          },
        ],
        negative: [],
        params: [],
      },
      tags: ['风景', '奇幻'],
      starred: false,
    },
  ];

  for (const example of examples) {
    await storage.addProject(example);
  }

  console.log('Example prompts initialized');
}

// 添加 notifications 权限到 manifest
chrome.permissions.contains({ permissions: ['notifications'] }, (result) => {
  if (result) {
    console.log('Notifications permission granted');
  }
});
