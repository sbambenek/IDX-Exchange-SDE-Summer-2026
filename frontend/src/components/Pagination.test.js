import { render, screen, fireEvent } from '@testing-library/react';
import Pagination, { getPageNumbers } from './Pagination';

describe('getPageNumbers', () => {
  test('returns all pages when total pages fit without ellipsis', () => {
    expect(getPageNumbers(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  test('page 1 shows 1,2,3,4 then ellipsis then last page', () => {
    expect(getPageNumbers(1, 2657)).toEqual([1, 2, 3, 4, '...', 2657]);
  });

  test('page 2 shows 1,2,3,4 then ellipsis then last page', () => {
    expect(getPageNumbers(2, 2657)).toEqual([1, 2, 3, 4, '...', 2657]);
  });

  test('page 3 shows 1,2,3,4 then ellipsis then last page', () => {
    expect(getPageNumbers(3, 2657)).toEqual([1, 2, 3, 4, '...', 2657]);
  });

  test('page 4 shows 1,2,3,4,5 then ellipsis then last page', () => {
    expect(getPageNumbers(4, 2657)).toEqual([1, 2, 3, 4, 5, '...', 2657]);
  });

  test('page 5 switches to sliding window: 1,...,4,5,6,...,last', () => {
    expect(getPageNumbers(5, 2657)).toEqual([1, '...', 4, 5, 6, '...', 2657]);
  });

  test('a page deep in the middle shows a sliding window around it', () => {
    expect(getPageNumbers(50, 2657)).toEqual([1, '...', 49, 50, 51, '...', 2657]);
  });

  test('does not duplicate the last page number when current page is near the end', () => {
    const result = getPageNumbers(2656, 2657);
    const lastPageOccurrences = result.filter((p) => p === 2657).length;
    expect(lastPageOccurrences).toBe(1);
  });

  test('does not duplicate page numbers when current page is near the start', () => {
    const result = getPageNumbers(2, 2657);
    const uniquePages = new Set(result.filter((p) => p !== '...'));
    expect(uniquePages.size).toBe(result.filter((p) => p !== '...').length);
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