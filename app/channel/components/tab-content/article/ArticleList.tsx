'use client'
import { useState } from 'react';
import { Article, ArticleListResponse } from '../../../../_types/article';
import ArticleListItem from './ArticleListItem';
import ArticleDetailModal from './ArticleDetailModal';
import ArticleFormModal from './ArticleFormModal';
import Pagination from './Pagination';

interface ArticleListProps {
  articles: Article[];
  pagination?: ArticleListResponse['pagination'];
  showActions?: boolean;
  showCreateButton?: boolean;
  onDelete?: (article: Article) => void;
  onArticleCreated?: (article: Article) => Promise<void>;
  onRefresh?: () => Promise<void>;
  onPageChange?: (page: number) => void;
}

export default function ArticleList({ 
  articles, 
  pagination,
  showActions = false, 
  showCreateButton = false, 
  onDelete, 
  onArticleCreated,
  onRefresh,
  onPageChange
}: ArticleListProps) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateClick = (): void => {
    setIsCreating(true);
  };

  const handleEditClick = (article: Article): void => {
    setEditingArticle(article);
  };

  const handleCloseDetailModal = (): void => {
    setSelectedArticle(null);
  };

  const handleCloseFormModal = (): void => {
    setIsCreating(false);
    setEditingArticle(null);
  };

  const handleFormSuccess = async (article: Article) => {
    console.log('ArticleList: handleFormSuccess called');
    if (onRefresh) {
      await onRefresh();
    }
    if (onArticleCreated) {
      await onArticleCreated(article);
    }
  };

  return (
    <div className="space-y-4">
      {/* Create Button */}
      <div className="flex justify-end items-center">
        {showCreateButton && (
          <button
            onClick={handleCreateClick}
            className="px-4 py-2 rounded-lg transition-colors"
            style={{ backgroundColor: 'var(--primary-100)', color: 'var(--text-100)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-100)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-100)'}
          >
            새 게시글 작성
          </button>
        )}
      </div>

      {/* Article List */}
      {!articles || articles.length === 0 ? (
        <div className="text-center py-12 rounded-lg" style={{ backgroundColor: 'var(--bg-200)' }}>
          <div style={{ color: 'var(--text-200)' }}>
            작성된 게시글이 없습니다.
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {articles.map((article, index) => (
            <ArticleListItem
              key={article.id || `article-${index}`}
              article={article}
              showActions={showActions}
              onSelect={setSelectedArticle}
              onEdit={handleEditClick}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && onPageChange && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
        />
      )}

      {/* Modals */}
      {selectedArticle && (
        <ArticleDetailModal
          article={selectedArticle}
          onClose={handleCloseDetailModal}
        />
      )}

      {isCreating && (
        <ArticleFormModal
          mode="create"
          onClose={handleCloseFormModal}
          onSuccess={handleFormSuccess}
        />
      )}

      {editingArticle && (
        <ArticleFormModal
          mode="edit"
          article={editingArticle}
          onClose={handleCloseFormModal}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}