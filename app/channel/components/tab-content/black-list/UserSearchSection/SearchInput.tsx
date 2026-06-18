import React from 'react';
import { FiX } from 'react-icons/fi';

interface SearchInputProps {
  searchNickname: string;
  searching: boolean;
  userInfo: { user_id: string; nickname: string; profile_img: string } | null;
  notFound: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onClearSearch: () => void;
  onInputFocus: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchNickname,
  searching,
  userInfo,
  notFound,
  inputRef,
  onSearchChange,
  onSearch,
  onClearSearch,
  onInputFocus
}) => {
  const showClear = !!(searchNickname || userInfo || notFound);

  return (
    <div className="flex gap-3">
      <div className="relative flex-1">
        <input
          ref={inputRef}
          type="text"
          value={searchNickname}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          onFocus={onInputFocus}
          placeholder="차단할 사용자 닉네임을 입력하세요"
          className="w-full rounded border border-border-primary bg-background px-4 py-2 pr-9 text-text-primary outline-none transition-colors focus:border-accent disabled:opacity-60"
          disabled={searching}
        />
        {showClear && (
          <button
            type="button"
            onClick={onClearSearch}
            aria-label="입력 초기화"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-text-secondary/60 transition-colors hover:text-text-secondary"
          >
            <FiX className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
      <button
        onClick={onSearch}
        disabled={searching || !searchNickname.trim()}
        className="rounded bg-accent px-6 py-2 text-white transition-colors hover:bg-accent-light disabled:cursor-not-allowed disabled:bg-bg-secondary disabled:text-text-secondary disabled:opacity-60"
      >
        {searching ? "검색 중..." : "검색"}
      </button>
    </div>
  );
};

export default SearchInput;