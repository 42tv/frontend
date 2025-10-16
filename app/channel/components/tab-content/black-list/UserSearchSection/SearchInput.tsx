import React from 'react';

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
  return (
    <div className="flex gap-3">
      <input
        ref={inputRef}
        type="text"
        value={searchNickname}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        onFocus={onInputFocus}
        placeholder="차단할 사용자 닉네임을 입력하세요"
        className="flex-1 px-4 py-2 rounded bg-background text-text-primary border border-border-primary focus:border-accent focus:outline-none disabled:opacity-60"
        disabled={searching}
      />
      <button
        onClick={onSearch}
        disabled={searching || !searchNickname.trim()}
        className="px-6 py-2 rounded bg-accent text-white hover:bg-accent-light transition-colors disabled:bg-bg-secondary disabled:text-text-secondary disabled:cursor-not-allowed disabled:opacity-60"
      >
        {searching ? "검색 중..." : "검색"}
      </button>
      {(userInfo || notFound) && (
        <button
          onClick={onClearSearch}
          className="px-4 py-2 rounded bg-bg-secondary text-text-primary hover:bg-bg-tertiary transition-colors"
        >
          초기화
        </button>
      )}
    </div>
  );
};

export default SearchInput;