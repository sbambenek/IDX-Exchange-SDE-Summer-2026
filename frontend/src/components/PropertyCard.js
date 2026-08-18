import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../hooks/FavoritesContext';
import './PropertyCard.css';
import PropertyImageCarousel from './PropertyImageCarousel';

function formatPrice(price) {
  if (price === null || price === undefined) return 'Price not available';
  return `$${Number(price).toLocaleString()}`;
}

function PropertyCard({ property }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(property.L_ListingID);

  function handleHeartClick(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property.L_ListingID);
  }

  return (
    <Link to={`/property/${property.L_ListingID}`} className="property-card-link">
      <div className="property-card">
        <div className="property-card-image">
          <PropertyImageCarousel photosField={property.L_Photos} alt={property.L_Address} />
          <button
            className={`favorite-heart ${favorited ? 'favorite-heart-active' : ''}`}
            onClick={handleHeartClick}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            {favorited ? '♥' : '♡'}
          </button>
        </div>
        <div className="property-card-body">
          <p className="property-card-price">{formatPrice(property.L_SystemPrice)}</p>
          <p className="property-card-address">{property.L_Address}</p>
          <p className="property-card-location">
            {property.L_City}, {property.L_State}
          </p>
          <div className="property-card-details">
            <span>{property.L_Keyword2 ?? '—'} beds</span>
            <span>{property.LM_Dec_3 ?? '—'} baths</span>
            <span>{property.LM_Int2_3 ? `${property.LM_Int2_3.toLocaleString()} sqft` : '— sqft'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PropertyCard;