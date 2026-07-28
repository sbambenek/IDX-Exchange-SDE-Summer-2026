import { render, screen, fireEvent } from '@testing-library/react';
import PropertyFilters from './PropertyFilters';

test('renders all six filter inputs', () => {
  render(<PropertyFilters onSearch={() => {}} onClear={() => {}} />);

  expect(screen.getByPlaceholderText('City')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('ZIP code')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Min price')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Max price')).toBeInTheDocument();
  expect(screen.getByText('Beds (any)')).toBeInTheDocument();
  expect(screen.getByText('Baths (any)')).toBeInTheDocument();
});

test('calls onSearch with only the filled-in filter values', () => {
  const handleSearch = jest.fn();
  render(<PropertyFilters onSearch={handleSearch} onClear={() => {}} />);

  fireEvent.change(screen.getByPlaceholderText('City'), {
    target: { value: 'Beverly Hills' }
  });
  fireEvent.change(screen.getByPlaceholderText('Min price'), {
    target: { value: '300000' }
  });

  fireEvent.click(screen.getByText('Search'));

  expect(handleSearch).toHaveBeenCalledWith({
    city: 'Beverly Hills',
    minPrice: '300000'
  });
});

test('calls onClear and resets the form when Clear Filters is clicked', () => {
  const handleClear = jest.fn();
  render(<PropertyFilters onSearch={() => {}} onClear={handleClear} />);

  const cityInput = screen.getByPlaceholderText('City');
  fireEvent.change(cityInput, { target: { value: 'Oroville' } });
  expect(cityInput.value).toBe('Oroville');

  fireEvent.click(screen.getByText('Clear Filters'));

  expect(handleClear).toHaveBeenCalledTimes(1);
  expect(cityInput.value).toBe('');
});