'use client'
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
  console.log('ArticleListItem rendering article:', article);
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

  return (
    <div className="border border-border-primary dark:border-border-primary-dark rounded-lg p-4 hover:bg-background-secondary dark:hover:bg-background-secondary-dark transition-colors">
      <div className="flex justify-between items-start">
        <div 
          className="flex-1 cursor-pointer"
          onClick={() => onSelect(article)}
        >
          <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-2">
            {article.title}
          </h3>
          <p className="text-text-secondary dark:text-text-secondary-dark line-clamp-2 mb-3">
            {truncateContent(article.content)}
          </p>
          <div className="flex items-center space-x-4 text-sm text-text-secondary dark:text-text-secondary-dark">
            <span>{formatDate(article.createdAt)}</span>
            <span>조회수 {article.viewCount}</span>
            {article.images && article.images.length > 0 && (
              <span>이미지 {article.images.length}개</span>
            )}
          </div>

          {/* Image Preview */}
          {article.images && article.images.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border-secondary dark:border-border-secondary-dark">
              <div className="flex gap-2 overflow-hidden">
                {article.images.slice(0, 3).map((image, index) => (
                  <div key={image.id} className="relative flex-shrink-0">
                    <img
                      src={image.imageUrl}
                      alt="게시글 이미지"
                      className="w-16 h-16 object-cover rounded-md border border-border-primary dark:border-border-primary-dark"
                    />
                    {/* Show "+N" overlay on the last image if there are more than 3 images */}
                    {index === 2 && article.images && article.images.length > 3 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                        <span className="text-white text-xs font-medium">
                          +{article.images.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
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