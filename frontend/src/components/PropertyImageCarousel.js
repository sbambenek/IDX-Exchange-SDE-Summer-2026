import React, { useState } from 'react';
import './PropertyImageCarousel.css';

function parsePhotos(photosField) {
  if (!photosField) return [];
  try {
    const photos = JSON.parse(photosField);
    return Array.isArray(photos) ? photos : [];
  } catch {
    return [];
  }
}

function PropertyImageCarousel({ photosField, alt }) {
  const photos = parsePhotos(photosField);
  const [index, setIndex] = useState(0);

  if (photos.length === 0) {
    return <div className="carousel-no-image">No photo available</div>;
  }

  function showPrev(e) {
    e.preventDefault();
    e.stopPropagation();
    setIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  }

  function showNext(e) {
    e.preventDefault();
    e.stopPropagation();
    setIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  }

  return (
    <div className="property-image-carousel">
      <img src={photos[index]} alt={alt || 'Property'} />

      {photos.length > 1 && (
        <>
          <button className="carousel-arrow carousel-prev" onClick={showPrev} aria-label="Previous photo">
            ‹
          </button>
          <button className="carousel-arrow carousel-next" onClick={showNext} aria-label="Next photo">
            ›
          </button>
          <div className="carousel-counter">
            {index + 1} / {photos.length}
          </div>
        </>
      )}
    </div>
  );
}

export default PropertyImageCarousel;