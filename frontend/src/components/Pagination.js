import React from 'react';
import './Pagination.css';

const SIBLING_COUNT = 1; 
const BOUNDARY_COUNT = 1;

export function getPageNumbers(currentPage, totalPages) {
  // Case 1: everything fits without ellipsis
  const totalVisibleWithoutEllipsis = BOUNDARY_COUNT * 2 + SIBLING_COUNT * 2 + 3;
  if (totalPages <= totalVisibleWithoutEllipsis) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = [];

  const leftSiblingStart = Math.max(currentPage - SIBLING_COUNT, BOUNDARY_COUNT + 2);
  const rightSiblingEnd = Math.min(currentPage + SIBLING_COUNT, totalPages - BOUNDARY_COUNT - 1);

  // Always show first page(s)
  pages.push(1);

  // Left ellipsis or page 2
  if (leftSiblingStart > BOUNDARY_COUNT + 2) {
    pages.push('...');
  } else if (leftSiblingStart === BOUNDARY_COUNT + 2) {
    pages.push(2);
  }

  // Middle range
  for (let i = leftSiblingStart; i <= rightSiblingEnd; i++) {
    pages.push(i);
  }

  // Right ellipsis or second-to-last page
  if (rightSiblingEnd < totalPages - BOUNDARY_COUNT - 1) {
    pages.push('...');
  } else if (rightSiblingEnd === totalPages - BOUNDARY_COUNT - 1) {
    pages.push(totalPages - 1);
  }

  // Always show last page
  pages.push(totalPages);

  return pages;
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