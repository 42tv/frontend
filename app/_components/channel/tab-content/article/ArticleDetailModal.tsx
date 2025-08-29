'use client'
import { Article } from '../../../../_types/article';
import ImageGallery from './ImageGallery';

interface ArticleDetailModalProps {
  article: Article;
  onClose: () => void;
}

export default function ArticleDetailModal({ article, onClose }: ArticleDetailModalProps) {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-background dark:bg-background-dark rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start p-6 pb-4 border-b border-border-primary dark:border-border-primary-dark">
          <div className="flex-1 pr-4">
            <h1 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark mb-3 line-clamp-2">
              {article.title}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-text-secondary dark:text-text-secondary-dark">
              <span>{formatDate(article.createdAt)}</span>
              <span>조회수 {article.viewCount}</span>
              {article.updatedAt !== article.createdAt && (
                <span>수정됨</span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark hover:bg-background-secondary dark:hover:bg-background-secondary-dark rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {article.images && article.images.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 p-6">
              {/* Text Content Section - 70% */}
              <div className="lg:col-span-7">
                <div className="bg-background-secondary dark:bg-background-secondary-dark rounded-lg p-6 h-full">
                  <h3 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark mb-4">
                    게시글 내용
                  </h3>
                  <div className="text-text-primary dark:text-text-primary-dark leading-relaxed text-base">
                    <div className="whitespace-pre-wrap break-words">
                      {article.content}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Images Section - 30% */}
              <div className="lg:col-span-3">
                <div className="space-y-4">
                  <ImageGallery images={article.images} />
                </div>
              </div>
            </div>
          ) : (
            /* No Images - Full Width Content */
            <div className="p-6">
              <div className="max-w-4xl mx-auto">
                <div className="bg-background-secondary dark:bg-background-secondary-dark rounded-lg p-6">
                  <div className="text-text-primary dark:text-text-primary-dark text-lg leading-relaxed">
                    <div className="whitespace-pre-wrap break-words">
                      {article.content}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border-primary dark:border-border-primary-dark p-4 bg-background-secondary dark:bg-background-secondary-dark">
          <div className="flex items-center justify-between text-sm text-text-secondary dark:text-text-secondary-dark">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {article.viewCount} 조회
              </span>
              {article.images && article.images.length > 0 && (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {article.images.length}개 이미지
                </span>
              )}
            </div>
            <div className="text-xs">
              작성일: {formatDate(article.createdAt)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}