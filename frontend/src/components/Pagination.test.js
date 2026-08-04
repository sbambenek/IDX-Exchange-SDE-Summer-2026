import { render, screen, fireEvent } from '@testing-library/react';
import Pagination, { getPageNumbers } from './Pagination';

describe('getPageNumbers', () => {
  test('returns all pages when total pages fit without ellipsis', () => {
    expect(getPageNumbers(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  test('shows ellipsis only near the end when current page is near the start', () => {
    expect(getPageNumbers(1, 24)).toEqual([1, 2, '...', 24]);
  });

  test('shows ellipsis only near the start when current page is near the end', () => {
    expect(getPageNumbers(24, 24)).toEqual([1, '...', 23, 24]);
  });

  test('shows ellipsis on both sides when current page is in the middle', () => {
    expect(getPageNumbers(12, 24)).toEqual([1, '...', 11, 12, 13, '...', 24]);
  });

  test('does not duplicate the last page number near the end of a large page count', () => {
    // Reproduces the debug challenge bug: "1 ... 2 3 4 ... 1"
    const result = getPageNumbers(23, 24);
    const lastPageOccurrences = result.filter((p) => p === 24).length;
    expect(lastPageOccurrences).toBe(1);
    expect(result).toEqual([1, '...', 22, 23, 24]);
  });

  test('does not duplicate the first page number near the start of a large page count', () => {
    const result = getPageNumbers(2, 24);
    const firstPageOccurrences = result.filter((p) => p === 1).length;
    expect(firstPageOccurrences).toBe(1);
  });
});

describe('Pagination component', () => {
  test('renders nothing when there is only one page', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  test('disables Previous on page 1', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByText('Previous')).toBeDisabled();
  });

  test('disables Next on the last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByText('Next')).toBeDisabled();
  });

  test('calls onPageChange with the correct page when a page number is clicked', () => {
    const handlePageChange = jest.fn();
    render(<Pagination currentPage={1} totalPages={5} onPageChange={handlePageChange} />);

    fireEvent.click(screen.getByText('3'));

    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  test('calls onPageChange with currentPage + 1 when Next is clicked', () => {
    const handlePageChange = jest.fn();
    render(<Pagination currentPage={2} totalPages={5} onPageChange={handlePageChange} />);

    fireEvent.click(screen.getByText('Next'));

    expect(handlePageChange).toHaveBeenCalledWith(3);
  });
});