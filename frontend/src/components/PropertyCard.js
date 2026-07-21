import React from 'react';
import './PropertyCard.css';

function getFirstPhoto(photosField) {
  if (!photosField) {
    return null;
  }
  try {
    const photos = JSON.parse(photosField);
    if (Array.isArray(photos) && photos.length > 0) {
      return photos[0];
    }
    return null;
  } catch {
    return null;
  }
}

function formatPrice(price) {
  if (price === null || price === undefined) return 'Price not available';
  return `$${Number(price).toLocaleString()}`;
}

function PropertyCard({ property }) {
  const firstPhoto = getFirstPhoto(property.L_Photos);

  return (
    <div className="property-card">
      <div className="property-card-image">
        {firstPhoto ? (
          <img src={firstPhoto} alt={property.L_Address || 'Property'} />
        ) : (
          <div className="property-card-no-image">No photo available</div>
        )}
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
  );
}

export default PropertyCard;