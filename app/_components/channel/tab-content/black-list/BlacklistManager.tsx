"use client";

import React, { useState, useEffect } from "react";
import { BlacklistTable } from "./BlacklistTable";
import { BlacklistSearchForm } from "./BlacklistSearchForm";
import { BlacklistStatsOnly } from "./BlacklistStatsOnly";
import { UserSearchSection } from "./UserSearchSection";
import { addToBlacklist, removeMultipleFromBlacklist, getBlacklist } from "../../../../_apis/user";
import errorModalStore from "../../../utils/store/errorModalStore";
import ErrorMessage from "@/app/_components/modals/error_component";

export interface BlacklistUser {
  user_idx: number;
  user_id: string;
  nickname: string;
  profile_img: string;
  blocked_at: string;
}

export const BlacklistManager = () => {
  const [blacklist, setBlacklist] = useState<BlacklistUser[]>([]);
  const [filteredBlacklist, setFilteredBlacklist] = useState<BlacklistUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { openError } = errorModalStore();

  // 블랙리스트 목록 불러오기
  const fetchBlacklist = async () => {
    setIsLoading(true);
    try {
      const response = await getBlacklist();
      const users = response.lists || [];
      setBlacklist(users);
      setFilteredBlacklist(users);
    } catch (error: any) {
      console.log(error);
      openError(<ErrorMessage message={error?.response?.data?.message || "블랙리스트를 불러오는데 실패했습니다."} />);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlacklist();
  }, []);

  // 검색 필터링
  useEffect(() => {
    const filtered = blacklist.filter(user => 
      user.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBlacklist(filtered);
  }, [blacklist, searchTerm]);

  // 블랙리스트에 사용자 추가 (닉네임 또는 사용자 ID로)
  const handleAddUser = async (nickname: string) => {
    if (!nickname.trim()) {
      openError(<ErrorMessage message="사용자 닉네임을 입력해주세요." />);
      return;
    }

    setIsLoading(true);
    try {
      // UserSearchSection에서는 사용자 검색 후 user_id를 전달받으므로 그대로 사용
      await addToBlacklist(nickname);
      await fetchBlacklist();
      openError(<ErrorMessage message="사용자가 블랙리스트에 추가되었습니다." />);
    } catch (error: any) {
      openError(<ErrorMessage message={error?.response?.data?.message || "블랙리스트 추가에 실패했습니다."} />);
    } finally {
      setIsLoading(false);
    }
  };

  // 개별 사용자 차단 해제
  const handleUnblockUser = async (userId: string) => {
    setIsLoading(true);
    try {
      await removeMultipleFromBlacklist([userId]);
      await fetchBlacklist();
      openError(<ErrorMessage message="사용자가 블랙리스트에서 제거되었습니다." />);
    } catch (error: any) {
      openError(<ErrorMessage message={error?.response?.data?.message || "블랙리스트 제거에 실패했습니다."} />);
    } finally {
      setIsLoading(false);
    }
  };

  // 검색어 초기화
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="bg-gray-900 dark:bg-gray-900 p-6 rounded-lg border border-gray-700">
      <div className="space-y-6">
        {/* 제목 */}
        <div className="border-b border-gray-600 pb-4">
          <h2 className="text-xl font-semibold text-white">블랙리스트 관리</h2>
          <p className="text-gray-400 text-sm mt-1">차단된 사용자를 관리할 수 있습니다.</p>
        </div>
        
        {/* 전체 차단 회원 통계 */}
        <p className="text-gray-400">차단 수: {blacklist.length}</p>

        {/* 사용자 검색 및 차단 */}
        <UserSearchSection
          onBlockUser={handleAddUser}
          isLoading={isLoading}
        />

        {/* 차단 목록 검색 */}
        <BlacklistSearchForm
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClearSearch={handleClearSearch}
        />

        {/* 테이블 */}
        <BlacklistTable
          users={filteredBlacklist}
          onUnblockUser={handleUnblockUser}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
