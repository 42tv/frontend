"use client";

import React, { useState, useEffect } from "react";
import { addToBlacklist, removeFromBlacklist, getBlacklist } from "../../_apis/user";
import errorModalStore from "../../_components/utils/store/errorModalStore";

interface BlacklistUser {
  id: string;
  nickname: string;
  createdAt: string;
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
      setBlacklist(response.data || []);
    } catch (error) {
      openError("블랙리스트 목록을 불러오는데 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchBlacklist();
  }, []);

  // 블랙리스트에 사용자 추가
  const handleAddUser = async () => {
    if (!searchTerm.trim()) {
      openError("사용자 ID 또는 닉네임을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      await addToBlacklist(searchTerm);
      setSearchTerm("");
      await fetchBlacklist();
      openError("사용자가 블랙리스트에 추가되었습니다.");
    } catch (error: any) {
      if (error.response?.status === 404) {
        openError("존재하지 않는 사용자입니다.");
      } else if (error.response?.status === 409) {
        openError("이미 블랙리스트에 추가된 사용자입니다.");
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
      await Promise.all(selectedUsers.map(userId => removeFromBlacklist(userId)));
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
      setSelectedUsers(blacklist.map(user => user.id));
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
    <div className="bg-gray-900 min-h-screen">
      {/* 탭 메뉴 */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab("temporary")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "temporary"
              ? "text-white border-b-2 border-blue-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          1일 정지
        </button>
        <button
          onClick={() => setActiveTab("permanent")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "permanent"
              ? "text-white border-b-2 border-blue-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          영구 정지
        </button>
      </div>

      <div className="p-6">
        {/* 검색 섹션 */}
        <div className="flex gap-4 mb-6">
          <button
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
          >
            추가
          </button>
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddUser()}
              placeholder="아이디 · 닉네임"
              className="flex-1 bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
              disabled={isLoading}
            />
            <button
              onClick={handleAddUser}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              검색
            </button>
          </div>
        </div>

        {/* 총 개시물 표시 */}
        <div className="mb-4 text-gray-400">
          총 개시물: <span className="text-white">{blacklist.length}건</span>
        </div>

        {/* 테이블 */}
        <div className="bg-gray-800 rounded overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="w-12 p-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === blacklist.length && blacklist.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4"
                  />
                </th>
                <th className="text-left p-4 text-gray-400 font-medium">번호</th>
                <th className="text-left p-4 text-gray-400 font-medium">제재회원</th>
                <th className="text-left p-4 text-gray-400 font-medium">제재일</th>
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
                      <p className="text-gray-400">강퇴내역이 없습니다.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                blacklist.map((user, index) => (
                  <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{user.nickname || user.id}</p>
                        {user.nickname && (
                          <p className="text-sm text-gray-400">ID: {user.id}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-gray-400">{formatDate(user.createdAt)}</td>
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
              className="px-8 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              해제
            </button>
          </div>
        )}
      </div>
    </div>
  );
};