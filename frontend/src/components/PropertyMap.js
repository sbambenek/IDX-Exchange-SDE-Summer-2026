import React from 'react';
import './PropertyMap.css';

function PropertyMap({ lat, lng, address }) {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  if (!lat || !lng) {
    return null;
  }

  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&zoom=15`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div className="property-map">
      <iframe
        title={`Map showing ${address || 'property location'}`}
        width="100%"
        height="300"
        style={{ border: 0 }}
        loading="lazy"
        src={embedUrl}
      />
      <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="map-directions-link">
        Get Directions
      </a>
    </div>
  );
}

export default PropertyMap;