#!/bin/bash

# WSL 中打开 Windows 资源管理器的脚本
cd /home/hezihua/workspace/prompt_manager

echo "=================================================="
echo "  AI Prompt 管理器 - 在 Chrome 中加载扩展"
echo "=================================================="
echo ""
echo "📂 项目路径 (WSL):"
echo "   $(pwd)/dist"
echo ""
echo "📂 Windows 路径:"
echo "   \\\\wsl.localhost\\Ubuntu\\home\\hezihua\\workspace\\prompt_manager\\dist"
echo ""
echo "=================================================="
echo ""
echo "✅ 加载步骤："
echo ""
echo "1. 在 Windows 的 Chrome 浏览器打开："
echo "   chrome://extensions/"
echo ""
echo "2. 开启右上角的「开发者模式」"
echo ""
echo "3. 点击「加载已解压的扩展程序」"
echo ""
echo "4. 在文件选择器的地址栏粘贴："
echo "   \\\\wsl.localhost\\Ubuntu\\home\\hezihua\\workspace\\prompt_manager\\dist"
echo ""
echo "5. 按回车，然后点击「选择文件夹」"
echo ""
echo "=================================================="
echo ""
echo "🚀 正在尝试打开 Windows 资源管理器..."
echo ""

# 尝试打开 Windows 资源管理器
cmd.exe /c start "" "\\\\wsl.localhost\\Ubuntu\\home\\hezihua\\workspace\\prompt_manager\\dist" 2>/dev/null || {
    echo "⚠️  无法自动打开，请手动操作："
    echo ""
    echo "   1. 按 Win+E 打开文件资源管理器"
    echo "   2. 在地址栏粘贴上面的 Windows 路径"
    echo "   3. 按回车"
    echo ""
}

echo "=================================================="
