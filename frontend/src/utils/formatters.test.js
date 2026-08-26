import { formatPrice } from './formatters';

test('formatPrice formats a number with dollar sign and commas', () => {
  expect(formatPrice(1250000)).toBe('$1,250,000');
});

test('formatPrice handles missing price', () => {
  expect(formatPrice(null)).toBe('Price not available');
});

test('formatPrice handles undefined price', () => {
  expect(formatPrice(undefined)).toBe('Price not available');
});