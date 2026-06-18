"use client";

import React, { useState, useEffect, useMemo } from "react";
import { BlacklistTable } from "./BlacklistTable";
import { BlacklistSearchForm } from "./BlacklistSearchForm";
import { UserSearchSection } from "./UserSearchSection";
import { addToBlacklist, removeMultipleFromBlacklist, getBlacklist } from "../../../../_apis/user";
import { openModal } from "@/app/_components/utils/overlay/overlayHelpers";
import ErrorMessage from "@/app/_components/modals/error_component";
import { getApiErrorMessage } from "@/app/_lib/api";

export interface BlacklistUser {
  user_idx: number;
  user_id: string;
  nickname: string;
  profile_img: string;
  blocked_at: string;
}

export const BlacklistManager = () => {
  const [blacklist, setBlacklist] = useState<BlacklistUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 블랙리스트 목록 불러오기
  const fetchBlacklist = async () => {
    setIsLoading(true);
    try {
      const response = await getBlacklist();
      const users = response.lists || [];
      setBlacklist(users);
    } catch (error: unknown) {
      console.log(error);
      openModal(<ErrorMessage message={getApiErrorMessage(error) || "블랙리스트를 불러오는데 실패했습니다."} />, { closeButtonSize: "w-[16px] h-[16px]" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlacklist();
  }, []);

  const filteredBlacklist = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    if (!normalizedSearchTerm) {
      return blacklist;
    }

    return blacklist.filter((user) =>
      (user.nickname || "").toLowerCase().includes(normalizedSearchTerm),
    );
  }, [blacklist, searchTerm]);

  // 블랙리스트에 사용자 추가 (닉네임 또는 사용자 ID로)
  const handleAddUser = async (nickname: string) => {
    if (!nickname.trim()) {
      openModal(<ErrorMessage message="사용자 닉네임을 입력해주세요." />, { closeButtonSize: "w-[16px] h-[16px]" });
      return;
    }

    setIsLoading(true);
    try {
      // UserSearchSection에서는 사용자 검색 후 user_id를 전달받으므로 그대로 사용
      await addToBlacklist(nickname);
      await fetchBlacklist();
      openModal(<ErrorMessage message="사용자가 블랙리스트에 추가되었습니다." />, { closeButtonSize: "w-[16px] h-[16px]" });
    } catch (error: unknown) {
      openModal(<ErrorMessage message={getApiErrorMessage(error) || "블랙리스트 추가에 실패했습니다."} />, { closeButtonSize: "w-[16px] h-[16px]" });
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
      openModal(<ErrorMessage message="사용자가 블랙리스트에서 제거되었습니다." />, { closeButtonSize: "w-[16px] h-[16px]" });
    } catch (error: unknown) {
      openModal(<ErrorMessage message={getApiErrorMessage(error) || "블랙리스트 제거에 실패했습니다."} />, { closeButtonSize: "w-[16px] h-[16px]" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnblockUsers = async (userIds: string[]) => {
    if (userIds.length === 0) return;

    setIsLoading(true);
    try {
      await removeMultipleFromBlacklist(userIds);
      await fetchBlacklist();
      openModal(<ErrorMessage message={`${userIds.length}명의 차단을 해제했습니다.`} />, { closeButtonSize: "w-[16px] h-[16px]" });
    } catch (error: unknown) {
      openModal(<ErrorMessage message={getApiErrorMessage(error) || "블랙리스트 제거에 실패했습니다."} />, { closeButtonSize: "w-[16px] h-[16px]" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6">
      <div className="space-y-6">
        <div className="border-b border-border-primary pb-5">
          <h2 className="text-2xl font-semibold text-text-primary">블랙리스트 관리</h2>
          <p className="mt-2 text-sm text-text-secondary">차단된 사용자를 테이블에서 검색하고 해제할 수 있습니다.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <UserSearchSection
            onBlockUser={handleAddUser}
            isLoading={isLoading}
          />

          <div className="rounded-lg border border-border-primary bg-background p-5">
            <p className="text-sm text-text-secondary">전체 차단 회원</p>
            <p className="mt-3 text-3xl font-semibold text-text-primary">{blacklist.length}명</p>
          </div>
        </div>

        <section className="rounded-lg border border-border-primary bg-background">
          <div className="flex flex-col gap-4 border-b border-border-primary p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-text-primary">차단 목록</h3>
              <p className="mt-1 text-sm text-text-secondary">
                입력하면 목록이 바로 필터링됩니다.
              </p>
            </div>
            <BlacklistSearchForm
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>

          <BlacklistTable
            users={filteredBlacklist}
            totalCount={blacklist.length}
            searchTerm={searchTerm}
            onUnblockUser={handleUnblockUser}
            onUnblockUsers={handleUnblockUsers}
            isLoading={isLoading}
          />
        </section>
      </div>
    </div>
  );
};
