'use client'
import { useState } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  className = '' 
}: PaginationProps) {
  const [inputPage, setInputPage] = useState<string>('');
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    // 숫자만 허용 (빈 문자열도 허용)
    if (value === '' || /^\d+$/.test(value)) {
      setInputPage(value);
    }
  };

  const handleInputSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const page = parseInt(inputPage);
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
      setInputPage('');
    }
  };

  const getVisiblePages = (): number[] => {
    const maxVisible = 10; // 최대 표시할 페이지 수
    const pages: number[] = [];
    
    if (totalPages <= maxVisible) {
      // 전체 페이지가 10개 이하면 모든 페이지 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 현재 페이지를 기준으로 앞뒤로 페이지 표시
      const start = Math.max(1, Math.min(currentPage - 5, totalPages - maxVisible + 1));
      const end = Math.min(totalPages, start + maxVisible - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex items-center justify-center gap-1 mt-8 border border-border-primary ${className}`}>
      <div className="flex items-center rounded-lg p-1">
        {/* 페이지 번호들 */}
        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`min-w-[32px] h-8 px-2 text-sm font-medium transition-colors rounded-md ${
              currentPage === page
                ? 'text-text-primary bg-bg-tertiary'
                : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
            }`}
          >
            {page}
          </button>
        ))}
        
        {/* 다음 버튼 */}
        {currentPage < totalPages && (
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="min-w-[32px] h-8 px-2 rounded-md transition-colors text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* 페이지 직접 이동 */}
      <form onSubmit={handleInputSubmit} className="flex items-center gap-2 ml-6">
        <input
          type="text"
          value={inputPage}
          onChange={handleInputChange}
          placeholder={currentPage.toString()}
          className="w-14 h-8 px-2 text-center text-sm rounded focus:outline-none focus:ring-2 focus:ring-accent transition-colors bg-bg-secondary border border-border-primary text-text-primary"
        />
        <button
          type="submit"
          className="h-8 px-3 rounded text-sm font-medium transition-colors bg-bg-tertiary hover:bg-bg-secondary text-text-primary"
        >
          이동
        </button>
      </form>
    </div>
  );
}