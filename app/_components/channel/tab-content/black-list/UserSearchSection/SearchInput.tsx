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
        className="flex-1 px-4 py-2 rounded focus:outline-none"
        style={{
          backgroundColor: 'var(--bg-100)',
          color: 'var(--text-100)',
          border: '1px solid var(--bg-300)',
          opacity: searching ? 0.6 : 1
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--primary-100)'}
        onBlur={(e) => e.target.style.borderColor = 'var(--bg-300)'}
        disabled={searching}
      />
      <button
        onClick={onSearch}
        disabled={searching || !searchNickname.trim()}
        className="px-6 py-2 rounded transition-colors"
        style={{
          backgroundColor: (searching || !searchNickname.trim()) ? 'var(--bg-200)' : 'var(--primary-100)',
          color: 'var(--text-100)',
          cursor: (searching || !searchNickname.trim()) ? 'not-allowed' : 'pointer',
          opacity: (searching || !searchNickname.trim()) ? 0.6 : 1
        }}
        onMouseEnter={(e) => {
          if (!searching && searchNickname.trim()) {
            e.currentTarget.style.backgroundColor = 'var(--accent-100)';
          }
        }}
        onMouseLeave={(e) => {
          if (!searching && searchNickname.trim()) {
            e.currentTarget.style.backgroundColor = 'var(--primary-100)';
          }
        }}
      >
        {searching ? "검색 중..." : "검색"}
      </button>
      {(userInfo || notFound) && (
        <button
          onClick={onClearSearch}
          className="px-4 py-2 rounded transition-colors"
          style={{ backgroundColor: 'var(--bg-200)', color: 'var(--text-100)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-100)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-200)'}
        >
          초기화
        </button>
      )}
    </div>
  );
};

export default SearchInput;