import React, { createContext, useContext, useState, useEffect } from 'react';
import { blobStorage } from '../lib/blob';
import { toast } from 'react-hot-toast';

interface BlobFile {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
  contentType?: string;
}

interface BlobContextType {
  files: BlobFile[];
  loading: boolean;
  uploadFile: (file: File, folder?: string) => Promise<{ url: string; pathname: string } | null>;
  deleteFile: (url: string) => Promise<void>;
  listFiles: (prefix?: string) => Promise<void>;
  refreshFiles: () => Promise<void>;
}

const BlobContext = createContext<BlobContextType | undefined>(undefined);

export const BlobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<BlobFile[]>([]);
  const [loading, setLoading] = useState(false);

  const uploadFile = async (file: File, folder?: string) => {
    setLoading(true);
    try {
      let result;
      if (file.type.startsWith('image/')) {
        result = await blobStorage.uploadImage(file, { folder });
      } else {
        result = await blobStorage.uploadDocument(file, folder);
      }
      
      // Add to local state
      const newFile: BlobFile = {
        url: result.url,
        pathname: result.pathname,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        contentType: file.type
      };
      
      setFiles(prev => [newFile, ...prev]);
      toast.success('Dosya başarıyla yüklendi!');
      
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Dosya yüklenirken bir hata oluştu';
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (url: string) => {
    try {
      await blobStorage.deleteFile(url);
      setFiles(prev => prev.filter(file => file.url !== url));
      toast.success('Dosya başarıyla silindi!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Dosya silinirken bir hata oluştu';
      toast.error(message);
    }
  };

  const listFiles = async (prefix?: string) => {
    setLoading(true);
    try {
      const result = await blobStorage.listFiles({ prefix, limit: 100 });
      const blobFiles: BlobFile[] = result.blobs.map(blob => ({
        url: blob.url,
        pathname: blob.pathname,
        size: blob.size,
        uploadedAt: blob.uploadedAt,
        contentType: blob.contentType
      }));
      
      setFiles(blobFiles);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Dosyalar listelenirken bir hata oluştu';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const refreshFiles = async () => {
    await listFiles();
  };

  // Load files on mount
  useEffect(() => {
    listFiles();
  }, []);

  return (
    <BlobContext.Provider value={{
      files,
      loading,
      uploadFile,
      deleteFile,
      listFiles,
      refreshFiles
    }}>
      {children}
    </BlobContext.Provider>
  );
};

export const useBlob = () => {
  const context = useContext(BlobContext);
  if (!context) {
    throw new Error('useBlob must be used within BlobProvider');
  }
  return context;
};