import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropertyCard from '../components/PropertyCard';
import PropertyFilters from '../components/PropertyFilters';
import Pagination from '../components/Pagination';
import { fetchProperties } from '../api/client';
import './ListingsPage.css';

const ITEMS_PER_PAGE = 20;

function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({});

  const latestRequestId = useRef(0);

  const loadProperties = useCallback(async (filters, page) => {
    const requestId = ++latestRequestId.current;
    setLoading(true);
    setError(null);

    try {
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const data = await fetchProperties({
        ...filters,
        limit: ITEMS_PER_PAGE,
        offset
      });

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
    loadProperties(activeFilters, currentPage);
  }, [loadProperties, activeFilters, currentPage]);

  function handleSearch(filters) {
    setActiveFilters(filters);
    setCurrentPage(1); // reset to page 1 on new filters
  }

  function handleClear() {
    setActiveFilters({});
    setCurrentPage(1);
  }

  function handlePageChange(page) {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const startItem = total === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, total);

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
            Showing {startItem}-{endItem} of {total} properties
          </p>
          {properties.length === 0 ? (
            <div className="listings-status">No properties found. Try adjusting your filters.</div>
          ) : (
            <>
              <div className="listings-grid">
                {properties.map((property) => (
                  <PropertyCard key={property.L_ListingID} property={property} />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default ListingsPage;