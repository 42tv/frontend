import { useState } from 'react';
import { Article } from '../../_types/article';

interface ArticleListProps {
  articles: Article[];
}

export default function ArticleList({ articles }: ArticleListProps) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    return content.length > maxLength 
      ? content.substring(0, maxLength) + '...' 
      : content;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark">
          게시글 ({articles.length})
        </h2>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-12 bg-background-secondary dark:bg-background-secondary-dark rounded-lg">
          <div className="text-text-secondary dark:text-text-secondary-dark">
            작성된 게시글이 없습니다.
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {articles.map((article) => (
              <article
                key={article.id}
                className="border border-border-primary dark:border-border-primary-dark rounded-lg p-4 hover:bg-background-secondary dark:hover:bg-background-secondary-dark transition-colors cursor-pointer"
                onClick={() => setSelectedArticle(article)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark line-clamp-1">
                    {article.title}
                  </h3>
                  <span className="text-sm text-text-secondary dark:text-text-secondary-dark whitespace-nowrap ml-4">
                    {formatDate(article.createdAt)}
                  </span>
                </div>
                
                <p className="text-text-secondary dark:text-text-secondary-dark mb-3 line-clamp-2">
                  {truncateContent(article.content)}
                </p>
                
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-4 text-text-secondary dark:text-text-secondary-dark">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {article.viewCount}
                    </span>
                    
                    {article.images && article.images.length > 0 && (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {article.images.length}
                      </span>
                    )}
                  </div>
                  
                  {article.updatedAt !== article.createdAt && (
                    <span className="text-text-secondary dark:text-text-secondary-dark">
                      수정됨
                    </span>
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
              </article>
            ))}
          </div>

        </>
      )}

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-background dark:bg-background-dark rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">
                  {selectedArticle.title}
                </h1>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex items-center space-x-4 mb-6 text-sm text-text-secondary dark:text-text-secondary-dark">
                <span>{formatDate(selectedArticle.createdAt)}</span>
                <span>조회수 {selectedArticle.viewCount}</span>
                {selectedArticle.updatedAt !== selectedArticle.createdAt && (
                  <span>수정됨</span>
                )}
              </div>
              
              {selectedArticle.images && selectedArticle.images.length > 0 && (
                <div className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedArticle.images.map((image) => (
                      <img
                        key={image.id}
                        src={image.imageUrl}
                        alt="게시글 이미지"
                        className="w-full h-auto rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}
              
              <div className="prose prose-sm max-w-none text-text-primary dark:text-text-primary-dark">
                <div className="whitespace-pre-wrap">
                  {selectedArticle.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}