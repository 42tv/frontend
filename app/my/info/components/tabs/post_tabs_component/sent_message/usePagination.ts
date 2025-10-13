import { useState } from 'react';

interface UsePaginationProps {
    totalItems: number;
    itemsPerPage?: number;
    pageSetSize?: number;
}

export const usePagination = ({ 
    totalItems, 
    itemsPerPage = 10, 
    pageSetSize = 5 
}: UsePaginationProps) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate total pages
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Calculate current page set
    const currentSet = Math.ceil(currentPage / pageSetSize);
    const lastSet = Math.ceil(totalPages / pageSetSize);
    
    // Calculate start and end page numbers for current set
    const startPage = (currentSet - 1) * pageSetSize + 1;
    const endPage = Math.min(currentSet * pageSetSize, totalPages);

    // Calculate indices for current page items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Page navigation functions
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    
    // Navigate to next or previous set of pages
    const navigateToSet = (setNumber: number) => {
        const targetPage = (setNumber - 1) * pageSetSize + 1;
        setCurrentPage(targetPage);
    };

    // Reset to first page (useful when search changes)
    const resetToFirstPage = () => setCurrentPage(1);

    return {
        currentPage,
        totalPages,
        currentSet,
        lastSet,
        startPage,
        endPage,
        indexOfFirstItem,
        indexOfLastItem,
        paginate,
        navigateToSet,
        resetToFirstPage
    };
};