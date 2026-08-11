import React, { useState } from 'react';
import './PropertyImageGallery.css';

function parsePhotos(photosField) {
  if (!photosField) return [];
  try {
    const photos = JSON.parse(photosField);
    return Array.isArray(photos) ? photos : [];
  } catch {
    return [];
  }
}

function PropertyImageGallery({ photosField }) {
  const photos = parsePhotos(photosField);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (photos.length === 0) {
    return <div className="gallery-no-photos">No photos available</div>;
  }

  function openLightbox() {
    setLightboxOpen(true);
  }

  function closeLightbox() {
    setLightboxOpen(false);
  }

  function showPrev(e) {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  }

  function showNext(e) {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') setSelectedIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
    if (e.key === 'ArrowRight') setSelectedIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  }

  return (
    <div className="property-image-gallery">
      <div className="gallery-main-image" onClick={openLightbox}>
        <img src={photos[selectedIndex]} alt={`Property ${selectedIndex + 1}`} />
      </div>

      {photos.length > 1 && (
        <div className="gallery-thumbnail-strip">
          {photos.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`Thumbnail ${index + 1}`}
              className={index === selectedIndex ? 'thumbnail-active' : ''}
              onClick={() => setSelectedIndex(index)}
            />
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div
          className="gallery-lightbox"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          ref={(el) => el && el.focus()}
        >
          <button className="lightbox-arrow lightbox-prev" onClick={showPrev}>
            ‹
          </button>
          <img
            src={photos[selectedIndex]}
            alt={`Property ${selectedIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
          />
          <button className="lightbox-arrow lightbox-next" onClick={showNext}>
            ›
          </button>
          <button className="lightbox-close" onClick={closeLightbox}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default PropertyImageGallery;