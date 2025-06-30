import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, X, Upload } from 'lucide-react';
import { useFileUpload } from '../../hooks/useFileUpload';
import Button from './Button';

interface ImageUploadProps {
  onUpload?: (result: { url: string; pathname: string }) => void;
  onError?: (error: Error) => void;
  currentImage?: string;
  folder?: string;
  maxSize?: number;
  className?: string;
  aspectRatio?: 'square' | 'landscape' | 'portrait' | 'auto';
  placeholder?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  onError,
  currentImage,
  folder = 'images',
  maxSize = 5 * 1024 * 1024, // 5MB
  className = '',
  aspectRatio = 'auto',
  placeholder = 'Resim yükle'
}) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [dragActive, setDragActive] = useState(false);

  const { uploadFile, uploading, progress } = useFileUpload({
    maxSize,
    allowedTypes: ['image/*'],
    folder,
    onSuccess: (result) => {
      setPreview(result.url);
      onUpload?.(result);
    },
    onError
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    await uploadFile(file);
  };

  const removeImage = () => {
    setPreview(null);
    onUpload?.({ url: '', pathname: '' });
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square';
      case 'landscape':
        return 'aspect-video';
      case 'portrait':
        return 'aspect-[3/4]';
      default:
        return 'min-h-48';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="image-upload"
      />

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl overflow-hidden cursor-pointer transition-all duration-200
          ${getAspectRatioClass()}
          ${dragActive 
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
            : 'border-gray-300 dark:border-dark-600 hover:border-emerald-400'
          }
          ${uploading ? 'pointer-events-none' : ''}
        `}
        onClick={() => document.getElementById('image-upload')?.click()}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            
            {/* Remove Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Upload Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <div className="text-white text-center">
                <Camera className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Değiştir</p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">
                {placeholder}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Sürükleyin veya tıklayın
              </p>
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="absolute inset-0 bg-white/90 dark:bg-dark-900/90 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-900 dark:text-white font-medium">Yükleniyor...</p>
              <div className="w-32 bg-gray-200 dark:bg-dark-700 rounded-full h-2 mt-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;