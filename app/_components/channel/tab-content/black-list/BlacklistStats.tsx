"use client";

import React, { useState } from "react";

interface UserInfo {
  user_id: string;
  nickname: string;
  profile_img: string;
}

interface BlacklistStatsProps {
  totalCount: number;
  onBlockUser: (userId: string) => Promise<void>;
  isLoading: boolean;
}

export const BlacklistStats: React.FC<BlacklistStatsProps> = ({
  totalCount,
  onBlockUser,
  isLoading,
}) => {
  const [searchUserId, setSearchUserId] = useState("");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    if (!searchUserId.trim()) return;
    
    setSearching(true);
    setNotFound(false);
    setUserInfo(null);

    try {
      // TODO: 실제 사용자 검색 API 호출
      // const response = await searchUser(searchUserId);
      
      // 임시 데이터 (실제 API 연결 시 제거)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 사용자를 찾았다고 가정
      if (Math.random() > 0.3) { // 70% 확률로 사용자 찾음
        setUserInfo({
          user_id: searchUserId,
          nickname: `닉네임_${searchUserId}`,
          profile_img: ""
        });
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setSearching(false);
    }
  };

  const handleBlock = async () => {
    if (userInfo) {
      await onBlockUser(userInfo.user_id);
      setSearchUserId("");
      setUserInfo(null);
      setNotFound(false);
    }
  };

  const clearSearch = () => {
    setSearchUserId("");
    setUserInfo(null);
    setNotFound(false);
    setSearching(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 왼쪽: 전체 차단 회원 통계 */}
      <div className="bg-bg-secondary dark:bg-bg-secondary-dark p-4 rounded-lg border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">전체 차단 회원</p>
            <p className="text-2xl font-semibold text-white">{totalCount}명</p>
          </div>
          <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636" />
            </svg>
          </div>
        </div>
      </div>

      {/* 오른쪽: 사용자 검색 */}
      <div className="bg-bg-secondary dark:bg-bg-secondary-dark p-4 rounded-lg border border-gray-700">
        <h3 className="text-lg font-medium text-white mb-3">사용자 차단</h3>
        
        {/* 검색 입력 */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={searchUserId}
            onChange={(e) => setSearchUserId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="사용자 ID 검색"
            className="flex-1 bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500 text-sm"
            disabled={searching}
          />
          <button
            onClick={handleSearch}
            disabled={searching || !searchUserId.trim()}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded transition-colors text-sm"
          >
            {searching ? "검색중" : "검색"}
          </button>
          {(userInfo || notFound) && (
            <button
              onClick={clearSearch}
              className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors text-sm"
            >
              초기화
            </button>
          )}
        </div>

        {/* 검색 결과 */}
        {notFound && (
          <div className="p-2 bg-red-900/30 border border-red-700 rounded text-center">
            <p className="text-red-400 text-xs">사용자를 찾을 수 없습니다.</p>
          </div>
        )}

        {userInfo && (
          <div className="p-3 bg-gray-700 rounded border border-gray-600">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center">
                {userInfo.profile_img ? (
                  <img 
                    src={userInfo.profile_img} 
                    alt={userInfo.nickname} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-white text-sm">{userInfo.nickname}</p>
                <p className="text-xs text-gray-400">ID: {userInfo.user_id}</p>
              </div>
            </div>
            
            <button
              onClick={handleBlock}
              disabled={isLoading}
              className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded transition-colors text-sm"
            >
              {isLoading ? "차단 중..." : "차단하기"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
