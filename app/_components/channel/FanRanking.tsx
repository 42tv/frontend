import { useState } from 'react';
import { User } from '../../_types/user';

interface FanRankingUser extends User {
  totalDonation: number;
  fanLevel: {
    id: number;
    name: string;
    color: string;
  };
  rank: number;
}

interface FanRankingProps {
  broadcasterId: string;
}

export default function FanRanking({ broadcasterId }: FanRankingProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('month');

  // Mock data for UI demonstration
  const mockRankings: FanRankingUser[] = [
    {
      idx: 1,
      userId: 'fan001',
      nickname: '열성팬1',
      profileImageUrl: '/placeholder-avatar.png',
      totalDonation: 150000,
      fanLevel: { id: 5, name: '다이아몬드', color: '#3B82F6' },
      rank: 1,
    },
    {
      idx: 2,
      userId: 'fan002',
      nickname: '후원왕',
      profileImageUrl: '/placeholder-avatar.png',
      totalDonation: 120000,
      fanLevel: { id: 4, name: '골드', color: '#F59E0B' },
      rank: 2,
    },
    {
      idx: 3,
      userId: 'fan003',
      nickname: '응원단장',
      profileImageUrl: '/placeholder-avatar.png',
      totalDonation: 95000,
      fanLevel: { id: 4, name: '골드', color: '#F59E0B' },
      rank: 3,
    },
    {
      idx: 4,
      userId: 'fan004',
      nickname: '충성팬',
      profileImageUrl: '/placeholder-avatar.png',
      totalDonation: 75000,
      fanLevel: { id: 3, name: '실버', color: '#6B7280' },
      rank: 4,
    },
    {
      idx: 5,
      userId: 'fan005',
      nickname: '새싹팬',
      profileImageUrl: '/placeholder-avatar.png',
      totalDonation: 45000,
      fanLevel: { id: 2, name: '브론즈', color: '#92400E' },
      rank: 5,
    },
  ];

  const formatDonation = (amount: number) => {
    return amount.toLocaleString('ko-KR');
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <div className="text-2xl">🥇</div>;
      case 2:
        return <div className="text-2xl">🥈</div>;
      case 3:
        return <div className="text-2xl">🥉</div>;
      default:
        return (
          <div className="w-8 h-8 bg-background-secondary dark:bg-background-secondary-dark rounded-full flex items-center justify-center text-sm font-bold text-text-secondary dark:text-text-secondary-dark">
            {rank}
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark">
          팬 랭킹
        </h2>
        
        {/* Period Selector */}
        <div className="flex border border-border-primary dark:border-border-primary-dark rounded-lg overflow-hidden">
          {[
            { value: 'week', label: '주간' },
            { value: 'month', label: '월간' },
            { value: 'all', label: '전체' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setSelectedPeriod(value as any)}
              className={`px-3 py-1 text-sm ${
                selectedPeriod === value
                  ? 'bg-primary dark:bg-primary-dark text-white'
                  : 'bg-background dark:bg-background-dark text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark'
              } transition-colors`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {mockRankings.length === 0 ? (
        <div className="text-center py-12 bg-background-secondary dark:bg-background-secondary-dark rounded-lg">
          <div className="text-text-secondary dark:text-text-secondary-dark mb-4">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            아직 랭킹 데이터가 없습니다.
          </div>
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
            팬들의 후원이 시작되면 랭킹이 표시됩니다.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {mockRankings.map((user) => (
            <div
              key={user.idx}
              className={`border rounded-lg p-4 transition-colors ${
                user.rank <= 3
                  ? 'border-primary dark:border-primary-dark bg-primary/5 dark:bg-primary-dark/5'
                  : 'border-border-primary dark:border-border-primary-dark hover:bg-background-secondary dark:hover:bg-background-secondary-dark'
              }`}
            >
              <div className="flex items-center space-x-4">
                {/* Rank Icon */}
                <div className="flex-shrink-0">
                  {getRankIcon(user.rank)}
                </div>

                {/* Profile Image */}
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {user.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt={user.nickname}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg text-gray-600">
                      {user.nickname[0]}
                    </span>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-grow">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3
                      className="font-semibold"
                      style={{ color: user.fanLevel.color }}
                    >
                      {user.nickname}
                    </h3>
                    <span
                      className="text-xs px-2 py-1 rounded-full text-white"
                      style={{ backgroundColor: user.fanLevel.color }}
                    >
                      {user.fanLevel.name}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                    @{user.userId}
                  </p>
                </div>

                {/* Donation Amount */}
                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-bold text-text-primary dark:text-text-primary-dark">
                    {formatDonation(user.totalDonation)}원
                  </div>
                  <div className="text-xs text-text-secondary dark:text-text-secondary-dark">
                    {selectedPeriod === 'week' && '이번 주'}
                    {selectedPeriod === 'month' && '이번 달'}
                    {selectedPeriod === 'all' && '누적'} 후원
                  </div>
                </div>
              </div>
              
              {user.rank <= 3 && (
                <div className="mt-3 pt-3 border-t border-border-secondary dark:border-border-secondary-dark">
                  <div className="flex items-center text-xs text-text-secondary dark:text-text-secondary-dark">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    TOP 3 팬 - 특별 혜택 대상
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-background-secondary dark:bg-background-secondary-dark rounded-lg">
        <h3 className="font-medium text-text-primary dark:text-text-primary-dark mb-2">
          팬 랭킹 시스템 안내
        </h3>
        <div className="text-sm text-text-secondary dark:text-text-secondary-dark space-y-1">
          <p>• 후원 금액에 따라 팬 랭킹이 결정됩니다.</p>
          <p>• 상위 랭커들은 특별한 혜택과 권한을 받을 수 있습니다.</p>
          <p>• 랭킹은 선택한 기간에 따라 다르게 표시됩니다.</p>
          <p>• TOP 3 팬에게는 특별한 배지와 혜택이 제공됩니다.</p>
        </div>
      </div>
    </div>
  );
}