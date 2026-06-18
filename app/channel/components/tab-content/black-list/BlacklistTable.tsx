"use client";

import React, { useEffect, useMemo, useState } from "react";
import { BlacklistUser } from "./BlacklistManager";
import { FiSearch, FiUnlock, FiUser } from "react-icons/fi";

interface BlacklistTableProps {
  users: BlacklistUser[];
  totalCount: number;
  searchTerm: string;
  onUnblockUser: (userId: string) => Promise<void>;
  onUnblockUsers: (userIds: string[]) => Promise<void>;
  isLoading: boolean;
}

export const BlacklistTable: React.FC<BlacklistTableProps> = ({
  users,
  totalCount,
  searchTerm,
  onUnblockUser,
  onUnblockUsers,
  isLoading,
}) => {
  const [unblockingUsers, setUnblockingUsers] = useState<Set<string>>(new Set());
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const visibleUserIds = useMemo(() => users.map((user) => user.user_id), [users]);
  const allVisibleSelected =
    visibleUserIds.length > 0 && visibleUserIds.every((userId) => selectedUserIds.includes(userId));

  useEffect(() => {
    setSelectedUserIds((prev) => prev.filter((userId) => visibleUserIds.includes(userId)));
  }, [visibleUserIds]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      timeZone: 'Asia/Seoul',
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

  const handleUnblockSelected = async () => {
    const targetIds = [...selectedUserIds];
    setUnblockingUsers(prev => new Set([...prev, ...targetIds]));
    try {
      await onUnblockUsers(targetIds);
      setSelectedUserIds([]);
    } finally {
      setUnblockingUsers(prev => {
        const newSet = new Set(prev);
        targetIds.forEach((userId) => newSet.delete(userId));
        return newSet;
      });
    }
  };

  const toggleAllVisible = () => {
    setSelectedUserIds((prev) => {
      if (allVisibleSelected) {
        return prev.filter((userId) => !visibleUserIds.includes(userId));
      }

      return Array.from(new Set([...prev, ...visibleUserIds]));
    });
  };

  const toggleUser = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((selectedUserId) => selectedUserId !== userId)
        : [...prev, userId],
    );
  };

  if (isLoading) {
    return (
      <div className="overflow-hidden" aria-hidden="true">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px]">
            <thead className="bg-bg-secondary">
              <tr>
                {['w-5', 'w-16', 'w-28', 'w-28', 'w-28', 'w-20'].map((w, i) => (
                  <th key={i} className="p-4">
                    <div className={`h-4 ${w} animate-pulse rounded bg-bg-tertiary`} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, row) => (
                <tr
                  key={row}
                  className="border-t border-border-primary"
                >
                  <td className="p-4">
                    <div className="h-4 w-4 animate-pulse rounded bg-bg-secondary" />
                  </td>
                  <td className="p-4">
                    <div className="w-12 h-12 rounded-full animate-pulse bg-bg-secondary" />
                  </td>
                  <td className="p-4 space-y-1">
                    <div className="h-4 w-24 animate-pulse rounded bg-bg-secondary" />
                    <div className="h-3 w-16 animate-pulse rounded bg-bg-secondary" />
                  </td>
                  <td className="p-4">
                    <div className="h-4 w-32 animate-pulse rounded bg-bg-secondary" />
                  </td>
                  <td className="p-4 text-center">
                    <div className="h-6 w-6 mx-auto animate-pulse rounded bg-bg-secondary" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-12">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-bg-secondary text-text-secondary">
            {searchTerm ? <FiSearch className="h-6 w-6" /> : <FiUser className="h-6 w-6" />}
          </div>
          <h3 className="mb-2 text-lg font-medium text-text-primary">
            {searchTerm ? "검색 결과가 없습니다" : "차단된 사용자가 없습니다"}
          </h3>
          <p className="text-sm text-text-secondary">
            {searchTerm ? "닉네임 검색어를 다시 확인하세요." : "사용자 차단 영역에서 차단할 사용자를 추가할 수 있습니다."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border-primary bg-bg-secondary px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-text-secondary">
          표시 {users.length}명
          {searchTerm && <span className="ml-1">/ 전체 {totalCount}명</span>}
        </p>

        {selectedUserIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-text-primary">{selectedUserIds.length}명 선택됨</span>
            <button
              type="button"
              onClick={() => setSelectedUserIds([])}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-border-primary bg-background px-3 text-sm text-text-primary transition-colors hover:border-border-hover"
            >
              선택 해제
            </button>
            <button
              type="button"
              onClick={handleUnblockSelected}
              disabled={selectedUserIds.some((userId) => unblockingUsers.has(userId))}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-accent px-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiUnlock className="h-4 w-4" aria-hidden="true" />
              차단 해제
            </button>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px] table-fixed">
          <thead className="bg-bg-secondary">
            <tr>
              <th className="w-12 p-4 text-left">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={toggleAllVisible}
                  aria-label="전체 선택"
                  className="h-4 w-4 rounded border-border-primary"
                />
              </th>
              <th className="w-20 p-4 text-left text-sm font-medium text-text-primary">프로필</th>
              <th className="p-4 text-left text-sm font-medium text-text-primary">닉네임</th>
              <th className="w-[220px] p-4 text-left text-sm font-medium text-text-primary">아이디</th>
              <th className="w-[210px] p-4 text-left text-sm font-medium text-text-primary">차단일</th>
              <th className="w-24 p-4 text-center text-sm font-medium text-text-primary">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-primary">
            {users.map((user, index) => (
              <tr
                key={user.user_id}
                className={`transition-colors hover:bg-bg-secondary ${
                  selectedUserIds.includes(user.user_id)
                    ? 'bg-accent/10'
                    : index % 2 === 0 ? 'bg-bg-tertiary/40' : 'bg-transparent'
                }`}
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedUserIds.includes(user.user_id)}
                    onChange={() => toggleUser(user.user_id)}
                    aria-label={`${user.nickname || user.user_id} 선택`}
                    className="h-4 w-4 rounded border-border-primary"
                  />
                </td>
                <td className="p-4">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-bg-primary">
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
                    <div className={`flex h-full w-full items-center justify-center ${user.profile_img ? 'hidden' : ''}`}>
                      <FiUser className="h-6 w-6 text-text-secondary" aria-hidden="true" />
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="truncate text-sm font-medium text-text-primary">
                    {user.nickname || '닉네임 없음'}
                  </p>
                </td>
                <td className="p-4">
                  <p className="truncate text-sm text-text-secondary">{user.user_id}</p>
                </td>
                <td className="p-4">
                  <span className="text-sm text-text-primary">{formatDate(user.blocked_at)}</span>
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleUnblock(user.user_id)}
                    disabled={unblockingUsers.has(user.user_id)}
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                      unblockingUsers.has(user.user_id)
                        ? 'text-text-secondary cursor-not-allowed'
                        : 'text-accent hover:bg-accent/10 cursor-pointer'
                    }`}
                    title="차단 해제"
                  >
                    <FiUnlock className="h-4 w-4" aria-hidden="true" />
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
