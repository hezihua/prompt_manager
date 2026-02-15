#!/bin/bash

# Chrome Web Store 发布包创建脚本

echo "🚀 开始创建 Chrome Web Store 发布包..."
echo ""

# 1. 清理旧构建
echo "📦 步骤 1/4: 清理旧构建..."
rm -rf dist
rm -f prompt-manager-*.zip

# 2. 重新构建
echo "🔨 步骤 2/4: 构建项目..."
pnpm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败！请检查错误信息。"
    exit 1
fi

# 3. 获取版本号
VERSION=$(grep '"version"' public/manifest.json | cut -d'"' -f4)
echo "📌 当前版本: $VERSION"

# 4. 创建 ZIP 包
echo "📦 步骤 3/4: 创建 ZIP 包..."

# 检查是否安装了 zip
if ! command -v zip &> /dev/null; then
    echo "⚠️  zip 命令未安装"
    echo ""
    echo "请手动打包 dist 目录:"
    echo "  1. 打开文件管理器"
    echo "  2. 右键点击 'dist' 文件夹"
    echo "  3. 选择 '压缩' 或 '创建压缩文件'"
    echo "  4. 命名为: prompt-manager-v${VERSION}.zip"
    echo ""
    echo "或者安装 zip 命令:"
    echo "  sudo apt install zip"
    echo ""
    exit 1
fi

cd dist
zip -r "../prompt-manager-v${VERSION}.zip" .
cd ..

# 5. 验证
echo "✅ 步骤 4/4: 验证打包结果..."
echo ""

if [ -f "prompt-manager-v${VERSION}.zip" ]; then
    FILE_SIZE=$(ls -lh "prompt-manager-v${VERSION}.zip" | awk '{print $5}')
    echo "✅ 发布包创建成功！"
    echo ""
    echo "📦 文件名: prompt-manager-v${VERSION}.zip"
    echo "📊 文件大小: $FILE_SIZE"
    echo "📍 位置: $(pwd)/prompt-manager-v${VERSION}.zip"
    echo ""
    echo "🎯 下一步:"
    echo "  1. 访问 https://chrome.google.com/webstore/devconsole"
    echo "  2. 上传 prompt-manager-v${VERSION}.zip"
    echo "  3. 填写商店信息"
    echo "  4. 提交审核"
    echo ""
    echo "📚 查看详细发布指南: docs/CHROME_STORE_PUBLISH.md"
else
    echo "❌ 打包失败！"
    exit 1
fi
