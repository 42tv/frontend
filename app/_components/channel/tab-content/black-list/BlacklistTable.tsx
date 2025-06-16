"use client";

import React, { useState } from "react";
import { BlacklistUser } from "./BlacklistManager";

interface BlacklistTableProps {
  users: BlacklistUser[];
  onUnblockUser: (userId: string) => Promise<void>;
  isLoading: boolean;
}

export const BlacklistTable: React.FC<BlacklistTableProps> = ({
  users,
  onUnblockUser,
  isLoading,
}) => {
  const [unblockingUsers, setUnblockingUsers] = useState<Set<string>>(new Set());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleUnblock = async (userId: string) => {
    if (!confirm("이 사용자의 차단을 해제하시겠습니까?")) {
      return;
    }

    setUnblockingUsers(prev => new Set(prev).add(userId));
    try {
      await onUnblockUser(userId);
    } finally {
      setUnblockingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 dark:bg-gray-800 rounded-lg border border-gray-600 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-400">로딩 중...</span>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-gray-800 dark:bg-gray-800 rounded-lg border border-gray-600 p-12">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 mb-4 bg-gray-700 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">차단된 사용자가 없습니다</h3>
          <p className="text-gray-400 text-sm">위의 "사용자 차단" 버튼을 통해 사용자를 차단할 수 있습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 dark:bg-gray-800 rounded-lg border border-gray-600 overflow-hidden hover:border-gray-500 transition-colors">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="w-16 text-left p-4 text-gray-300 font-medium text-sm">프로필</th>
              <th className="text-left p-4 text-gray-300 font-medium text-sm">사용자 정보</th>
              <th className="text-left p-4 text-gray-300 font-medium text-sm min-w-[140px]">차단일</th>
              <th className="w-24 text-center p-4 text-gray-300 font-medium text-sm">액션</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr 
                key={user.user_id} 
                className={`border-t border-gray-600 hover:bg-gray-700/50 transition-colors ${
                  index % 2 === 0 ? 'bg-gray-700/30' : 'bg-transparent'
                }`}
              >
                <td className="p-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                    {user.profile_img ? (
                      <img 
                        src={user.profile_img} 
                        alt={`${user.nickname || user.user_id}의 프로필`} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          if (e.currentTarget.nextElementSibling) {
                            (e.currentTarget.nextElementSibling as HTMLElement).classList.remove('hidden');
                          }
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center ${user.profile_img ? 'hidden' : ''}`}>
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div>
                    <p className="font-medium text-white text-sm">
                      {user.nickname || '닉네임 없음'}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      ID: {user.user_id}
                    </p>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-gray-300 text-sm">
                    {formatDate(user.blocked_at)}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleUnblock(user.user_id)}
                    disabled={unblockingUsers.has(user.user_id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded text-sm transition-colors"
                  >
                    {unblockingUsers.has(user.user_id) ? '해제 중...' : '차단해제'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 테이블 하단 정보 */}
      <div className="bg-gray-700 px-4 py-3 border-t border-gray-600">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>총 {users.length}명의 차단된 사용자</span>
        </div>
      </div>
    </div>
  );
};
