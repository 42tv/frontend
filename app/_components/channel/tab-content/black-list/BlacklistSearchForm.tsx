"use client";

import React from "react";

interface BlacklistSearchFormProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onClearSearch: () => void;
}

export const BlacklistSearchForm: React.FC<BlacklistSearchFormProps> = ({
  searchTerm,
  onSearchChange,
  onClearSearch,
}) => {
  return (
    <div className="bg-gray-800 dark:bg-gray-800 p-3 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors">
      <h3 className="text-sm font-medium text-white mb-2">차단 목록 검색</h3>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="차단된 사용자 검색"
            className="w-full bg-gray-700 text-white pl-8 pr-8 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500 placeholder-gray-400 text-sm"
          />
          <svg 
            className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchTerm && (
            <button
              onClick={onClearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
