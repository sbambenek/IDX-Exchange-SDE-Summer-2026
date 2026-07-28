import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Property Listings heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/property listings/i);
  expect(headingElement).toBeInTheDocument();
});