"use client";

import React, { useState, useRef, useEffect } from "react";
import { searchUserProfile, UserProfile } from "../../../../_apis/user";
import { getApiErrorMessage } from "@/app/_apis/interfaces";
import { MdBlock } from "react-icons/md";

interface UserInfo {
  user_id: string;
  nickname: string;
  profile_img: string;
}

interface UserSearchSectionProps {
  onBlockUser: (userId: string) => Promise<void>;
  isLoading: boolean;
}

export const UserSearchSection: React.FC<UserSearchSectionProps> = ({
  onBlockUser,
  isLoading,
}) => {
  const [searchNickname, setSearchNickname] = useState("");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 외부 클릭 시 popover 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowPopover(false);
      }
    };

    if (showPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopover]);

  const handleSearch = async () => {
    if (!searchNickname.trim()) return;
    
    setSearching(true);
    setNotFound(false);
    setUserInfo(null);
    setShowPopover(true);

    try {
      // 실제 사용자 검색 API 호출
      const userProfile = await searchUserProfile(searchNickname);
      
      // API 응답을 UserInfo 인터페이스에 맞게 변환
      setUserInfo({
        user_id: userProfile.user_id,
        nickname: userProfile.nickname,
        profile_img: userProfile.profile_img || ""
      });
    } catch (error: any) {
      console.error("사용자 검색 실패:", error);
      
      // API 에러 메시지 처리
      const errorMessage = getApiErrorMessage(error);
      if (errorMessage && errorMessage.includes("찾을 수 없")) {
        setNotFound(true);
      } else {
        // 다른 종류의 에러인 경우도 사용자를 찾을 수 없다고 표시
        setNotFound(true);
      }
    } finally {
      setSearching(false);
    }
  };

  const handleBlock = async () => {
    if (userInfo) {
      await onBlockUser(userInfo.user_id);
      clearSearch();
    }
  };

  const clearSearch = () => {
    setSearchNickname("");
    setUserInfo(null);
    setNotFound(false);
    setSearching(false);
    setShowPopover(false);
  };

  const handleInputFocus = () => {
    if (userInfo || notFound || searching) {
      setShowPopover(true);
    }
  };

  return (
    <div className="bg-gray-800 dark:bg-gray-800 p-4 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors">
      <h3 className="text-lg font-medium text-white mb-4">사용자 차단</h3>
      
      {/* 검색 입력 */}
      <div className="relative" ref={popoverRef}>
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={searchNickname}
            onChange={(e) => setSearchNickname(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            onFocus={handleInputFocus}
            placeholder="차단할 사용자 닉네임을 입력하세요"
            className="flex-1 bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            disabled={searching}
          />
          <button
            onClick={handleSearch}
            disabled={searching || !searchNickname.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white rounded transition-colors"
          >
            {searching ? "검색 중..." : "검색"}
          </button>
          {(userInfo || notFound) && (
            <button
              onClick={clearSearch}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
            >
              초기화
            </button>
          )}
        </div>

        {/* Popover 검색 결과 */}
        {showPopover && (userInfo || notFound || searching) && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50">
            <div className="bg-gray-800 border border-gray-600 rounded-lg shadow-2xl overflow-hidden">
              {/* 화살표 */}
              <div className="absolute -top-2 left-6 w-4 h-4 bg-gray-800 border-l border-t border-gray-600 transform rotate-45"></div>
              
              <div className="p-4">
                {/* 로딩 중 */}
                {searching && (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-gray-300 text-sm">사용자 검색 중...</p>
                    </div>
                  </div>
                )}

                {/* 사용자를 찾을 수 없음 */}
                {notFound && !searching && (
                  <div className="py-6">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <h4 className="text-red-400 font-medium mb-2">사용자를 찾을 수 없습니다</h4>
                      <p className="text-red-300 text-sm">입력하신 닉네임을 다시 확인해주세요.</p>
                    </div>
                  </div>
                )}

                {/* 사용자 정보 */}
                {userInfo && !searching && (
                  <div className="space-y-4">
                    {/* 사용자 정보 카드 */}
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-700/50 to-gray-700/30 rounded-lg border border-gray-600/50">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center ring-2 ring-gray-600/50">
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
                      <div className="flex-1">
                        <p className="text-sm">{userInfo.nickname}</p>
                        <p className="text-xs text-gray-400">ID: {userInfo.user_id}</p>
                      </div>
                      <button
                        onClick={handleBlock}
                        disabled={isLoading}
                        className="p-1 text-red-500 dark:text-red-500 hover:text-red-500 hover:bg-gray-700 dark:hover:text-red-400 dark:hover:bg-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed rounded transition-colors"
                        title={'차단'}
                      >
                        <MdBlock className="w-8 h-8" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
