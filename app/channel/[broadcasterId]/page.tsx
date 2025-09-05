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
          <div>
            <h1 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">
              {channelData.user.nickname}
            </h1>
            <p className="text-text-secondary dark:text-text-secondary-dark">
              방송자 ID: {channelData.user.userId}
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