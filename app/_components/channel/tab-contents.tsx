'use client';
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArticleList } from "./tab-content/article";
import { getArticles, deleteArticle } from "../../_apis/article";
import { Article, ArticleListResponse } from "../../_types/article";

interface BjArticleProps {
  userIdx: number;
  showActions?: boolean;
  showCreateButton?: boolean;
}

export const BjArticle: React.FC<BjArticleProps> = ({ 
  userIdx, 
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
        userIdx,
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
  }, [userIdx]);

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
        <div className="text-text-secondary dark:text-text-secondary-dark">
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

export const StatsContent = () => {
  return (
    <div className="bg-gray-900 dark:bg-gray-900 p-6 rounded-lg border border-gray-700">
      <h3 className="font-bold text-xl mb-4 text-text-primary dark:text-text-primary-dark">통계</h3>
      <div className="space-y-4">
        <div className="bg-bg-secondary dark:bg-bg-secondary-dark p-4 rounded">
          <p className="font-medium text-text-primary dark:text-text-primary-dark">일간 시청자 수</p>
          <div className="h-40 mt-2 flex items-end">
            {[30, 45, 25, 60, 40, 75, 35].map((height, i) => (
              <div key={i} className="flex-1 mx-1">
                <div style={{ height: `${height}%` }} className="bg-primary rounded-t"></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-gray-400">
            <span>월</span>
            <span>일</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { FanRankContent } from "./tab-content/fan-rank/fan-rank-content";
export { default as BroadcastSettings } from "./tab-content/broadcast-setting/broadcast-setting";

export { BlacklistManager as BlacklistContent } from "./tab-content/black-list";

export const ClipsContent = () => {
  return (
    <div className="bg-gray-900 dark:bg-gray-900 p-6 rounded-lg border border-gray-700">
      <h3 className="font-bold text-xl mb-4 text-text-primary dark:text-text-primary-dark">클립</h3>
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((clip) => (
          <div key={clip} className="bg-bg-secondary dark:bg-bg-secondary-dark rounded overflow-hidden">
            <div className="h-32 bg-bg-tertiary dark:bg-bg-tertiary-dark"></div>
            <div className="p-3">
              <p className="font-medium text-text-primary dark:text-text-primary-dark">클립 제목 {clip}</p>
              <p className="text-sm text-gray-400">조회수 {clip * 100}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CommunityContent = () => {
  return (
    <div className="bg-gray-900 dark:bg-gray-900 p-6 rounded-lg border border-gray-700">
      <h3 className="font-bold text-xl mb-4 text-text-primary dark:text-text-primary-dark">커뮤니티</h3>
      <div className="space-y-4">
        {[1, 2, 3].map((post) => (
          <div key={post} className="bg-bg-secondary dark:bg-bg-secondary-dark p-4 rounded">
            <p className="font-medium text-text-primary dark:text-text-primary-dark">게시글 제목 {post}</p>
            <p className="text-sm text-gray-400 mt-1">작성자: 유저{post} • 좋아요: {post * 5}</p>
            <p className="mt-2 text-text-primary dark:text-text-primary-dark">게시글 내용 예시입니다...</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ExchangeContent = () => {
  return (
    <div className="bg-gray-900 dark:bg-gray-900 p-6 rounded-lg border border-gray-700">
      <h3 className="font-bold text-xl mb-4 text-text-primary dark:text-text-primary-dark">환전</h3>
      <div className="space-y-4">
        <div className="bg-bg-secondary dark:bg-bg-secondary-dark p-4 rounded">
          <p className="font-medium text-text-primary dark:text-text-primary-dark">현재 보유 포인트</p>
          <p className="text-2xl font-bold mt-1 text-text-primary dark:text-text-primary-dark">12,345 P</p>
        </div>
        <div className="bg-bg-secondary dark:bg-bg-secondary-dark p-4 rounded">
          <p className="font-medium mb-2 text-text-primary dark:text-text-primary-dark">환전 신청</p>
          <input className="w-full bg-bg-tertiary dark:bg-bg-tertiary-dark p-2 rounded mb-2 text-text-primary dark:text-text-primary-dark border border-gray-700" placeholder="환전할 포인트" />
          <button className="w-full bg-primary text-white py-2 rounded hover:bg-primary-hover transition-colors">환전 신청</button>
        </div>
      </div>
    </div>
  );
};

export const EmptyStateContent = () => {
  return (
    <div className="flex flex-col items-center text-center text-text-muted dark:text-text-muted-dark mt-20">
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
