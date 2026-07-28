import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropertyCard from './PropertyCard';
import PropertyFilters from './PropertyFilters';
import { fetchProperties } from '../api/client';
import './ListingsPage.css';

function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tracks the most recent request so stale responses can be ignored
  const latestRequestId = useRef(0);

  const loadProperties = useCallback(async (filters = {}) => {
    const requestId = ++latestRequestId.current;
    setLoading(true);
    setError(null);

    try {
      const data = await fetchProperties(filters);

      // Ignore this response if a newer request has since been made
      if (requestId !== latestRequestId.current) {
        return;
      }

      setProperties(data.results);
      setTotal(data.total);
    } catch (err) {
      if (requestId !== latestRequestId.current) {
        return;
      }
      setError(err.message);
    } finally {
      if (requestId === latestRequestId.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  function handleSearch(filters) {
    loadProperties(filters);
  }

  function handleClear() {
    loadProperties();
  }

  return (
    <div className="listings-page">
      <h1 className="listings-title">Property Listings</h1>
      <PropertyFilters onSearch={handleSearch} onClear={handleClear} />

      {loading && <div className="listings-status">Loading properties...</div>}

      {!loading && error && (
        <div className="listings-status listings-error">Error: {error}</div>
      )}

      {!loading && !error && (
        <>
          <p className="listings-count">
            Showing {properties.length} of {total} properties
          </p>
          {properties.length === 0 ? (
            <div className="listings-status">No properties found. Try adjusting your filters.</div>
          ) : (
            <div className="listings-grid">
              {properties.map((property) => (
                <PropertyCard key={property.L_ListingID} property={property} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ListingsPage;