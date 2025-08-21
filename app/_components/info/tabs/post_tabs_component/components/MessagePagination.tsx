interface MessagePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSetSize: number;
  onPageChange: (page: number) => void;
  onSetNavigate: (set: number) => void;
}

export default function MessagePagination({ 
  currentPage, 
  totalPages, 
  pageSetSize, 
  onPageChange, 
  onSetNavigate 
}: MessagePaginationProps) {
  // Calculate current page set
  const currentSet = Math.ceil(currentPage / pageSetSize);
  const lastSet = Math.ceil(totalPages / pageSetSize);
  
  // Calculate start and end page numbers for current set
  const startPage = (currentSet - 1) * pageSetSize + 1;
  const endPage = Math.min(currentSet * pageSetSize, totalPages);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-4">
      <nav className="flex items-center space-x-2">
        {/* Previous set button */}
        {currentSet > 1 && (
          <button
            onClick={() => onSetNavigate(currentSet - 1)}
            className="px-3 py-1 rounded border border-border-primary dark:border-border-primary-dark hover:bg-bg-hover dark:hover:bg-bg-hover-dark"
          >
            이전
          </button>
        )}
        
        {/* Page numbers */}
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded border ${
              currentPage === page
                ? 'bg-primary text-white border-primary'
                : 'border-border-primary dark:border-border-primary-dark hover:bg-bg-hover dark:hover:bg-bg-hover-dark'
            }`}
          >
            {page}
          </button>
        ))}
        
        {/* Next set button */}
        {currentSet < lastSet && (
          <button
            onClick={() => onSetNavigate(currentSet + 1)}
            className="px-3 py-1 rounded border border-border-primary dark:border-border-primary-dark hover:bg-bg-hover dark:hover:bg-bg-hover-dark"
          >
            다음
          </button>
        )}
      </nav>
    </div>
  );
}