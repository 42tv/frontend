"use client";

import React, { useState } from "react";
import { BlacklistUser } from "./BlacklistManager";
import { CgUnblock } from "react-icons/cg";

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
      <div className="rounded-lg p-8 border border-border-primary">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          <span className="ml-3 text-text-secondary">로딩 중...</span>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="rounded-lg p-12 border border-border-primary">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 mb-4 rounded-full flex items-center justify-center bg-bg-primary">
            <svg className="w-8 h-8 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2 text-text-primary">차단된 사용자가 없습니다</h3>
          <p className="text-sm text-text-secondary">위의 &quot;사용자 차단&quot; 버튼을 통해 사용자를 차단할 수 있습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden transition-colors border border-border-primary hover:border-bg-secondary">

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-bg-secondary">
            <tr>
              <th className="w-16 text-left p-4 font-medium text-sm text-text-primary">프로필</th>
              <th className="text-left p-4 font-medium text-sm text-text-primary">사용자 정보</th>
              <th className="text-left p-4 font-medium text-sm min-w-[140px] text-text-primary">차단일</th>
              <th className="w-24 text-center p-4 font-medium text-sm text-text-primary">차단 해제</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.user_id}
                className={`transition-colors border-t border-bg-tertiary hover:bg-bg-secondary ${
                  index % 2 === 0 ? 'bg-bg-tertiary' : 'bg-transparent'
                }`}
              >
                <td className="p-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-bg-primary">
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
                      <svg className="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div>
                    <p className="font-medium text-sm text-text-primary">
                      {user.nickname || '닉네임 없음'}
                    </p>
                    <p className="text-xs mt-1 text-text-secondary">
                      ID: {user.user_id}
                    </p>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-text-primary">
                    {formatDate(user.blocked_at)}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleUnblock(user.user_id)}
                    disabled={unblockingUsers.has(user.user_id)}
                    className={`p-1 rounded transition-colors ${
                      unblockingUsers.has(user.user_id)
                        ? 'text-text-secondary cursor-not-allowed'
                        : 'text-accent hover:bg-bg-secondary hover:text-accent cursor-pointer'
                    }`}
                    title="차단 해제"
                  >
                    <CgUnblock className="w-6 h-6" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};