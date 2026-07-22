import React, { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import { fetchProperties } from '../api/client';
import './ListingsPage.css';

function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProperties() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProperties();
        if (isMounted) {
          setProperties(data.results);
          setTotal(data.total);
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

    loadProperties();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <div className="listings-status">Loading properties...</div>;
  }

  if (error) {
    return <div className="listings-status listings-error">Error: {error}</div>;
  }

  return (
    <div className="listings-page">
      <h1 className="listings-title">Property Listings</h1>
      <p className="listings-count">
        Showing {properties.length} of {total} properties
      </p>
      <div className="listings-grid">
        {properties.map((property) => (
          <PropertyCard key={property.L_ListingID} property={property} />
        ))}
      </div>
    </div>
  );
}

export default ListingsPage;