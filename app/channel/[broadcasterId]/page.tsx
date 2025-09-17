'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import ChannelLayout from '../../_components/channel/channel-layout';
import { BjArticle } from '../../_components/channel/tab-contents';
import FanLevel from '../../_components/channel/FanLevel';
import { getChannel, GetChannelResponse } from '../../_apis/channel';

interface ChannelPageProps {
  broadcasterId: string;
}

export default function ChannelPage({ params }: { params: Promise<ChannelPageProps> }) {
  const { broadcasterId } = use(params);
  const [activeTab, setActiveTab] = useState<'articles' | 'fanLevel'>('articles');
  const [channelData, setChannelData] = useState<GetChannelResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getChannel({ user_id: broadcasterId });
        setChannelData(data);
      } catch (err) {
        console.error('채널 데이터 조회 실패:', err);
        setError('채널 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchChannelData();
  }, [broadcasterId]);

  if (loading) {
    return (
      <ChannelLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary dark:border-primary-dark mx-auto mb-4"></div>
            <p className="text-text-secondary dark:text-text-secondary-dark">
              채널 정보를 불러오는 중...
            </p>
          </div>
        </div>
      </ChannelLayout>
    );
  }

  if (error || !channelData) {
    return (
      <ChannelLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <p className="text-red-500 dark:text-red-400 mb-4">
              {error || '채널 정보를 찾을 수 없습니다.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary dark:bg-primary-dark text-white rounded-md hover:opacity-80"
            >
              다시 시도
            </button>
          </div>
        </div>
      </ChannelLayout>
    );
  }

  return (
    <ChannelLayout>
      {/* Profile Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
            {channelData.user.profileImg ? (
              <img 
                src={channelData.user.profileImg} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl text-gray-600">
                {channelData.user.nickname[0] || broadcasterId[0]}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">
              {channelData.channel?.title || `${channelData.user.nickname}님의 채널`}
            </h1>
            <p className="text-text-secondary dark:text-text-secondary-dark">
              방송자: {channelData.user.nickname}
            </p>
          </div>
        </div>
      </div>

      {/* Channel Stats Cards */}
      {channelData.channel && (
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-border-primary dark:border-border-primary-dark text-center">
              <div className="text-2xl font-bold text-blue-500 mb-1">
                {channelData.channel.bookmark.toLocaleString()}
              </div>
              <div className="text-sm text-text-secondary dark:text-text-secondary-dark">
                북마크
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-border-primary dark:border-border-primary-dark text-center">
              <div className="text-2xl font-bold text-red-500 mb-1">
                {channelData.channel.recommend.toLocaleString()}
              </div>
              <div className="text-sm text-text-secondary dark:text-text-secondary-dark">
                추천
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-border-primary dark:border-border-primary-dark text-center">
              <div className="text-2xl font-bold text-green-500 mb-1">
                {channelData.channel.watch.toLocaleString()}
              </div>
              <div className="text-sm text-text-secondary dark:text-text-secondary-dark">
                조회수
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-border-primary dark:border-border-primary-dark text-center">
              <div className="text-2xl font-bold text-purple-500 mb-1">
                {Math.floor(channelData.channel.month_time / 60)}h
              </div>
              <div className="text-sm text-text-secondary dark:text-text-secondary-dark">
                이달 방송
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-border-primary dark:border-border-primary-dark text-center">
              <div className="text-2xl font-bold text-orange-500 mb-1">
                {Math.floor(channelData.channel.total_time / 60)}h
              </div>
              <div className="text-sm text-text-secondary dark:text-text-secondary-dark">
                총 방송시간
              </div>
            </div>
          </div>
        </div>
      )}

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
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'articles' && (
          <BjArticle userId={broadcasterId} />
        )}

        {activeTab === 'fanLevel' && (
          <FanLevel fanLevels={channelData.fanLevel} />
        )}

      </div>
    </ChannelLayout>
  );
}