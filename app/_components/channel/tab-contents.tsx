'use client';
import React from "react";
import Image from "next/image";
import ArticleManager from "./ArticleManager";
import ArticleList from "./ArticleList";
import { Article } from "../../_types/article";

export const BjArticle = () => {
  // Mock data for demonstration
  const mockArticles: Article[] = [
    {
      id: 1,
      title: '방송 장비 세팅 가이드 (5개 이미지)',
      content: '새로 구입한 방송 장비들을 세팅하는 과정을 단계별로 정리해봤습니다. 마이크, 카메라, 조명, 키보드, 모니터 설정 방법을 자세히 설명드리겠습니다.',
      authorIdx: 1,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      viewCount: 342,
      images: [
        { id: 1, articleId: 1, imageUrl: 'https://picsum.photos/400/300?random=1', createdAt: '2024-01-15T10:30:00Z' },
        { id: 2, articleId: 1, imageUrl: 'https://picsum.photos/400/300?random=2', createdAt: '2024-01-15T10:30:00Z' },
        { id: 3, articleId: 1, imageUrl: 'https://picsum.photos/400/300?random=3', createdAt: '2024-01-15T10:30:00Z' },
        { id: 4, articleId: 1, imageUrl: 'https://picsum.photos/400/300?random=4', createdAt: '2024-01-15T10:30:00Z' },
        { id: 5, articleId: 1, imageUrl: 'https://picsum.photos/400/300?random=5', createdAt: '2024-01-15T10:30:00Z' }
      ]
    },
    {
      id: 2,
      title: '게임 플레이 하이라이트 (3개 이미지)',
      content: '오늘 방송에서 있었던 재미있는 게임 플레이 순간들을 정리해봤습니다. 특히 보스전에서의 극적인 승리 장면이 인상적이었어요!',
      authorIdx: 1,
      createdAt: '2024-01-14T15:20:00Z',
      updatedAt: '2024-01-14T15:20:00Z',
      viewCount: 287,
      images: [
        { id: 6, articleId: 2, imageUrl: 'https://picsum.photos/400/300?random=6', createdAt: '2024-01-14T15:20:00Z' },
        { id: 7, articleId: 2, imageUrl: 'https://picsum.photos/400/300?random=7', createdAt: '2024-01-14T15:20:00Z' },
        { id: 8, articleId: 2, imageUrl: 'https://picsum.photos/400/300?random=8', createdAt: '2024-01-14T15:20:00Z' }
      ]
    },
    {
      id: 3,
      title: '새로운 프로필 사진 공개 (1개 이미지)',
      content: '새로운 프로필 사진을 촬영했습니다! 어떤가요? 이전 프로필보다 더 자연스럽고 밝은 느낌으로 찍어봤어요.',
      authorIdx: 1,
      createdAt: '2024-01-13T12:00:00Z',
      updatedAt: '2024-01-13T12:00:00Z',
      viewCount: 195,
      images: [
        { id: 9, articleId: 3, imageUrl: 'https://picsum.photos/400/300?random=9', createdAt: '2024-01-13T12:00:00Z' }
      ]
    },
    {
      id: 4,
      title: '다음 주 방송 일정 안내 (이미지 없음)',
      content: '다음 주 방송 일정을 안내드립니다. 월요일 오후 7시, 수요일 오후 8시, 금요일 오후 6시, 일요일 오후 5시에 방송할 예정입니다. 새로운 게임도 준비하고 있으니 많은 기대 부탁드려요!',
      authorIdx: 1,
      createdAt: '2024-01-12T09:15:00Z',
      updatedAt: '2024-01-12T09:15:00Z',
      viewCount: 423,
    },
  ];

  const handleDelete = (article: any) => {
    if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      console.log('Delete article:', article);
    }
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
            총 {mockArticles.length}개의 게시글
          </p>
        </div>
      </div>

      {/* Article List with Actions */}
      <ArticleList 
        articles={mockArticles} 
        showActions={true}
        showCreateButton={true}
        onDelete={handleDelete}
      />
    </div>
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
