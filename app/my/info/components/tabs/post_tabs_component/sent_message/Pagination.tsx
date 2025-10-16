import React from 'react';

interface PaginationProps {
    currentPage: number;
    currentSet: number;
    lastSet: number;
    startPage: number;
    endPage: number;
    onPageChange: (page: number) => void;
    onSetChange: (set: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    currentSet,
    lastSet,
    startPage,
    endPage,
    onPageChange,
    onSetChange
}) => {
    return (
        <div className="flex justify-center mt-6">
            {/* Previous set button */}
            {currentSet > 1 && (
                <button
                    onClick={() => onSetChange(currentSet - 1)}
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
                    onClick={() => onSetChange(currentSet + 1)}
                    className="mx-3 py-1 rounded"
                >
                    next
                </button>
            )}
        </div>
    );
};

export default Pagination;