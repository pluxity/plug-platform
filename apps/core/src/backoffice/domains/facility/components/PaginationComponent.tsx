import { useState, useEffect } from "react";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
  PaginationPrevious, PaginationNext, PaginationEllipsis
} from "@plug/ui";
import { useSearchParams } from "react-router-dom";

interface PaginationComponentProps {
  totalItems: number;
  pageSize: number;
  defaultPage?: number;
  queryParamName?: string;
  onPageChange?: (page: number) => void;
}

export function PaginationComponent({ totalItems, pageSize = 8, defaultPage = 1, queryParamName = 'page', onPageChange }: PaginationComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(() => {
    return parseInt(searchParams.get(queryParamName) || String(defaultPage), 10);
  });
  
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  
  useEffect(() => {
    const pageParam = searchParams.get(queryParamName);
    const pageNumber = pageParam ? parseInt(pageParam, 10) : defaultPage;

    if (pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
    }
  }, [searchParams, queryParamName, defaultPage]);
  
  const handlePageChange = (page: number) => {
    if (page === currentPage) return;
    
    const newPage = Math.max(1, Math.min(page, totalPages));
    
    setCurrentPage(newPage);
    
    const newParams = new URLSearchParams(searchParams);
    newParams.set(queryParamName, String(newPage));
    setSearchParams(newParams, { replace: true });
    
    if (onPageChange) {
      onPageChange(newPage);
    }
  };
  
  const renderPaginationLinks = () => {
    if (totalPages <= 1) return null;
    
    const pageNumbers = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 5; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push("ellipsis");
      pageNumbers.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pageNumbers.push(1);
      pageNumbers.push("ellipsis");
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      pageNumbers.push("ellipsis");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push("ellipsis");
      pageNumbers.push(totalPages);
    }

    return pageNumbers.map((page, index) => {
      if (page === "ellipsis") {
        return (
          <PaginationItem key={`ellipsis-${index}`}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      return (
        <PaginationItem key={page}>
          <PaginationLink
            isActive={currentPage === page}
            onClick={(e) => {e.preventDefault();e.stopPropagation();handlePageChange(page as number);}}>
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    });
  };
  
  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={(e) => {e.preventDefault();handlePageChange(currentPage - 1);}}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        {renderPaginationLinks()}
        <PaginationItem>
          <PaginationNext
            onClick={(e) => {e.preventDefault();handlePageChange(currentPage + 1);}}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}