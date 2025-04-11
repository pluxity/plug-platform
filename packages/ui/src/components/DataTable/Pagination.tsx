import { PaginationProps } from './DataTable.types'
import { cn } from '../../utils/classname'
import { Button } from '../Button'
import { PrevIcon, NextIcon } from '../../index.icons'
import { useState } from 'react';

const Pagination = ({ 
    currentPage: initialPage = 1, 
    totalPages = 0, 
    pageCount = 10,
    onPageChange
 }: PaginationProps) => {
    const [currentPage, setCurrentPage] = useState(initialPage);

    const selectedPageClassName = 'bg-blue-500 text-white font-semibold'
    const unSelectedPageClassName = 'text-black bg-white hover:bg-blue-200 hover:text-white'

    const handlePageChange = (page: number) => {
        setCurrentPage(page); // Update state immediately
        onPageChange(page);  // Trigger external callback
    };

    const renderPageNumbers = () => {
        const pages = [];
        const startPage = Math.floor((currentPage - 1) / pageCount) * pageCount + 1; // Start of the current range
        const endPage = Math.min(totalPages, startPage + pageCount - 1); // End of the current range

        if (startPage > 1) {
            pages.push(
                <Button
                    key="start-ellipsis"
                    className={cn(
                        'px-3 py-1 rounded-md',
                        unSelectedPageClassName,
                    )}
                    onClick={() => handlePageChange(currentPage - 1)} // Use updated handler
                    disabled={currentPage === 1}
                >
                    <PrevIcon />
                </Button>
            );
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <Button
                    key={i}
                    color="primary"
                    className={
                        cn(
                            'px-3 py-1 rounded-md',
                            i === currentPage ? selectedPageClassName : unSelectedPageClassName,
                        )
                    }
                    onClick={() => handlePageChange(i)} // Use updated handler
                >
                    {i}
                </Button>
            );
        }

        if (endPage < totalPages) {
            pages.push(
                <Button
                    key="end-ellipsis"
                    className={cn(
                        'px-3 py-1 rounded-md',
                        unSelectedPageClassName,
                    )}
                    onClick={() => handlePageChange(currentPage + 1)} // Use updated handler
                    disabled={currentPage === totalPages}
                >
                    <NextIcon />
                </Button>
            );
        }

        return pages;
    }

    return (
        <div className="flex justify-center mt-6 space-x-2">
            <Button
                color="primary"
                className={
                    cn(
                        "px-4 py-2 rounded-l-md",
                        unSelectedPageClassName
                    )
                }
                onClick={() => handlePageChange(Math.max(1, currentPage - pageCount))}
                disabled={currentPage === 1}
            >
                Prev
            </Button>
            {renderPageNumbers()}
            <Button
                color="primary"
                className={
                    cn(
                        "px-4 py-2 rounded-l-md",
                        unSelectedPageClassName
                    )
                }
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + pageCount))}
                disabled={currentPage === totalPages}
            >
                Next
            </Button>
        </div>
    )
}

export default Pagination