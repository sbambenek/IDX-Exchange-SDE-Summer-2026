import React from 'react';
import './Pagination.css';

export function getPageNumbers(currentPage, totalPages) {
  // If there aren't many pages at all, just show every page number
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  let pageSet;

  if (currentPage <= 4) {
    // Pages 1-4: show 1,2,3,4 (or 1-5 once you're on page 4), then last page
    const rightBound = Math.max(4, currentPage + 1);
    pageSet = new Set([
      1,
      ...Array.from({ length: rightBound }, (_, i) => i + 1),
      totalPages
    ]);
  } else {
    // Page 5 onward: sliding window around the current page
    pageSet = new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages]);
  }

  const sortedPages = Array.from(pageSet)
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  const result = [];
  for (let i = 0; i < sortedPages.length; i++) {
    if (i > 0 && sortedPages[i] - sortedPages[i - 1] > 1) {
      result.push('...');
    }
    result.push(sortedPages[i]);
  }

  return result;
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {pageNumbers.map((page, index) =>
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="pagination-ellipsis">
            ...
          </span>
        ) : (
          <button
            key={page}
            className={page === currentPage ? 'pagination-active' : ''}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </nav>
  );
}

export default Pagination;