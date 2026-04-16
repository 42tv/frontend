'use client';
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArticleList } from "./tab-content/article";
import { getArticles, deleteArticle } from "../../_apis/article";
import { Article, ArticleListResponse } from "../../_types/article";

interface BjArticleProps {
  userId: string;
  showActions?: boolean;
  showCreateButton?: boolean;
}

export const BjArticle: React.FC<BjArticleProps> = ({ 
  userId, 
  showActions = false, 
  showCreateButton = false 
}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<ArticleListResponse['pagination'] | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async (page: number = currentPage) => {
    console.log('tab-contents: fetchArticles called with page:', page);
    try {
      setLoading(true);
      const response = await getArticles({ 
        userId,
        page: page,
        limit: 5 
      });
      console.log('tab-contents: API Response:', response);
      
      // 새로운 응답 구조: { data: Article[], pagination: {...} }
      setArticles(response.data || []);
      setPagination(response.pagination);
      setCurrentPage(page);
    } catch (err) {
      console.error('게시글 조회 실패:', err);
      setArticles([]); // 에러 시에도 빈 배열로 설정
      setPagination(undefined);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(1);
  }, [userId]);

  const handlePageChange = async (page: number): Promise<void> => {
    await fetchArticles(page);
  };

  const handleDelete = async (article: Article) => {
    if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        await deleteArticle(article.id);
        // 삭제 후 현재 페이지의 게시글이 없으면 이전 페이지로
        const remainingItems = articles.length - 1;
        const shouldGoToPrevPage = remainingItems === 0 && currentPage > 1;
        const targetPage = shouldGoToPrevPage ? currentPage - 1 : currentPage;
        await fetchArticles(targetPage);
      } catch (error) {
        console.error('Failed to delete article:', error);
        alert('게시글 삭제에 실패했습니다.');
      }
    }
  };

  const handleArticleCreated = async () => {
    console.log('tab-contents: handleArticleCreated called');
    // 새 게시글 생성 시 첫 페이지로 이동
    await fetchArticles(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-text-secondary">
          게시글을 불러오는 중...
        </div>
      </div>
    );
  }

  return (
    <ArticleList 
      articles={articles} 
      pagination={pagination}
      showActions={showActions}
      showCreateButton={showCreateButton}
      onDelete={showActions ? handleDelete : undefined}
      onArticleCreated={showCreateButton ? handleArticleCreated : undefined}
      onRefresh={() => fetchArticles(currentPage)}
      onPageChange={handlePageChange}
    />
  );
};

export { DonationStatsContent as StatsContent } from "./tab-content/donation-stats/DonationStatsContent";

export { FanRankContent } from "./tab-content/fan-rank/fan-rank-content";
export { default as BroadcastSettings } from "./tab-content/broadcast-setting/broadcast-setting";

export { BlacklistManager as BlacklistContent } from "./tab-content/black-list";

export const ClipsContent = () => {
  return (
    <div className="p-6 rounded-lg bg-bg-secondary border border-border-primary">
      <h3 className="font-bold text-xl mb-4 text-text-primary">클립</h3>
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((clip) => (
          <div key={clip} className="rounded overflow-hidden bg-bg-tertiary">
            <div className="h-32 bg-background"></div>
            <div className="p-3">
              <p className="font-medium text-text-primary">클립 제목 {clip}</p>
              <p className="text-sm text-text-secondary">조회수 {clip * 100}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CommunityContent = () => {
  return (
    <div className="p-6 rounded-lg bg-bg-secondary border border-border-primary">
      <h3 className="font-bold text-xl mb-4 text-text-primary">커뮤니티</h3>
      <div className="space-y-4">
        {[1, 2, 3].map((post) => (
          <div key={post} className="p-4 rounded bg-bg-tertiary">
            <p className="font-medium text-text-primary">게시글 제목 {post}</p>
            <p className="text-sm mt-1 text-text-secondary">작성자: 유저{post} • 좋아요: {post * 5}</p>
            <p className="mt-2 text-text-primary">게시글 내용 예시입니다...</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export { ExchangeContent } from './tab-content/exchange/ExchangeContent';

export const EmptyStateContent = () => {
  return (
    <div className="flex flex-col items-center text-center mt-20 text-text-secondary">
      <Image
        src="/images/empty_character.png"
        alt="Empty Character"
        width={100}
        height={100}
      />
      <p className="mt-4">여긴 너무 조용하네요...</p>
      <p>언젠간 밤새는 킬러 4203님을 만날 수 있겠죠?</p>
    </div>
  );
};
