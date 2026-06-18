"use client";

import React from "react";
import { FiFilter, FiX } from "react-icons/fi";

interface BlacklistSearchFormProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const BlacklistSearchForm: React.FC<BlacklistSearchFormProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="relative w-full sm:w-80">
      <span className="sr-only">닉네임 필터</span>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="닉네임으로 필터링"
        className="h-11 w-full rounded-lg border border-border-primary bg-bg-secondary pl-10 pr-9 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary focus:border-accent"
      />
      <FiFilter
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
        aria-hidden="true"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={() => onSearchChange("")}
          aria-label="필터 초기화"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-text-secondary/60 transition-colors hover:text-text-secondary"
        >
          <FiX className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};
