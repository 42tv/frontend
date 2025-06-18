"use client";

import React, { useState } from "react";

interface UserInfo {
  user_id: string;
  nickname: string;
  profile_img: string;
  // 추가 사용자 정보들
}

interface UserSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBlock: (userId: string) => Promise<void>;
  isLoading: boolean;
}

export const UserSearchModal: React.FC<UserSearchModalProps> = ({
  isOpen,
  onClose,
  onBlock,
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
      setUserInfo({
        user_id: searchUserId,
        nickname: `닉네임_${searchUserId}`,
        profile_img: "/default-avatar.png"
      });
    } catch (error) {
      setNotFound(true);
    } finally {
      setSearching(false);
    }
  };

  const handleBlock = async () => {
    if (userInfo) {
      await onBlock(userInfo.user_id);
      handleClose();
    }
  };

  const handleClose = () => {
    setSearchUserId("");
    setUserInfo(null);
    setNotFound(false);
    setSearching(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">사용자 차단</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 검색 입력 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            사용자 ID 검색
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchUserId}
              onChange={(e) => setSearchUserId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="차단할 사용자 ID를 입력하세요"
              className="flex-1 bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
              disabled={searching}
            />
            <button
              onClick={handleSearch}
              disabled={searching || !searchUserId.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded transition-colors"
            >
              {searching ? "검색 중..." : "검색"}
            </button>
          </div>
        </div>

        {/* 검색 결과 */}
        {notFound && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded">
            <p className="text-red-400 text-sm">사용자를 찾을 수 없습니다.</p>
          </div>
        )}

        {userInfo && (
          <div className="mb-4 p-4 bg-gray-700 rounded border border-gray-600">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center">
                {userInfo.profile_img ? (
                  <img 
                    src={userInfo.profile_img} 
                    alt={userInfo.nickname} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              <div>
                <p className="font-medium text-white">{userInfo.nickname}</p>
                <p className="text-sm text-gray-400">ID: {userInfo.user_id}</p>
              </div>
            </div>
            
            <div className="bg-yellow-900/30 border border-yellow-700 rounded p-3 mb-3">
              <p className="text-yellow-400 text-sm">
                ⚠️ 이 사용자를 차단하시겠습니까?
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleBlock}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded transition-colors"
              >
                {isLoading ? "차단 중..." : "차단"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
