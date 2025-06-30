import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { blobStorage } from '../lib/blob';

interface UseFileUploadOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  folder?: string;
  onSuccess?: (result: { url: string; pathname: string }) => void;
  onError?: (error: Error) => void;
}

export const useFileUpload = (options: UseFileUploadOptions = {}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['image/*'],
    folder,
    onSuccess,
    onError
  } = options;

  const validateFile = (file: File): boolean => {
    // Size validation
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      toast.error(`Dosya boyutu ${maxSizeMB}MB'dan küçük olmalıdır`);
      return false;
    }

    // Type validation
    const isValidType = allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.replace('/*', '/'));
      }
      return file.type === type;
    });

    if (!isValidType) {
      toast.error('Desteklenmeyen dosya türü');
      return false;
    }

    return true;
  };

  const uploadFile = async (file: File) => {
    if (!validateFile(file)) {
      return null;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      let result;
      if (file.type.startsWith('image/')) {
        result = await blobStorage.uploadImage(file, { folder });
      } else {
        result = await blobStorage.uploadDocument(file, folder);
      }

      clearInterval(progressInterval);
      setProgress(100);

      toast.success('Dosya başarıyla yüklendi!');
      onSuccess?.(result);
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Dosya yüklenirken bir hata oluştu';
      toast.error(errorMessage);
      onError?.(error instanceof Error ? error : new Error(errorMessage));
      return null;
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const uploadFiles = async (files: File[]) => {
    const validFiles = files.filter(validateFile);
    
    if (validFiles.length === 0) {
      return [];
    }

    setUploading(true);
    setProgress(0);

    try {
      const results = await blobStorage.uploadFiles(validFiles, folder);
      setProgress(100);
      
      toast.success(`${results.length} dosya başarıyla yüklendi!`);
      
      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Dosyalar yüklenirken bir hata oluştu';
      toast.error(errorMessage);
      onError?.(error instanceof Error ? error : new Error(errorMessage));
      return [];
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return {
    uploadFile,
    uploadFiles,
    uploading,
    progress
  };
};