"use client";

import React, { useState, useEffect } from "react";
import { addToBlacklist, removeMultipleFromBlacklist, getBlacklist } from "../../_apis/user";
import errorModalStore from "../../_components/utils/store/errorModalStore";
import { getApiErrorMessage } from "@/app/_apis/interfaces";

interface BlacklistUser {
  user_idx: number;
  user_id: string;
  nickname: string;
  profile_img: string;
  blocked_at: string;
}

export const BlacklistContent = () => {
  const [blacklist, setBlacklist] = useState<BlacklistUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"temporary" | "permanent">("temporary");
  const [isLoading, setIsLoading] = useState(false);
  const { openError } = errorModalStore();

  // 블랙리스트 목록 불러오기
  const fetchBlacklist = async () => {
    try {
      const response = await getBlacklist();
      console.log(response.lists);
      setBlacklist(response.lists || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBlacklist();
  }, []);

  // 블랙리스트에 사용자 추가
  const handleAddUser = async () => {
    if (!searchTerm.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      await addToBlacklist(searchTerm);
      setSearchTerm("");
      await fetchBlacklist();
      openError("사용자가 블랙리스트에 추가되었습니다.");
    } catch (error: any) {
      const message = getApiErrorMessage(error)
      if (message) {
        openError(message);
      } else {
        openError("블랙리스트 추가에 실패했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 선택한 사용자들 블랙리스트에서 제거
  const handleRemoveSelected = async () => {
    if (selectedUsers.length === 0) {
      openError("해제할 사용자를 선택해주세요.");
      return;
    }

    if (!confirm(`${selectedUsers.length}명의 사용자를 블랙리스트에서 제거하시겠습니까?`)) {
      return;
    }

    setIsLoading(true);
    try {
      await removeMultipleFromBlacklist(selectedUsers);
      setSelectedUsers([]);
      await fetchBlacklist();
      openError("선택한 사용자들이 블랙리스트에서 제거되었습니다.");
    } catch (error) {
      openError("블랙리스트 제거에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 체크박스 전체 선택/해제
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(blacklist.map(user => user.user_id));
    } else {
      setSelectedUsers([]);
    }
  };

  // 개별 체크박스 선택/해제
  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <div className="bg-bg-primary dark:bg-bg-primary-dark min-h-screen">
      <div className="p-6">
        {/* 검색 섹션 */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleAddUser}
            disabled={isLoading}
            className="px-4 py-2 bg-bg-tertiary dark:bg-bg-tertiary-dark text-text-primary dark:text-text-primary-dark rounded hover:bg-bg-hover dark:hover:bg-bg-hover-dark disabled:bg-text-muted disabled:cursor-not-allowed transition-colors"
          >
            추가
          </button>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddUser()}
            placeholder="회원 아이디"
            className="flex-1 bg-bg-secondary dark:bg-bg-secondary-dark text-text-primary dark:text-text-primary-dark px-4 py-2 rounded border border-border-primary dark:border-border-primary-dark focus:outline-none focus:border-primary"
            disabled={isLoading}
          />
        </div>

        {/* 총 개시물 표시 */}
        <div className="mb-4 text-text-muted dark:text-text-muted-dark">
          차단 회원: <span className="text-text-primary dark:text-text-primary-dark">{blacklist.length}명</span>
        </div>

        {/* 테이블 */}
        <div className="bg-bg-secondary dark:bg-bg-secondary-dark rounded overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-secondary dark:border-border-secondary-dark">
                <th className="w-12 p-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === blacklist.length && blacklist.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4"
                  />
                </th>
                <th className="w-20 text-left p-4 text-text-muted dark:text-text-muted-dark font-medium">이미지</th>
                <th className="text-left p-4 text-text-muted dark:text-text-muted-dark font-medium">닉네임(아이디)</th>
                <th className="text-left p-4 text-text-muted dark:text-text-muted-dark font-medium">제재일</th>
              </tr>
            </thead>
            <tbody>
              {blacklist.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-20">
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 mb-4">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <circle cx="50" cy="50" r="40" fill="#4A5568"/>
                          <circle cx="35" cy="40" r="5" fill="#2D3748"/>
                          <circle cx="65" cy="40" r="5" fill="#2D3748"/>
                          <path d="M 30 60 Q 50 50 70 60" stroke="#2D3748" strokeWidth="3" fill="none"/>
                        </svg>
                      </div>
                      <p className="text-text-muted dark:text-text-muted-dark">강퇴내역이 없습니다.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                blacklist.map((user) => (
                  <tr key={user.user_id} className="border-b border-border-secondary dark:border-border-secondary-dark hover:bg-bg-hover dark:hover:bg-bg-hover-dark">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.user_id)}
                        onChange={(e) => handleSelectUser(user.user_id, e.target.checked)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="p-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        {user.profile_img ? (
                          <img 
                            src={user.profile_img} 
                            alt={`${user.nickname || user.user_id}의 프로필`} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-bg-tertiary dark:bg-bg-tertiary-dark flex items-center justify-center">
                            <span className="text-text-muted dark:text-text-muted-dark text-xs">No IMG</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium">{`${user.nickname} (${user.user_id})`|| ''}</p>
                    </td>
                    <td className="p-4 text-text-muted dark:text-text-muted-dark">{formatDate(user.blocked_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 해제 버튼 */}
        {blacklist.length > 0 && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleRemoveSelected}
              disabled={isLoading || selectedUsers.length === 0}
              className="px-8 py-2 bg-bg-tertiary dark:bg-bg-tertiary-dark text-text-primary dark:text-text-primary-dark rounded hover:bg-bg-hover dark:hover:bg-bg-hover-dark disabled:bg-text-muted disabled:text-text-secondary disabled:cursor-not-allowed transition-colors"
            >
              해제
            </button>
          </div>
        )}
      </div>
    </div>
  );
};