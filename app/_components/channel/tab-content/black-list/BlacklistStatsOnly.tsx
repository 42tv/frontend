"use client";

import React from "react";

interface BlacklistStatsOnlyProps {
  totalCount: number;
}

export const BlacklistStatsOnly: React.FC<BlacklistStatsOnlyProps> = ({
  totalCount,
}) => {
  return (
    <div className="bg-gray-800 dark:bg-gray-800 p-4 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">전체 차단 회원</p>
          <p className="text-2xl font-semibold text-white">{totalCount}명</p>
        </div>
        <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636" />
          </svg>
        </div>
      </div>
    </div>
  );
};
