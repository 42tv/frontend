'use client';
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArticleList } from "./tab-content/article";
import { getArticles } from "../../_apis/article";
import { Article } from "../../_types/article";

interface BjArticleProps {
  userIdx: number;
}

export const BjArticle: React.FC<BjArticleProps> = ({ userIdx }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getArticles({ 
        userIdx,
        offset: 0,
        limit: 10 
      });
      console.log('API Response:', response);
      console.log('Articles:', response.articles);
      console.log('Articles length:', response.articles?.length);
      
      // 백엔드 응답 구조에 따라 데이터 처리
      let articles: Article[] = [];
      const responseData = response as any; // 타입 안전성을 위해 임시로 any 사용
      
      if (Array.isArray(responseData)) {
        // 응답이 직접 배열인 경우
        articles = responseData;
      } else if (responseData.articles && Array.isArray(responseData.articles)) {
        // 응답이 { articles: [] } 구조인 경우
        articles = responseData.articles;
      } else if (responseData.data && Array.isArray(responseData.data)) {
        // 응답이 { data: [] } 구조인 경우
        articles = responseData.data;
      } else if (responseData.data && responseData.data.articles && Array.isArray(responseData.data.articles)) {
        // 응답이 { data: { articles: [] } } 구조인 경우
        articles = responseData.data.articles;
      }
      
      console.log('Processed articles:', articles);
      console.log('Processed articles length:', articles.length);
      setArticles(articles);
    } catch (err) {
      console.error('게시글 조회 실패:', err);
      setError('게시글을 불러오는데 실패했습니다.');
      setArticles([]); // 에러 시에도 빈 배열로 설정
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = (article: Article) => {
    if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      console.log('Delete article:', article);
      // TODO: 삭제 API 호출 후 목록 새로고침
      fetchArticles();
    }
  };

  const handleArticleCreated = () => {
    // 새로운 게시글이 생성되면 목록을 새로고침
    fetchArticles();
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
      showActions={true}
      showCreateButton={true}
      onDelete={handleDelete}
      onArticleCreated={handleArticleCreated}
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
