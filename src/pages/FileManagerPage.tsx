import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Download, 
  Trash2, 
  Eye, 
  Copy,
  Folder,
  File,
  Image as ImageIcon,
  Video,
  FileText,
  Archive
} from 'lucide-react';
import { useBlob } from '../contexts/BlobContext';
import { toast } from 'react-hot-toast';
import Button from '../components/UI/Button';
import FileUpload from '../components/UI/FileUpload';

const FileManagerPage: React.FC = () => {
  const { files, loading, deleteFile, refreshFiles } = useBlob();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'images' | 'documents' | 'videos'>('all');

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.pathname.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filterType !== 'all') {
      switch (filterType) {
        case 'images':
          matchesFilter = file.contentType?.startsWith('image/') || false;
          break;
        case 'documents':
          matchesFilter = file.contentType?.includes('pdf') || 
                         file.contentType?.includes('document') || 
                         file.contentType?.includes('text') || false;
          break;
        case 'videos':
          matchesFilter = file.contentType?.startsWith('video/') || false;
          break;
      }
    }
    
    return matchesSearch && matchesFilter;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (contentType?: string) => {
    if (!contentType) return <File className="w-8 h-8 text-gray-500" />;
    
    if (contentType.startsWith('image/')) {
      return <ImageIcon className="w-8 h-8 text-blue-500" />;
    }
    if (contentType.startsWith('video/')) {
      return <Video className="w-8 h-8 text-purple-500" />;
    }
    if (contentType.includes('pdf') || contentType.includes('document') || contentType.includes('text')) {
      return <FileText className="w-8 h-8 text-red-500" />;
    }
    if (contentType.includes('zip') || contentType.includes('rar')) {
      return <Archive className="w-8 h-8 text-yellow-500" />;
    }
    
    return <File className="w-8 h-8 text-gray-500" />;
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL kopyalandı!');
  };

  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileSelect = (url: string) => {
    setSelectedFiles(prev => 
      prev.includes(url) 
        ? prev.filter(f => f !== url)
        : [...prev, url]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedFiles.length === 0) return;
    
    const confirmed = window.confirm(`${selectedFiles.length} dosyayı silmek istediğinizden emin misiniz?`);
    if (!confirmed) return;

    try {
      await Promise.all(selectedFiles.map(url => deleteFile(url)));
      setSelectedFiles([]);
      toast.success('Seçili dosyalar silindi!');
    } catch (error) {
      toast.error('Dosyalar silinirken bir hata oluştu');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Dosya Yöneticisi
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Vercel Blob ile dosyalarınızı yönetin
            </p>
          </div>
          <Button onClick={refreshFiles} loading={loading}>
            Yenile
          </Button>
        </div>

        {/* Upload Area */}
        <div className="mb-8">
          <FileUpload
            onUpload={() => refreshFiles()}
            multiple
            className="max-w-2xl"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Dosya ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
            >
              <option value="all">Tüm Dosyalar</option>
              <option value="images">Resimler</option>
              <option value="documents">Belgeler</option>
              <option value="videos">Videolar</option>
            </select>
            
            <div className="flex border border-gray-300 dark:border-dark-600 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-dark-800 text-gray-600 dark:text-gray-300'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-dark-800 text-gray-600 dark:text-gray-300'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Selected Files Actions */}
        {selectedFiles.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-blue-800 dark:text-blue-200">
                {selectedFiles.length} dosya seçildi
              </span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedFiles([])}
                >
                  Seçimi Temizle
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteSelected}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Sil
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Files Grid/List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Dosyalar yükleniyor...</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-12">
            <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Dosya bulunamadı
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {searchTerm ? 'Arama kriterlerinize uygun dosya bulunamadı.' : 'Henüz dosya yüklenmemiş.'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredFiles.map((file, index) => (
              <motion.div
                key={file.url}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white dark:bg-dark-800 rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-xl ${
                  selectedFiles.includes(file.url) ? 'ring-2 ring-emerald-500' : ''
                }`}
                onClick={() => handleFileSelect(file.url)}
              >
                <div className="aspect-square bg-gray-100 dark:bg-dark-700 flex items-center justify-center">
                  {file.contentType?.startsWith('image/') ? (
                    <img
                      src={file.url}
                      alt={file.pathname}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getFileIcon(file.contentType)
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate mb-1">
                    {file.pathname.split('/').pop()}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {formatFileSize(file.size)}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(file.uploadedAt).toLocaleDateString('tr-TR')}
                  </p>
                  
                  <div className="flex space-x-1 mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyUrl(file.url);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="URL'yi kopyala"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(file.url, '_blank');
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="Görüntüle"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadFile(file.url, file.pathname.split('/').pop() || 'file');
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="İndir"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Bu dosyayı silmek istediğinizden emin misiniz?')) {
                          deleteFile(file.url);
                        }
                      }}
                      className="p-1 text-red-400 hover:text-red-600"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-dark-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFiles(filteredFiles.map(f => f.url));
                          } else {
                            setSelectedFiles([]);
                          }
                        }}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Dosya
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Boyut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
                  {filteredFiles.map((file) => (
                    <tr key={file.url} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedFiles.includes(file.url)}
                          onChange={() => handleFileSelect(file.url)}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 mr-3">
                            {getFileIcon(file.contentType)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {file.pathname.split('/').pop()}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {file.contentType}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(file.uploadedAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => copyUrl(file.url)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            title="URL'yi kopyala"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => window.open(file.url, '_blank')}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            title="Görüntüle"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => downloadFile(file.url, file.pathname.split('/').pop() || 'file')}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            title="İndir"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Bu dosyayı silmek istediğinizden emin misiniz?')) {
                                deleteFile(file.url);
                              }
                            }}
                            className="text-red-400 hover:text-red-600"
                            title="Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileManagerPage;