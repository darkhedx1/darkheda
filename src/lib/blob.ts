import { put, del, list, head } from '@vercel/blob';

// Blob storage utilities for file management
export class BlobStorage {
  private static instance: BlobStorage;
  
  static getInstance(): BlobStorage {
    if (!BlobStorage.instance) {
      BlobStorage.instance = new BlobStorage();
    }
    return BlobStorage.instance;
  }

  // Upload file to Vercel Blob
  async uploadFile(file: File, pathname?: string): Promise<{ url: string; pathname: string }> {
    try {
      const filename = pathname || `${Date.now()}-${file.name}`;
      
      const blob = await put(filename, file, {
        access: 'public',
        addRandomSuffix: !pathname, // Add random suffix if no specific pathname provided
      });

      return {
        url: blob.url,
        pathname: blob.pathname
      };
    } catch (error) {
      console.error('Error uploading file to blob:', error);
      throw new Error('Dosya yüklenirken bir hata oluştu');
    }
  }

  // Upload multiple files
  async uploadFiles(files: File[], folder?: string): Promise<Array<{ url: string; pathname: string; originalName: string }>> {
    try {
      const uploadPromises = files.map(async (file) => {
        const pathname = folder ? `${folder}/${Date.now()}-${file.name}` : undefined;
        const result = await this.uploadFile(file, pathname);
        return {
          ...result,
          originalName: file.name
        };
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading multiple files:', error);
      throw new Error('Dosyalar yüklenirken bir hata oluştu');
    }
  }

  // Delete file from Vercel Blob
  async deleteFile(url: string): Promise<void> {
    try {
      await del(url);
    } catch (error) {
      console.error('Error deleting file from blob:', error);
      throw new Error('Dosya silinirken bir hata oluştu');
    }
  }

  // Delete multiple files
  async deleteFiles(urls: string[]): Promise<void> {
    try {
      await Promise.all(urls.map(url => del(url)));
    } catch (error) {
      console.error('Error deleting multiple files:', error);
      throw new Error('Dosyalar silinirken bir hata oluştu');
    }
  }

  // List files in blob storage
  async listFiles(options?: { prefix?: string; limit?: number; cursor?: string }) {
    try {
      const result = await list(options);
      return result;
    } catch (error) {
      console.error('Error listing files:', error);
      throw new Error('Dosyalar listelenirken bir hata oluştu');
    }
  }

  // Get file metadata
  async getFileInfo(url: string) {
    try {
      const result = await head(url);
      return result;
    } catch (error) {
      console.error('Error getting file info:', error);
      throw new Error('Dosya bilgileri alınırken bir hata oluştu');
    }
  }

  // Upload image with optimization
  async uploadImage(file: File, options?: { 
    maxWidth?: number; 
    maxHeight?: number; 
    quality?: number;
    folder?: string;
  }): Promise<{ url: string; pathname: string }> {
    try {
      // Basic validation
      if (!file.type.startsWith('image/')) {
        throw new Error('Sadece resim dosyaları yüklenebilir');
      }

      // Size validation (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Dosya boyutu 10MB\'dan küçük olmalıdır');
      }

      const folder = options?.folder || 'images';
      const pathname = `${folder}/${Date.now()}-${file.name}`;
      
      return await this.uploadFile(file, pathname);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // Upload document
  async uploadDocument(file: File, folder = 'documents'): Promise<{ url: string; pathname: string }> {
    try {
      // Allowed document types
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error('Desteklenmeyen dosya türü');
      }

      // Size validation (max 50MB for documents)
      if (file.size > 50 * 1024 * 1024) {
        throw new Error('Dosya boyutu 50MB\'dan küçük olmalıdır');
      }

      const pathname = `${folder}/${Date.now()}-${file.name}`;
      return await this.uploadFile(file, pathname);
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  // Generate signed URL for private files
  async generateSignedUrl(pathname: string, expiresIn = 3600): Promise<string> {
    try {
      // Note: This is a placeholder for signed URL generation
      // Vercel Blob doesn't have built-in signed URLs, but you can implement
      // your own authentication layer
      return `${pathname}?expires=${Date.now() + expiresIn * 1000}`;
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw new Error('Güvenli URL oluşturulurken bir hata oluştu');
    }
  }
}

// Export singleton instance
export const blobStorage = BlobStorage.getInstance();

// Helper functions for common operations
export const uploadProfileImage = async (file: File) => {
  return blobStorage.uploadImage(file, { folder: 'profiles', maxWidth: 500, maxHeight: 500 });
};

export const uploadPlatformImage = async (file: File) => {
  return blobStorage.uploadImage(file, { folder: 'platforms', maxWidth: 200, maxHeight: 200 });
};

export const uploadReceiptImage = async (file: File) => {
  return blobStorage.uploadImage(file, { folder: 'receipts' });
};

export const uploadBlogImage = async (file: File) => {
  return blobStorage.uploadImage(file, { folder: 'blog' });
};