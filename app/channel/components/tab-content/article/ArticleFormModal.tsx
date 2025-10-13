'use client'
import { useState } from 'react';
import { Article } from '../../../../_types/article';
import { createArticle, editArticle } from '../../../../_apis/article';
import ImageUploader from './ImageUploader';

interface ArticleFormModalProps {
  mode: 'create' | 'edit';
  article?: Article;
  onClose: () => void;
  onSuccess?: (article: Article) => Promise<void>;
}

export default function ArticleFormModal({
  mode,
  article,
  onClose,
  onSuccess
}: ArticleFormModalProps) {
  const [formData, setFormData] = useState({
    title: article?.title || '',
    content: article?.content || ''
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>(
    article?.images?.map(img => img.imageUrl) || []
  );
  const [keepImageIds, setKeepImageIds] = useState<number[]>(
    article?.images?.map(img => img.id) || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedImages.length > 5) {
      return;
    }

    setSelectedImages(prev => [...prev, ...files]);
    
    // Preview images
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewImages(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number): void => {
    const originalImageCount = article?.images?.length || 0;
    
    if (index < originalImageCount) {
      // 기존 이미지 제거 - keepImageIds에서 해당 이미지 ID 제거
      const imageId = article?.images?.[index]?.id;
      if (imageId) {
        setKeepImageIds(prev => prev.filter(id => id !== imageId));
      }
    } else {
      // 새로운 이미지 제거 - selectedImages에서 제거
      const newImageIndex = index - originalImageCount;
      setSelectedImages(prev => prev.filter((_, i) => i !== newImageIndex));
    }
    
    // 프리뷰에서는 항상 해당 인덱스 제거
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'create') {
        const createArticleDto = {
          title: formData.title.trim(),
          content: formData.content.trim()
        };
        
        const response = await createArticle(createArticleDto, selectedImages);
        console.log('ArticleFormModal: Article created successfully:', response);
        
        if (onSuccess) {
          console.log('ArticleFormModal: onSuccess called');
          // 백엔드에서 생성된 게시글 정보를 반환하지 않으므로, 더미 데이터로 콜백 호출
          await onSuccess({ id: 0, title: formData.title, content: formData.content } as Article);
        }
      } else if (mode === 'edit' && article) {
        const articleId = article.id;
        
        if (!articleId) {
          return;
        }
        
        const editArticleDto = {
          title: formData.title.trim(),
          content: formData.content.trim(),
          keepImages: keepImageIds
        };
        
        const response = await editArticle(articleId, editArticleDto, selectedImages);
        console.log('ArticleFormModal: Article edited successfully:', response);
        
        if (onSuccess) {
          console.log('ArticleFormModal: onSuccess called');
          // 백엔드에서 수정된 게시글 정보를 반환하지 않으므로, 업데이트된 데이터로 콜백 호출
          await onSuccess({ ...article, title: formData.title, content: formData.content } as Article);
        }
      }
      
      onClose();
    } catch (error) {
      console.error('게시글 작성/수정 중 오류:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = (): void => {
    if (isSubmitting) return;
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-background dark:bg-background-dark rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-border-primary dark:border-border-primary-dark flex justify-between items-center">
          <h3 className="text-xl font-bold text-text-primary dark:text-text-primary-dark">
            {mode === 'create' ? '새 게시글 작성' : '게시글 수정'}
          </h3>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-1 text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark hover:bg-background-secondary dark:hover:bg-background-secondary-dark rounded-full transition-colors disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2">
                  제목
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-border-primary dark:border-border-primary-dark rounded-lg bg-background dark:bg-background-dark text-text-primary dark:text-text-primary-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent"
                  placeholder="게시글 제목을 입력하세요"
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2">
                  내용
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={8}
                  className="w-full px-3 py-2 border border-border-primary dark:border-border-primary-dark rounded-lg bg-background dark:bg-background-dark text-text-primary dark:text-text-primary-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent resize-y"
                  placeholder="게시글 내용을 입력하세요"
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* Image Upload */}
              <ImageUploader
                selectedImages={selectedImages}
                previewImages={previewImages}
                onImageSelect={handleImageSelect}
                onImageRemove={handleRemoveImage}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="p-6 border-t border-border-primary dark:border-border-primary-dark flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark transition-colors disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary dark:bg-primary-dark text-white px-6 py-2 rounded-lg hover:bg-primary-hover dark:hover:bg-primary-hover-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting 
                ? (mode === 'create' ? '작성 중...' : '수정 중...') 
                : (mode === 'create' ? '작성하기' : '수정하기')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}