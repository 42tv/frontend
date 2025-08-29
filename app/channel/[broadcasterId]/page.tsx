'use client';

import { useState } from 'react';
import { use } from 'react';
import ChannelLayout from '../../_components/channel/channel-layout';
import ArticleList from '../../_components/channel/ArticleList';
import FanLevel from '../../_components/channel/FanLevel';
import FanRanking from '../../_components/channel/FanRanking';
import { mockArticles } from '../../_components/channel/mockData';
import { FanLevel as FanLevelType } from '../../_types';

interface ChannelPageProps {
  broadcasterId: string;
}

export default function ChannelPage({ params }: { params: Promise<ChannelPageProps> }) {
  const { broadcasterId } = use(params);
  const [activeTab, setActiveTab] = useState<'articles' | 'fanLevel' | 'ranking'>('articles');


  const mockFanLevels: FanLevelType[] = [
    { id: 1, name: '새싹', min_donation: 0, color: '#10B981' },
    { id: 2, name: '브론즈', min_donation: 10000, color: '#92400E' },
    { id: 3, name: '실버', min_donation: 50000, color: '#6B7280' },
    { id: 4, name: '골드', min_donation: 100000, color: '#F59E0B' },
    { id: 5, name: '다이아몬드', min_donation: 500000, color: '#3B82F6' },
  ];

  const mockUserProfile = {
    nickname: `방송자${broadcasterId}`,
    profileImageUrl: null,
  };

  return (
    <ChannelLayout>
      {/* Profile Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
            {mockUserProfile.profileImageUrl ? (
              <img 
                src={mockUserProfile.profileImageUrl} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl text-gray-600">
                {mockUserProfile.nickname[0] || broadcasterId[0]}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">
              {mockUserProfile.nickname}
            </h1>
            <p className="text-text-secondary dark:text-text-secondary-dark">
              방송자 ID: {broadcasterId}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border-primary dark:border-border-primary-dark mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('articles')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'articles'
                ? 'border-primary dark:border-primary-dark text-primary dark:text-primary-dark'
                : 'border-transparent text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark hover:border-gray-300'
            }`}
          >
            게시글
          </button>
          <button
            onClick={() => setActiveTab('fanLevel')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'fanLevel'
                ? 'border-primary dark:border-primary-dark text-primary dark:text-primary-dark'
                : 'border-transparent text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark hover:border-gray-300'
            }`}
          >
            팬 등급
          </button>
          <button
            onClick={() => setActiveTab('ranking')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'ranking'
                ? 'border-primary dark:border-primary-dark text-primary dark:text-primary-dark'
                : 'border-transparent text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark hover:border-gray-300'
            }`}
          >
            팬 랭킹
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'articles' && (
          <ArticleList articles={mockArticles} />
        )}

        {activeTab === 'fanLevel' && (
          <FanLevel fanLevels={mockFanLevels} />
        )}

        {activeTab === 'ranking' && (
          <FanRanking broadcasterId={broadcasterId} />
        )}
      </div>
    </ChannelLayout>
  );
}