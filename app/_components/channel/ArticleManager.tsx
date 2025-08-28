'use client';

import { useState, useRef } from 'react';
import { Article } from '../../_types/article';

interface ArticleManagerProps {
  articles?: Article[];
}

export default function ArticleManager({ articles = [] }: ArticleManagerProps) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [zoomedImageIndex, setZoomedImageIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateNew = () => {
    setFormData({ title: '', content: '' });
    setSelectedImages([]);
    setPreviewImages([]);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const handleEdit = (article: Article) => {
    setFormData({
      title: article.title,
      content: article.content,
    });
    setSelectedImages([]);
    setPreviewImages(article.images?.map(img => img.imageUrl) || []);
    setSelectedArticle(article);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedImages.length > 5) {
      alert('최대 5개의 이미지만 업로드할 수 있습니다.');
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

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      if (isEditing && selectedArticle) {
        // Update article logic here
        console.log('Updating article:', selectedArticle.id, formData);
      } else {
        // Create new article logic here
        console.log('Creating new article:', formData, selectedImages);
      }
      
      setIsFormOpen(false);
      setFormData({ title: '', content: '' });
      setSelectedImages([]);
      setPreviewImages([]);
      setSelectedArticle(null);
      
      alert(isEditing ? '게시글이 수정되었습니다.' : '게시글이 작성되었습니다.');
    } catch (error) {
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleDelete = async (article: Article) => {
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      // Delete article logic here
      console.log('Deleting article:', article.id);
      alert('게시글이 삭제되었습니다.');
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">
            게시글 관리
          </h2>
          <p className="text-text-secondary dark:text-text-secondary-dark mt-1">
            총 {articles.length}개의 게시글
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="bg-primary dark:bg-primary-dark text-white px-4 py-2 rounded-lg hover:bg-primary-hover dark:hover:bg-primary-hover-dark transition-colors"
        >
          새 게시글 작성
        </button>
      </div>

      {/* Article List */}
      {articles.length === 0 ? (
        <div className="text-center py-12 bg-background-secondary dark:bg-background-secondary-dark rounded-lg">
          <div className="text-text-secondary dark:text-text-secondary-dark">
            작성된 게시글이 없습니다.
          </div>
          <button
            onClick={handleCreateNew}
            className="mt-4 text-primary dark:text-primary-dark hover:underline"
          >
            첫 번째 게시글을 작성해보세요
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <div
              key={article.id}
              className="border border-border-primary dark:border-border-primary-dark rounded-lg p-4 hover:bg-background-secondary dark:hover:bg-background-secondary-dark transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-2">
                    {article.title}
                  </h3>
                  <p className="text-text-secondary dark:text-text-secondary-dark line-clamp-2 mb-3">
                    {article.content}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-text-secondary dark:text-text-secondary-dark">
                    <span>{formatDate(article.createdAt)}</span>
                    <span>조회수 {article.viewCount}</span>
                    {article.images && article.images.length > 0 && (
                      <span>이미지 {article.images.length}개</span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(article)}
                    className="text-text-secondary dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-dark transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(article)}
                    className="text-text-secondary dark:text-text-secondary-dark hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Article Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-background dark:bg-background-dark rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-border-primary dark:border-border-primary-dark flex justify-between items-center">
              <h3 className="text-xl font-bold text-text-primary dark:text-text-primary-dark">
                {isEditing ? '게시글 수정' : '새 게시글 작성'}
              </h3>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1 text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark hover:bg-background-secondary dark:hover:bg-background-secondary-dark rounded-full transition-colors"
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
                      required
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2">
                      이미지 ({previewImages.length}/5)
                    </label>
                    <div className="border-2 border-dashed border-border-primary dark:border-border-primary-dark rounded-lg p-4">
                      <div className="flex gap-2">
                        {/* Add Image Button - Left Side */}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={previewImages.length >= 5}
                          className="flex-shrink-0 w-20 h-20 flex flex-col items-center justify-center bg-background-secondary dark:bg-background-secondary-dark rounded-lg hover:bg-background-tertiary dark:hover:bg-background-tertiary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-border-secondary dark:border-border-secondary-dark"
                        >
                          <svg className="w-6 h-6 text-text-secondary dark:text-text-secondary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span className="text-xs text-text-secondary dark:text-text-secondary-dark mt-1 text-center">
                            추가
                          </span>
                        </button>
                        
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                        
                        {/* Image Slots - Right Side */}
                        <div className="flex gap-2 flex-1">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="relative group w-20 h-20">
                              {index < previewImages.length ? (
                                /* Filled Slot with Image */
                                <>
                                  <img
                                    src={previewImages[index]}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover rounded-lg border border-border-secondary dark:border-border-secondary-dark cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => setZoomedImageIndex(index)}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-md"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </>
                              ) : (
                                /* Empty Slot */
                                <div className="w-full h-full border border-dashed border-border-secondary dark:border-border-secondary-dark rounded-lg flex items-center justify-center opacity-30">
                                  <svg className="w-6 h-6 text-text-secondary dark:text-text-secondary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="p-6 border-t border-border-primary dark:border-border-primary-dark flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="bg-primary dark:bg-primary-dark text-white px-6 py-2 rounded-lg hover:bg-primary-hover dark:hover:bg-primary-hover-dark transition-colors"
                >
                  {isEditing ? '수정하기' : '작성하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {zoomedImageIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-[60]">
          <div className="relative">
            <img
              src={previewImages[zoomedImageIndex]}
              alt={`확대된 이미지 ${zoomedImageIndex + 1}`}
              className="max-w-[70vw] max-h-[70vh] object-contain rounded-lg"
            />
            
            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-60 text-white px-3 py-1 rounded text-sm">
              {zoomedImageIndex + 1} / {previewImages.length}
            </div>
          </div>

          {/* Fixed Navigation Buttons */}
          {previewImages.length > 1 && (
            <>
              <button
                onClick={() => setZoomedImageIndex(
                  zoomedImageIndex === 0 ? previewImages.length - 1 : zoomedImageIndex - 1
                )}
                className="fixed left-8 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setZoomedImageIndex(
                  zoomedImageIndex === previewImages.length - 1 ? 0 : zoomedImageIndex + 1
                )}
                className="fixed right-8 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Click outside to close */}
          <div 
            className="absolute inset-0 -z-10" 
            onClick={() => setZoomedImageIndex(null)}
          />
        </div>
      )}
    </div>
  );
}