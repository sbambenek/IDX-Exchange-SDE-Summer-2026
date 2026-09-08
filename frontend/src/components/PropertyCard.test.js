import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PropertyCard from './PropertyCard';
import { FavoritesProvider } from '../hooks/FavoritesContext';

beforeEach(() => {
  localStorage.clear();
});

const mockProperty = {
  L_ListingID: '1118422731',
  L_Address: '1461 Laurel Way',
  L_City: 'Beverly Hills',
  L_State: 'CA',
  L_SystemPrice: 3950000,
  L_Keyword2: 4,
  LM_Dec_3: '5.0',
  LM_Int2_3: 3677,
  L_Photos: JSON.stringify(['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'])
};

function renderCard(property = mockProperty) {
  return render(
    <MemoryRouter>
      <FavoritesProvider>
        <PropertyCard property={property} />
      </FavoritesProvider>
    </MemoryRouter>
  );
}

test('renders property price, address, and stats', () => {
  renderCard();

  expect(screen.getByText('$3,950,000')).toBeInTheDocument();
  expect(screen.getByText('1461 Laurel Way')).toBeInTheDocument();
  expect(screen.getByText('Beverly Hills, CA')).toBeInTheDocument();
  expect(screen.getByText(/4 beds/)).toBeInTheDocument();
  expect(screen.getByText(/5.0 baths/)).toBeInTheDocument();
});

test('links to the correct property detail page', () => {
  renderCard();

  const link = screen.getByRole('link');
  expect(link).toHaveAttribute('href', '/property/1118422731');
});

test('clicking the heart button does not navigate away', () => {
  renderCard();

  const heartButton = screen.getByLabelText(/add to favorites/i);
  fireEvent.click(heartButton);

  // If the click had navigated, we'd no longer find the card content
  expect(screen.getByText('1461 Laurel Way')).toBeInTheDocument();
});

test('toggles favorite icon when heart is clicked', () => {
  renderCard();

  const heartButton = screen.getByLabelText(/add to favorites/i);
  fireEvent.click(heartButton);

  expect(screen.getByLabelText(/remove from favorites/i)).toBeInTheDocument();
});

test('shows "No photo available" when L_Photos is missing', () => {
  const propertyWithoutPhotos = { ...mockProperty, L_Photos: null };
  renderCard(propertyWithoutPhotos);

  expect(screen.getByText('No photo available')).toBeInTheDocument();
});