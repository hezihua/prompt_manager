import React, { useRef, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (imageData: string) => void;
  onRemove: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onRemove,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(value);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    // 验证文件大小（最大 5MB）
    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过 5MB');
      return;
    }

    setUploading(true);

    try {
      // 读取文件为 Base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setPreview(base64);
        onChange(base64);
        setUploading(false);
      };
      reader.onerror = () => {
        alert('读取文件失败');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('上传失败，请重试');
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(undefined);
    onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="预览"
            className="w-full h-48 object-cover rounded-lg"
          />
          {/* 悬停遮罩 */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-4">
            <button
              onClick={handleClick}
              className="px-4 py-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
            >
              更换图片
            </button>
            <button
              onClick={handleRemove}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              移除图片
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleClick}
          disabled={uploading}
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
              <p className="text-sm text-gray-600">上传中...</p>
            </>
          ) : (
            <>
              <ImageIcon size={48} className="text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  点击上传图片
                </p>
                <p className="text-xs text-gray-500">
                  支持 JPG, PNG, GIF（最大 5MB）
                </p>
              </div>
            </>
          )}
        </button>
      )}
    </div>
  );
};
