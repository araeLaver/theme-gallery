import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Grid3X3, Download } from 'lucide-react';
import { themes, themeImages } from '../data/themes';
import { ImageGrid } from '../components/ImageGrid';
import { ImageItem } from '../types/theme';
import { downloadImage, downloadImagesAsZip } from '../utils/imageDownloader';
import { ToastContainer, useToast } from '../components/Toast';

const ThemeDetail: React.FC = () => {
  const { themeId } = useParams<{ themeId: string }>();
  const theme = themes.find(t => t.id === themeId);
  const images = themeId ? themeImages[themeId] || [] : [];
  const [isDownloading, setIsDownloading] = useState(false);
  const { toasts, showSuccess, showError, removeToast } = useToast();

  const handleImageDownload = async (image: ImageItem) => {
    setIsDownloading(true);
    try {
      const success = await downloadImage(image);
      if (success) {
        showSuccess('다운로드 완료', `"${image.alt}" 이미지가 다운로드되었습니다.`);
      } else {
        showError('다운로드 실패', '이미지 다운로드에 실패했습니다.');
      }
    } catch (error) {
      console.error('다운로드 에러:', error);
      showError('다운로드 오류', '이미지 다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleBulkDownload = async () => {
    if (images.length === 0) return;
    
    const confirmed = window.confirm(`${images.length}개의 이미지를 모두 다운로드하시겠습니까?`);
    if (!confirmed) return;

    setIsDownloading(true);
    try {
      await downloadImagesAsZip(images);
      showSuccess('일괄 다운로드 완료', `${images.length}개 이미지 다운로드가 시작되었습니다.`);
    } catch (error) {
      console.error('일괄 다운로드 에러:', error);
      showError('일괄 다운로드 오류', '일괄 다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!theme) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Theme not found</h2>
          <Link to="/" className="text-purple-600 hover:text-purple-700">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-96 overflow-hidden">
        <img
          src={theme.coverImage}
          alt={theme.name}
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-60`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Themes</span>
            </Link>
            
            <h1 className="text-5xl font-bold mb-3">{theme.name}</h1>
            <p className="text-xl opacity-90 mb-4">{theme.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Grid3X3 size={20} />
                <span className="font-medium">{images.length} Images</span>
              </div>
              
              {images.length > 0 && (
                <button
                  onClick={handleBulkDownload}
                  disabled={isDownloading}
                  className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={18} />
                  <span>{isDownloading ? '다운로드 중...' : '모두 다운로드'}</span>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ImageGrid 
            images={images} 
            onDownload={handleImageDownload}
            showActions={true}
          />
        </motion.div>
      </div>
      
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default ThemeDetail;