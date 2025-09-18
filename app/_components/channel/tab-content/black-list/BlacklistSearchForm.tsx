"use client";

import React from "react";

interface BlacklistSearchFormProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const BlacklistSearchForm: React.FC<BlacklistSearchFormProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="p-3 rounded-lg transition-colors bg-bg-tertiary border border-border-primary hover:border-bg-secondary">
      <h3 className="text-sm font-medium mb-2 text-text-primary">차단 목록 검색</h3>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="아이디를 입력하세요"
            className="w-full pl-8 pr-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-accent text-sm bg-background text-text-primary border border-border-primary"
          />
          <svg
            className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
