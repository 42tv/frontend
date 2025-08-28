import { useState } from 'react';
import { Article } from '../../_types/article';

interface ArticleListProps {
  articles: Article[];
}

export default function ArticleList({ articles }: ArticleListProps) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

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
                onClick={() => {
                  setSelectedArticle(article);
                  setCurrentImageIndex(0);
                }}
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
          <div className="bg-background dark:bg-background-dark rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start p-6 pb-4 border-b border-border-primary dark:border-border-primary-dark">
              <div className="flex-1 pr-4">
                <h1 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark mb-3 line-clamp-2">
                  {selectedArticle.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-text-secondary dark:text-text-secondary-dark">
                  <span>{formatDate(selectedArticle.createdAt)}</span>
                  <span>조회수 {selectedArticle.viewCount}</span>
                  {selectedArticle.updatedAt !== selectedArticle.createdAt && (
                    <span>수정됨</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="flex-shrink-0 p-1 text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark hover:bg-background-secondary dark:hover:bg-background-secondary-dark rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {selectedArticle.images && selectedArticle.images.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 p-6">
                  {/* Text Content Section - 70% */}
                  <div className="lg:col-span-7">
                    <div className="bg-background-secondary dark:bg-background-secondary-dark rounded-lg p-6 h-full">
                      <h3 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark mb-4">
                        게시글 내용
                      </h3>
                      <div className="text-text-primary dark:text-text-primary-dark leading-relaxed text-base">
                        <div className="whitespace-pre-wrap break-words">
                          {selectedArticle.content}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Images Section - 30% */}
                  <div className="lg:col-span-3">
                    <div className="space-y-4">
                      {selectedArticle.images.length === 1 ? (
                        <div className="relative">
                          <img
                            src={selectedArticle.images[0].imageUrl}
                            alt="게시글 이미지"
                            className="w-full aspect-square object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setCurrentImageIndex(0)}
                          />
                        </div>
                      ) : (
                        <div className="relative group">
                          {/* Main Image Display */}
                          <div className="relative">
                            <img
                              src={selectedArticle.images[currentImageIndex].imageUrl}
                              alt={`게시글 이미지 ${currentImageIndex + 1}`}
                              className="w-full aspect-square object-cover rounded-lg"
                            />
                            
                            {/* Navigation Buttons - Only show on hover */}
                            {selectedArticle.images.length > 1 && (
                              <>
                                <button
                                  onClick={() => setCurrentImageIndex(
                                    currentImageIndex === 0 
                                      ? selectedArticle.images!.length - 1 
                                      : currentImageIndex - 1
                                  )}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all opacity-0 group-hover:opacity-100"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => setCurrentImageIndex(
                                    currentImageIndex === selectedArticle.images!.length - 1 
                                      ? 0 
                                      : currentImageIndex + 1
                                  )}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all opacity-0 group-hover:opacity-100"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                              </>
                            )}
                            
                            {/* Image Counter - Only show on hover */}
                            <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs transition-all opacity-0 group-hover:opacity-100">
                              {currentImageIndex + 1} / {selectedArticle.images.length}
                            </div>
                          </div>
                          
                          {/* Stacked Cards Effect */}
                          <div className="absolute inset-0 pointer-events-none">
                            {selectedArticle.images.length > 1 && (
                              <>
                                <div className="absolute inset-0 bg-background dark:bg-background-dark rounded-lg transform translate-x-1 translate-y-1 -z-10 opacity-60"></div>
                                {selectedArticle.images.length > 2 && (
                                  <div className="absolute inset-0 bg-background dark:bg-background-dark rounded-lg transform translate-x-2 translate-y-2 -z-20 opacity-30"></div>
                                )}
                              </>
                            )}
                          </div>
                          
                          {/* Thumbnail Navigation */}
                          {selectedArticle.images.length > 1 && (
                            <div className="mt-3 flex gap-1 overflow-x-auto">
                              {selectedArticle.images.map((image, index) => (
                                <button
                                  key={image.id}
                                  onClick={() => setCurrentImageIndex(index)}
                                  className={`flex-shrink-0 w-12 h-12 rounded border-2 overflow-hidden transition-all ${
                                    index === currentImageIndex 
                                      ? 'border-primary dark:border-primary-dark' 
                                      : 'border-border-primary dark:border-border-primary-dark opacity-60 hover:opacity-80'
                                  }`}
                                >
                                  <img
                                    src={image.imageUrl}
                                    alt={`썸네일 ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
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
                          {selectedArticle.content}
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
                    {selectedArticle.viewCount} 조회
                  </span>
                  {selectedArticle.images && selectedArticle.images.length > 0 && (
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {selectedArticle.images.length}개 이미지
                    </span>
                  )}
                </div>
                <div className="text-xs">
                  작성일: {formatDate(selectedArticle.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}