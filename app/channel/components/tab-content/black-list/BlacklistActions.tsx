"use client";

import React from "react";

interface BlacklistActionsProps {
  selectedCount: number;
  onRemoveSelected: () => Promise<void>;
  sortBy: "nickname" | "blocked_at";
  sortOrder: "asc" | "desc";
  onSortChange: (field: "nickname" | "blocked_at", order: "asc" | "desc") => void;
  isLoading: boolean;
}

export const BlacklistActions: React.FC<BlacklistActionsProps> = ({
  selectedCount,
  onRemoveSelected,
  sortBy,
  sortOrder,
  onSortChange,
  isLoading,
}) => {
  const handleSortClick = (field: "nickname" | "blocked_at") => {
    if (sortBy === field) {
      // 같은 필드를 클릭하면 정렬 순서 변경
      onSortChange(field, sortOrder === "asc" ? "desc" : "asc");
    } else {
      // 다른 필드를 클릭하면 해당 필드로 내림차순 정렬
      onSortChange(field, "desc");
    }
  };

  const getSortIcon = (field: "nickname" | "blocked_at") => {
    if (sortBy !== field) {
      return (
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    return sortOrder === "asc" ? (
      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-bg-secondary dark:bg-bg-secondary-dark p-4 rounded-lg border border-gray-700">
      {/* 선택된 항목 액션 */}
      <div className="flex items-center gap-3">
        {selectedCount > 0 && (
          <>
            <span className="text-sm text-gray-400">
              {selectedCount}명 선택됨
            </span>
            <button
              onClick={onRemoveSelected}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors text-sm"
            >
              {isLoading ? "해제 중..." : "선택 해제"}
            </button>
          </>
        )}
        {selectedCount === 0 && (
          <span className="text-sm text-gray-500">
            해제할 사용자를 선택하세요
          </span>
        )}
      </div>

      {/* 정렬 옵션 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">정렬:</span>
        <button
          onClick={() => handleSortClick("nickname")}
          className={`flex items-center gap-1 px-3 py-1 rounded text-sm transition-colors ${
            sortBy === "nickname"
              ? "bg-blue-600 text-white"
              : "bg-bg-tertiary dark:bg-bg-tertiary-dark text-gray-400 hover:text-white"
          }`}
        >
          닉네임
          {getSortIcon("nickname")}
        </button>
        <button
          onClick={() => handleSortClick("blocked_at")}
          className={`flex items-center gap-1 px-3 py-1 rounded text-sm transition-colors ${
            sortBy === "blocked_at"
              ? "bg-blue-600 text-white"
              : "bg-bg-tertiary dark:bg-bg-tertiary-dark text-gray-400 hover:text-white"
          }`}
        >
          차단일
          {getSortIcon("blocked_at")}
        </button>
      </div>
    </div>
  );
};
