import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPropertyDetail, fetchOpenHouses } from '../api/client';
import PropertyImageGallery from '../components/PropertyImageGallery';
import PropertyMap from '../components/PropertyMap';
import './PropertyDetailPage.css';

function formatPrice(price) {
  if (price === null || price === undefined) return 'Price not available';
  return `$${Number(price).toLocaleString()}`;
}

function getOpenHouseRemarks(allDataField) {
  if (!allDataField) return null;
  try {
    const data = JSON.parse(allDataField);
    return data.OpenHouseRemarks || null;
  } catch {
    return null;
  }
}

function formatOpenHouseDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatTime(timeString) {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const hourNum = parseInt(hours, 10);
  const ampm = hourNum >= 12 ? 'PM' : 'AM';
  const displayHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [openHouses, setOpenHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [propertyData, openHouseData] = await Promise.all([
          fetchPropertyDetail(id),
          fetchOpenHouses(id)
        ]);
        if (isMounted) {
          setProperty(propertyData);
          setOpenHouses(openHouseData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <div className="detail-status">Loading property...</div>;
  }

  if (error) {
    return (
      <div className="detail-status detail-error">
        <p>Error: {error}</p>
        <Link to="/">Back to listings</Link>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="detail-status">
        <p>Property not found.</p>
        <Link to="/">Back to listings</Link>
      </div>
    );
  }

  return (
    <div className="property-detail-page">
      <Link to="/" className="detail-back-link">
        ← Back to listings
      </Link>
      <PropertyImageGallery photosField={property.L_Photos} />

      <h1 className="detail-price">{formatPrice(property.L_SystemPrice)}</h1>
      <p className="detail-address">{property.L_Address}</p>
      <p className="detail-location">
        {property.L_City}, {property.L_State} {property.L_Zip}
      </p>

      <div className="detail-stats">
        <span>{property.L_Keyword2 ?? '—'} beds</span>
        <span>{property.LM_Dec_3 ?? '—'} baths</span>
        <span>{property.LM_Int2_3 ? `${property.LM_Int2_3.toLocaleString()} sqft` : '— sqft'}</span>
        <span>Built {property.YearBuilt ?? '—'}</span>
      </div>

      <div className="detail-description">
        <h2>Description</h2>
        <p>{property.L_Remarks}</p>
      </div>

      <div className="detail-map-section">
        <h2>Location</h2>
        <PropertyMap
          lat={property.LMD_MP_Latitude}
          lng={property.LMD_MP_Longitude}
          address={property.L_Address}
        />
      </div>

      <div className="detail-open-houses">
        <h2>Open Houses</h2>
        {openHouses.length === 0 ? (
          <p>No open houses scheduled</p>
        ) : (
          <ul>
            {openHouses.map((oh) => {
              const remarks = getOpenHouseRemarks(oh.all_data);
              return (
                <li key={oh.id}>
                  <div>
                    {formatOpenHouseDate(oh.OpenHouseDate)} — {formatTime(oh.OH_StartTime)} to {formatTime(oh.OH_EndTime)}
                  </div>
                  {remarks && <p className="open-house-remarks">{remarks}</p>}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default PropertyDetailPage;