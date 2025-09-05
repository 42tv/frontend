'use client'
import { useState } from 'react';
import { Article } from '../../../../_types/article';

interface ArticleListItemProps {
  article: Article;
  showActions?: boolean;
  onSelect: (article: Article) => void;
  onEdit?: (article: Article) => void;
  onDelete?: (article: Article) => void;
}

export default function ArticleListItem({ 
  article, 
  showActions = false, 
  onSelect, 
  onEdit, 
  onDelete 
}: ArticleListItemProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateContent = (content: string, maxLength: number = 100): string => {
    return content.length > maxLength 
      ? content.substring(0, maxLength) + '...' 
      : content;
  };

  const nextImage = (e: React.MouseEvent): void => {
    e.stopPropagation();
    if (article.images) {
      setCurrentImageIndex((currentImageIndex + 1) % article.images.length);
    }
  };

  const prevImage = (e: React.MouseEvent): void => {
    e.stopPropagation();
    if (article.images) {
      setCurrentImageIndex(currentImageIndex === 0 ? article.images.length - 1 : currentImageIndex - 1);
    }
  };

  return (
    <div className="border border-border-primary dark:border-border-primary-dark rounded-lg p-4 hover:bg-background-secondary dark:hover:bg-background-secondary-dark transition-colors min-h-[180px]">
      <div className="flex justify-between items-start gap-4 h-full">
        <div 
          className="flex-1 cursor-pointer flex flex-col h-full"
          onClick={() => onSelect(article)}
        >
          <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-2">
            {article.title}
          </h3>
          <p className="text-text-secondary dark:text-text-secondary-dark flex-1 mb-3 overflow-hidden">
            {truncateContent(article.content)}
          </p>
          <div className="flex items-center space-x-4 text-sm text-text-secondary dark:text-text-secondary-dark mt-auto">
            <span>{formatDate(article.createdAt)}</span>
            {article.images && article.images.length > 0 && (
              <span>이미지 {article.images.length}개</span>
            )}
          </div>
        </div>

        {/* Image Carousel - Right side */}
        {article.images && article.images.length > 0 && (
          <div className="flex-shrink-0 h-full aspect-[16/9] relative overflow-hidden rounded-md border border-border-primary dark:border-border-primary-dark">
            <img
              src={article.images[currentImageIndex].imageUrl}
              alt="게시글 이미지"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            
            {/* Image navigation arrows - only show if more than 1 image */}
            {article.images.length > 1 && (
              <>
                {/* Previous arrow */}
                <button
                  onClick={prevImage}
                  className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center text-white text-xs transition-opacity opacity-70 hover:opacity-100"
                >
                  ‹
                </button>
                
                {/* Next arrow */}
                <button
                  onClick={nextImage}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center text-white text-xs transition-opacity opacity-70 hover:opacity-100"
                >
                  ›
                </button>

                {/* Image counter and indicator dots */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                  {/* Image counter */}
                  <div className="bg-black bg-opacity-70 text-white text-xs px-2 py-0.5 rounded-full">
                    {currentImageIndex + 1}/{article.images.length}
                  </div>
                  
                  {/* Indicator dots - only show if 5 or fewer images */}
                  {article.images.length <= 5 && (
                    <div className="flex gap-1">
                      {article.images.map((_, index) => (
                        <div
                          key={index}
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            index === currentImageIndex 
                              ? 'bg-white' 
                              : 'bg-white bg-opacity-50'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
        {showActions && (
          <div className="flex space-x-2 ml-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(article);
              }}
              className="text-text-secondary dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-dark transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(article);
              }}
              className="text-text-secondary dark:text-text-secondary-dark hover:text-red-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}