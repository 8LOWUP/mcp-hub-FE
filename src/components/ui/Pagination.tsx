"use client";

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onFirst: () => void;
  onLast: () => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  onNext,
  onPrev,
  onFirst,
  onLast,
  hasNextPage,
  hasPrevPage,
  className = "",
}) => {
  // 페이지 번호 배열 생성 (현재 페이지 주변 2개씩)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // 전체 페이지가 5개 이하면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 현재 페이지 주변으로 페이지 번호 생성
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);
      
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* 첫 페이지로 */}
      <button
        onClick={onFirst}
        disabled={!hasPrevPage}
        className="p-2 rounded-md border border-contrast bg-surface-1 hover:bg-surface-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="첫 페이지로"
      >
        <ChevronsLeft size={16} />
      </button>

      {/* 이전 페이지 */}
      <button
        onClick={onPrev}
        disabled={!hasPrevPage}
        className="p-2 rounded-md border border-contrast bg-surface-1 hover:bg-surface-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="이전 페이지"
      >
        <ChevronLeft size={16} />
      </button>

      {/* 페이지 번호들 */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => (
          <React.Fragment key={index}>
            {typeof page === 'number' ? (
              <button
                onClick={() => onPageChange(page)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  page === currentPage
                    ? 'bg-accent text-white'
                    : 'bg-surface-1 border border-contrast hover:bg-surface-2'
                }`}
                aria-label={`페이지 ${page}로 이동`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            ) : (
              <span className="px-2 py-2 text-secondary">...</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* 다음 페이지 */}
      <button
        onClick={onNext}
        disabled={!hasNextPage}
        className="p-2 rounded-md border border-contrast bg-surface-1 hover:bg-surface-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="다음 페이지"
      >
        <ChevronRight size={16} />
      </button>

      {/* 마지막 페이지로 */}
      <button
        onClick={onLast}
        disabled={!hasNextPage}
        className="p-2 rounded-md border border-contrast bg-surface-1 hover:bg-surface-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="마지막 페이지로"
      >
        <ChevronsRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
