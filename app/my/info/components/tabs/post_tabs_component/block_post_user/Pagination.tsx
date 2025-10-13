import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    postsPerPage: number;
    totalUsers: number;
    pageSetSize: number;
    onPageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    postsPerPage,
    totalUsers,
    pageSetSize,
    onPageChange
}) => {
    // Calculate current page set
    const currentSet = Math.ceil(currentPage / pageSetSize);
    const lastSet = Math.ceil(totalPages / pageSetSize);
    
    // Calculate start and end page numbers for current set
    const startPage = (currentSet - 1) * pageSetSize + 1;
    const endPage = Math.min(currentSet * pageSetSize, totalPages);

    // Navigate to next or previous set of pages
    const navigateToSet = (setNumber: number) => {
        const targetPage = (setNumber - 1) * pageSetSize + 1;
        onPageChange(targetPage);
    };

    if (totalUsers <= postsPerPage) {
        return null;
    }

    return (
        <div className="flex justify-center mt-6">
            {/* Previous set button */}
            {currentSet > 1 && (
                <button
                    onClick={() => navigateToSet(currentSet - 1)}
                    className="mx-3 py-1 rounded"
                >
                    prev
                </button>
            )}
            
            {/* Page numbers */}
            {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(number => (
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={`px-3 py-1 mx-1 rounded relative
                    ${currentPage === number ? 'font-semibold' : ''}
                    after:content-[''] after:absolute after:h-[2px] after:bg-primary after:left-1/4 after:right-1/4
                    after:bottom-0 after:scale-x-0 ${currentPage === number ? 'after:scale-x-100' : 'hover:after:scale-x-100'}`}
                >
                    {number}
                </button>
            ))}
            
            {/* Next set button */}
            {currentSet < lastSet && (
                <button
                    onClick={() => navigateToSet(currentSet + 1)}
                    className="mx-3 py-1 rounded"
                >
                    next
                </button>
            )}
        </div>
    );
};

export default Pagination;