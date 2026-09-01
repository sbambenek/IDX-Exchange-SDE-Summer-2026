import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../hooks/FavoritesContext';
import './PropertyCard.css';
import PropTypes from 'prop-types';
import PropertyImageCarousel from './PropertyImageCarousel';
import { formatPrice } from '../utils/formatters';

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

PropertyCard.propTypes = {
  property: PropTypes.shape({
    L_ListingID: PropTypes.string.isRequired,
    L_Photos: PropTypes.string,
    L_Address: PropTypes.string,
    L_City: PropTypes.string,
    L_State: PropTypes.string,
    L_SystemPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    L_Keyword2: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    LM_Dec_3: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    LM_Int2_3: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  }).isRequired
};

export default PropertyCard;